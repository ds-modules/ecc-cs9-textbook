/**
 * Interactive Model Complexity & Generalization Explorer for Modeling III.
 * Fits polynomial regressions on the client side using pure JS and SVG.
 */

const NS = "http://www.w3.org/2000/svg";

function svgEl(name, attrs = {}) {
  const node = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, String(value));
  }
  return node;
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return function rng() {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rng) {
  const u = Math.max(rng(), 1e-12);
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// Generate fixed dataset: 80 points with train/test split (65% train, 35% test)
const { trainData, testData } = (() => {
  const rng = mulberry32(2);
  const N = 80;
  const all = [];
  for (let i = 0; i < N; i += 1) {
    const x = -3.0 + (6.0 * i) / (N - 1);
    const y = Math.sin(x) + 0.35 * gaussian(rng);
    all.push({ x, y });
  }

  // Deterministic shuffle for split
  const shuffleRng = mulberry32(2024);
  const shuffled = [...all];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(shuffleRng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const nTrain = 52;
  return {
    trainData: shuffled.slice(0, nTrain),
    testData: shuffled.slice(nTrain),
  };
})();

// Pure JS linear least squares solver
function solveLinearSystem(A, b) {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let k = 0; k < n; k += 1) {
    let maxRow = k;
    for (let i = k + 1; i < n; i += 1) {
      if (Math.abs(M[i][k]) > Math.abs(M[maxRow][k])) maxRow = i;
    }
    [M[k], M[maxRow]] = [M[maxRow], M[k]];
    const pivot = M[k][k];
    if (Math.abs(pivot) < 1e-12) continue;
    for (let j = k; j <= n; j += 1) M[k][j] /= pivot;
    for (let i = 0; i < n; i += 1) {
      if (i === k) continue;
      const factor = M[i][k];
      for (let j = k; j <= n; j += 1) M[i][j] -= factor * M[k][j];
    }
  }
  return M.map((row) => row[n]);
}

function polyFit(data, degree) {
  const d = degree + 1;
  const ATA = Array.from({ length: d }, () => Array(d).fill(0));
  const ATy = Array(d).fill(0);

  for (const pt of data) {
    const powers = Array(d).fill(1);
    for (let p = 1; p < d; p += 1) powers[p] = powers[p - 1] * pt.x;
    for (let r = 0; r < d; r += 1) {
      ATy[r] += powers[r] * pt.y;
      for (let c = 0; c < d; c += 1) {
        ATA[r][c] += powers[r] * powers[c];
      }
    }
  }
  return solveLinearSystem(ATA, ATy);
}

function polyEval(coeffs, x) {
  let val = 0;
  for (let p = coeffs.length - 1; p >= 0; p -= 1) {
    val = val * x + coeffs[p];
  }
  return val;
}

function computeRMSE(data, coeffs) {
  const mse =
    data.reduce((acc, pt) => acc + (pt.y - polyEval(coeffs, pt.x)) ** 2, 0) /
    data.length;
  return Math.sqrt(mse);
}

function formatNumber(value, digits) {
  return Number(value).toFixed(digits);
}

function drawFit(svg, degree, coeffs) {
  const W = 640;
  const H = 280;
  const pad = { l: 46, r: 16, t: 24, b: 36 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;

  const xMin = -3.2;
  const xMax = 3.2;
  const yMin = -2.0;
  const yMax = 2.0;

  const xOf = (x) => pad.l + ((x - xMin) / (xMax - xMin)) * innerW;
  const yOf = (y) => pad.t + ((yMax - y) / (yMax - yMin)) * innerH;

  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.replaceChildren();

  // Axes
  svg.appendChild(
    svgEl("line", {
      x1: pad.l,
      x2: pad.l + innerW,
      y1: yOf(0),
      y2: yOf(0),
      class: "cs9-mc-grid-zero",
    }),
  );
  svg.appendChild(
    svgEl("line", {
      x1: pad.l,
      x2: pad.l + innerW,
      y1: pad.t + innerH,
      y2: pad.t + innerH,
      class: "cs9-mc-axis",
    }),
  );
  svg.appendChild(
    svgEl("line", {
      x1: pad.l,
      x2: pad.l,
      y1: pad.t,
      y2: pad.t + innerH,
      class: "cs9-mc-axis",
    }),
  );

  // Fitted polynomial curve
  const steps = 120;
  const pathParts = [];
  for (let i = 0; i <= steps; i += 1) {
    const x = xMin + ((xMax - xMin) * i) / steps;
    const y = Math.max(yMin - 0.5, Math.min(yMax + 0.5, polyEval(coeffs, x)));
    const px = xOf(x);
    const py = yOf(y);
    pathParts.push(`${i === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)}`);
  }
  svg.appendChild(
    svgEl("path", {
      d: pathParts.join(" "),
      class: "cs9-mc-curve",
    }),
  );

  // Training points (blue circles)
  for (const pt of trainData) {
    svg.appendChild(
      svgEl("circle", {
        cx: xOf(pt.x),
        cy: yOf(pt.y),
        r: 3.5,
        class: "cs9-mc-train-pt",
      }),
    );
  }

  // Test points (orange squares)
  for (const pt of testData) {
    const s = 6;
    svg.appendChild(
      svgEl("rect", {
        x: xOf(pt.x) - s / 2,
        y: yOf(pt.y) - s / 2,
        width: s,
        height: s,
        class: "cs9-mc-test-pt",
      }),
    );
  }

  // Labels & Legend
  const label = (text, x, y, extra = {}) => {
    const node = svgEl("text", { x, y, class: "cs9-mc-label", ...extra });
    node.textContent = text;
    svg.appendChild(node);
  };

  label(`Fitted Polynomial (Degree ${degree})`, pad.l, pad.t - 8);

  [-3, -2, -1, 0, 1, 2, 3].forEach((tick) => {
    label(String(tick), xOf(tick), H - 12, { "text-anchor": "middle" });
  });

  [-1.5, -1, -0.5, 0, 0.5, 1, 1.5].forEach((tick) => {
    label(String(tick), pad.l - 6, yOf(tick) + 4, { "text-anchor": "end" });
  });

  // Legend at top right
  const legX = W - 220;
  const legY = pad.t + 4;
  svg.appendChild(
    svgEl("circle", { cx: legX, cy: legY, r: 4, class: "cs9-mc-train-pt" }),
  );
  label("Train data (52)", legX + 10, legY + 4);

  svg.appendChild(
    svgEl("rect", {
      x: legX + 100,
      y: legY - 4,
      width: 8,
      height: 8,
      class: "cs9-mc-test-pt",
    }),
  );
  label("Test data (28)", legX + 114, legY + 4);
}

function render({ model, el }) {
  const getDegree = () => {
    const d = Number(model.get("degree"));
    return Number.isFinite(d) ? Math.min(10, Math.max(1, Math.round(d))) : 3;
  };

  const setModel = (key, val) => {
    model.set(key, val);
    if (typeof model.save_changes === "function") {
      try {
        model.save_changes();
      } catch (_) {}
    }
  };

  const root = document.createElement("div");
  root.className = "cs9-mc";

  const svg = svgEl("svg", {
    width: "100%",
    role: "img",
    "aria-label": "Polynomial regression fit on train/test data",
  });

  // Slider controls
  const controlsRow = document.createElement("div");
  controlsRow.className = "cs9-mc-controls";

  const sliderLabel = document.createElement("label");
  sliderLabel.className = "cs9-mc-slider-label";
  const caption = document.createElement("span");
  caption.textContent = "Polynomial Degree:";
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "1";
  slider.max = "10";
  slider.step = "1";
  slider.setAttribute("aria-label", "Polynomial Degree");

  const outVal = document.createElement("output");
  outVal.className = "cs9-mc-value";
  outVal.setAttribute("aria-live", "polite");

  sliderLabel.append(caption, slider, outVal);
  controlsRow.appendChild(sliderLabel);

  const errorBadges = document.createElement("div");
  errorBadges.className = "cs9-mc-badges";

  const paint = () => {
    const deg = getDegree();
    slider.value = String(deg);
    outVal.textContent = String(deg);

    const coeffs = polyFit(trainData, deg);
    const trainRMSE = computeRMSE(trainData, coeffs);
    const testRMSE = computeRMSE(testData, coeffs);

    drawFit(svg, deg, coeffs);

    let stateNote = "";
    if (deg <= 2) {
      stateNote = `<span class="cs9-mc-tag cs9-mc-tag-under">Underfitting</span> (high bias: model too simple)`;
    } else if (deg >= 7) {
      stateNote = `<span class="cs9-mc-tag cs9-mc-tag-over">Overfitting</span> (high variance: memorizing noise in training set)`;
    } else {
      stateNote = `<span class="cs9-mc-tag cs9-mc-tag-good">Balanced fit</span> (good generalization to unseen test data)`;
    }

    errorBadges.innerHTML = `
      <div class="cs9-mc-stats">
        <span>Train RMSE: <strong class="cs9-mc-train-text">${formatNumber(trainRMSE, 3)}</strong></span>
        <span>Test RMSE: <strong class="cs9-mc-test-text">${formatNumber(testRMSE, 3)}</strong></span>
      </div>
      <div class="cs9-mc-diag">${stateNote}</div>
    `;
  };

  slider.addEventListener("input", () => {
    setModel("degree", Number(slider.value));
    paint();
  });

  model.on("change:degree", paint);

  root.append(svg, controlsRow, errorBadges);
  el.appendChild(root);

  paint();

  return () => root.remove();
}

export default { render };
export { render };
