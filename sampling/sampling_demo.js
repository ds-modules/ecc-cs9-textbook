/**
 * Interactive Sampling Distribution of the Mean Explorer.
 * Runs entirely in the browser using JavaScript and SVG.
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

// Generate a fixed population of 5,000 scores (Mean ≈ 70, SD ≈ 12)
const POPULATION = (() => {
  const rng = mulberry32(42);
  const data = [];
  for (let i = 0; i < 5000; i += 1) {
    data.push(70.0 + 12.0 * gaussian(rng));
  }
  return data;
})();

const POP_MEAN = POPULATION.reduce((a, b) => a + b, 0) / POPULATION.length;
const POP_VAR =
  POPULATION.reduce((a, b) => a + (b - POP_MEAN) ** 2, 0) / POPULATION.length;
const POP_SD = Math.sqrt(POP_VAR);

function drawSampleMeans(population, sampleSize, nReps, seed) {
  const rng = mulberry32(seed);
  const popLen = population.length;
  const n = Math.max(1, sampleSize);
  const reps = Math.max(1, nReps);
  const means = [];

  for (let r = 0; r < reps; r += 1) {
    let sum = 0;
    for (let i = 0; i < n; i += 1) {
      const idx = Math.floor(rng() * popLen);
      sum += population[idx];
    }
    means.push(sum / n);
  }
  return means;
}

function histogramCounts(values, nBins, domain) {
  const bins = Math.max(1, Math.round(nBins));
  const [min, max] = domain;
  const span = max - min || 1;
  const width = span / bins;
  const counts = Array(bins).fill(0);

  for (const v of values) {
    let i = Math.floor((v - min) / width);
    if (i < 0) i = 0;
    if (i >= bins) i = bins - 1;
    counts[i] += 1;
  }
  return { counts, width, min, bins };
}

function ticks(min, max, count) {
  const span = max - min || 1;
  return Array.from({ length: count }, (_, i) => min + (span * i) / (count - 1));
}

function formatNumber(value, digits) {
  return Number(value).toFixed(digits);
}

function draw(svg, means, sampleSize) {
  const W = 640;
  const H = 260;
  const pad = { l: 48, r: 16, t: 24, b: 36 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;

  // Fixed visual domain centered around population mean 70
  const xMin = 56.0;
  const xMax = 84.0;
  const xSpan = xMax - xMin;
  const xOf = (x) => pad.l + ((x - xMin) / xSpan) * innerW;

  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.replaceChildren();

  const hist = histogramCounts(means, 24, [xMin, xMax]);
  const maxCount = Math.max(1, ...hist.counts);

  // Baseline axis
  const axis = svgEl("line", {
    x1: pad.l,
    x2: pad.l + innerW,
    y1: pad.t + innerH,
    y2: pad.t + innerH,
    class: "cs9-sd-axis",
  });
  const yAxis = svgEl("line", {
    x1: pad.l,
    x2: pad.l,
    y1: pad.t,
    y2: pad.t + innerH,
    class: "cs9-sd-axis",
  });
  svg.append(axis, yAxis);

  // Draw histogram bars
  hist.counts.forEach((count, i) => {
    const x0 = xMin + i * hist.width;
    const x1 = x0 + hist.width;
    const barH = (count / maxCount) * (innerH - 2);
    const rect = svgEl("rect", {
      x: xOf(x0) + 0.6,
      y: pad.t + innerH - barH,
      width: Math.max(1, xOf(x1) - xOf(x0) - 1.2),
      height: barH,
      class: "cs9-sd-bar",
    });
    svg.appendChild(rect);
  });

  // Reference line for True Population Mean
  const meanX = xOf(POP_MEAN);
  const popLine = svgEl("line", {
    x1: meanX,
    x2: meanX,
    y1: pad.t,
    y2: pad.t + innerH,
    class: "cs9-sd-ref-line",
  });
  svg.appendChild(popLine);

  // Labels & Ticks
  const label = (text, x, y, extra = {}) => {
    const node = svgEl("text", { x, y, class: "cs9-sd-label", ...extra });
    node.textContent = text;
    svg.appendChild(node);
  };

  label(`Sampling distribution of sample means (200 repetitions)`, pad.l, pad.t - 8);

  ticks(xMin, xMax, 8).forEach((tick) => {
    const x = xOf(tick);
    svg.appendChild(
      svgEl("line", {
        x1: x,
        x2: x,
        y1: pad.t + innerH,
        y2: pad.t + innerH + 5,
        class: "cs9-sd-axis",
      }),
    );
    label(formatNumber(tick, 0), x, H - 12, { "text-anchor": "middle" });
  });

  label("Count", 14, pad.t + innerH / 2, {
    transform: `rotate(-90 14 ${pad.t + innerH / 2})`,
    "text-anchor": "middle",
  });

  label(`True Mean (μ = ${formatNumber(POP_MEAN, 1)})`, meanX, pad.t + 14, {
    "text-anchor": "middle",
    class: "cs9-sd-ref-text",
  });
}

function render({ model, el }) {
  const getN = () => {
    const val = Number(model.get("sample_size"));
    return Number.isFinite(val) ? Math.min(200, Math.max(5, Math.round(val))) : 30;
  };
  const getSeed = () => {
    const s = Number(model.get("seed"));
    return Number.isFinite(s) ? s : 1;
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
  root.className = "cs9-sd";

  const svg = svgEl("svg", {
    width: "100%",
    role: "img",
    "aria-label": "Sampling distribution histogram",
  });

  // Controls
  const controlsRow = document.createElement("div");
  controlsRow.className = "cs9-sd-controls";

  const sliderLabel = document.createElement("label");
  sliderLabel.className = "cs9-sd-slider-label";
  const caption = document.createElement("span");
  caption.textContent = "Sample size n:";
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "5";
  slider.max = "200";
  slider.step = "5";
  slider.setAttribute("aria-label", "Sample size n");

  const outVal = document.createElement("output");
  outVal.className = "cs9-sd-value";
  outVal.setAttribute("aria-live", "polite");

  sliderLabel.append(caption, slider, outVal);

  const drawBtn = document.createElement("button");
  drawBtn.type = "button";
  drawBtn.className = "cs9-sd-btn";
  drawBtn.textContent = "Draw new samples";

  controlsRow.append(sliderLabel, drawBtn);

  const summary = document.createElement("p");
  summary.className = "cs9-sd-summary";

  const paint = () => {
    const n = getN();
    const seed = getSeed();
    slider.value = String(n);
    outVal.textContent = String(n);

    const means = drawSampleMeans(POPULATION, n, 200, seed);
    const meanOfMeans = means.reduce((a, b) => a + b, 0) / means.length;
    const sdOfMeans = Math.sqrt(
      means.reduce((a, b) => a + (b - meanOfMeans) ** 2, 0) / (means.length - 1),
    );
    const theoreticalSE = POP_SD / Math.sqrt(n);

    draw(svg, means, n);

    summary.innerHTML =
      `Mean of 200 sample means: <strong>${formatNumber(meanOfMeans, 2)}</strong> (True μ = ${formatNumber(POP_MEAN, 1)}) | ` +
      `Spread (SE): <strong>${formatNumber(sdOfMeans, 2)}</strong> (Theoretical σ/√n ≈ ${formatNumber(theoreticalSE, 2)})`;
  };

  slider.addEventListener("input", () => {
    setModel("sample_size", Number(slider.value));
    paint();
  });

  drawBtn.addEventListener("click", () => {
    setModel("seed", getSeed() + 1);
    paint();
  });

  model.on("change:sample_size", paint);
  model.on("change:seed", paint);

  root.append(svg, controlsRow, summary);
  el.appendChild(root);

  paint();

  return () => root.remove();
}

export default { render };
export { render };
