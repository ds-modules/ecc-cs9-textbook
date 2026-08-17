/**
 * Histogram and KDE explorer for Visualization I.
 * All drawing and density estimates run in the browser from a fixed sample.
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

/** Fixed sample with two clusters, so binning and smoothing can hide or reveal peaks. */
const SAMPLE = (() => {
  const rng = mulberry32(2026);
  const values = [];
  for (let i = 0; i < 80; i += 1) values.push(-1.35 + 0.36 * gaussian(rng));
  for (let i = 0; i < 60; i += 1) values.push(1.2 + 0.3 * gaussian(rng));
  return values;
})();

function histogramCounts(values, nBins, domain) {
  const bins = Math.max(1, Math.round(nBins));
  const [min, max] = domain;
  const span = max - min || 1;
  const width = span / bins;
  const counts = Array(bins).fill(0);
  for (const value of values) {
    let index = Math.floor((value - min) / width);
    if (index < 0) index = 0;
    if (index >= bins) index = bins - 1;
    counts[index] += 1;
  }
  return { counts, width, min, bins };
}

function gaussianKernel(u) {
  return Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
}

function kdeEstimate(values, bandwidth, grid) {
  const n = values.length;
  const h = Math.max(bandwidth, 0.02);
  const scale = 1 / (n * h);
  return grid.map((x) => {
    let sum = 0;
    for (let i = 0; i < n; i += 1) {
      sum += gaussianKernel((x - values[i]) / h);
    }
    return sum * scale;
  });
}

function ticks(min, max, count) {
  const span = max - min || 1;
  return Array.from({ length: count }, (_, i) => min + (span * i) / (count - 1));
}

function formatNumber(value, digits) {
  return Number(value).toFixed(digits);
}

function draw(svg, values, nBins, bandwidth) {
  const W = 640;
  const H = 420;
  const pad = { l: 48, r: 16, t: 28, b: 36 };
  const gap = 28;
  const innerW = W - pad.l - pad.r;
  const usableH = H - pad.t - pad.b - gap;
  const histH = usableH * 0.52;
  const kdeH = usableH * 0.48;
  const histTop = pad.t;
  const kdeTop = pad.t + histH + gap;

  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const padX = 0.85;
  const xMin = dataMin - padX;
  const xMax = dataMax + padX;
  const xSpan = xMax - xMin || 1;
  const xOf = (x) => pad.l + ((x - xMin) / xSpan) * innerW;

  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.replaceChildren();

  const hist = histogramCounts(values, nBins, [dataMin, dataMax]);
  const maxCount = Math.max(1, ...hist.counts);
  const grid = ticks(xMin, xMax, 160);
  const density = kdeEstimate(values, bandwidth, grid);
  const maxDensity = Math.max(1e-6, ...density);

  const plotFrame = (top, height) => {
    const axis = svgEl("line", {
      x1: pad.l,
      x2: pad.l + innerW,
      y1: top + height,
      y2: top + height,
      class: "cs9-hk-axis",
    });
    const yAxis = svgEl("line", {
      x1: pad.l,
      x2: pad.l,
      y1: top,
      y2: top + height,
      class: "cs9-hk-axis",
    });
    svg.append(axis, yAxis);
  };

  plotFrame(histTop, histH);
  plotFrame(kdeTop, kdeH);

  hist.counts.forEach((count, i) => {
    const x0 = xMin + i * hist.width;
    const x1 = x0 + hist.width;
    const barH = (count / maxCount) * (histH - 2);
    const rect = svgEl("rect", {
      x: xOf(x0) + 0.6,
      y: histTop + histH - barH,
      width: Math.max(1, xOf(x1) - xOf(x0) - 1.2),
      height: barH,
      class: "cs9-hk-bar",
    });
    svg.appendChild(rect);
  });

  const kdePath = density
    .map((y, i) => {
      const px = xOf(grid[i]);
      const py = kdeTop + kdeH - (y / maxDensity) * (kdeH - 2);
      return `${i === 0 ? "M" : "L"}${px.toFixed(2)} ${py.toFixed(2)}`;
    })
    .join(" ");
  svg.appendChild(svgEl("path", { d: kdePath, class: "cs9-hk-kde" }));

  const label = (text, x, y, extra = {}) => {
    const node = svgEl("text", { x, y, class: "cs9-hk-label", ...extra });
    node.textContent = text;
    svg.appendChild(node);
  };

  label("Histogram (counts)", pad.l, histTop - 8);
  label("KDE", pad.l, kdeTop - 8);

  ticks(xMin, xMax, 5).forEach((tick) => {
    const x = xOf(tick);
    svg.appendChild(
      svgEl("line", {
        x1: x,
        x2: x,
        y1: kdeTop + kdeH,
        y2: kdeTop + kdeH + 5,
        class: "cs9-hk-axis",
      }),
    );
    label(formatNumber(tick, 1), x, H - 12, { "text-anchor": "middle" });
  });

  label("Count", 14, histTop + histH / 2, {
    transform: `rotate(-90 14 ${histTop + histH / 2})`,
    "text-anchor": "middle",
  });
  label("Density", 14, kdeTop + kdeH / 2, {
    transform: `rotate(-90 14 ${kdeTop + kdeH / 2})`,
    "text-anchor": "middle",
  });
}

function controlRow(labelText, input, valueNode) {
  const row = document.createElement("div");
  row.className = "cs9-hk-row";
  const label = document.createElement("label");
  label.className = "cs9-hk-label-text";
  const caption = document.createElement("span");
  caption.textContent = labelText;
  label.append(caption, input);
  row.append(label, valueNode);
  return row;
}

function render({ model, el }) {
  const values = SAMPLE;
  const getBins = () => {
    const n = Number(model.get("n_bins"));
    return Number.isFinite(n) ? Math.min(30, Math.max(4, Math.round(n))) : 12;
  };
  const getBandwidth = () => {
    const h = Number(model.get("bandwidth"));
    return Number.isFinite(h) ? Math.min(1.2, Math.max(0.1, h)) : 0.35;
  };
  const setValue = (key, value) => {
    model.set(key, value);
  };

  const root = document.createElement("div");
  root.className = "cs9-hk";

  const svg = svgEl("svg", {
    width: "100%",
    role: "img",
    "aria-label":
      "Histogram and kernel density estimate for the same sample of 140 observations",
  });

  const binInput = document.createElement("input");
  binInput.type = "range";
  binInput.min = "4";
  binInput.max = "30";
  binInput.step = "1";
  binInput.setAttribute("aria-label", "Number of histogram bins");

  const binOut = document.createElement("output");
  binOut.className = "cs9-hk-value";
  binOut.setAttribute("aria-live", "polite");

  const bwInput = document.createElement("input");
  bwInput.type = "range";
  bwInput.min = "0.10";
  bwInput.max = "1.20";
  bwInput.step = "0.05";
  bwInput.setAttribute("aria-label", "KDE bandwidth");

  const bwOut = document.createElement("output");
  bwOut.className = "cs9-hk-value";
  bwOut.setAttribute("aria-live", "polite");

  const caption = document.createElement("p");
  caption.className = "cs9-hk-caption";
  caption.textContent = `n = ${values.length} observations. The sample stays the same.`;

  const paint = () => {
    const nBins = getBins();
    const bandwidth = getBandwidth();
    binInput.value = String(nBins);
    bwInput.value = String(bandwidth);
    binOut.textContent = String(nBins);
    bwOut.textContent = formatNumber(bandwidth, 2);
    draw(svg, values, nBins, bandwidth);
  };

  binInput.addEventListener("input", () => setValue("n_bins", Number(binInput.value)));
  bwInput.addEventListener("input", () => setValue("bandwidth", Number(bwInput.value)));
  model.on("change:n_bins", paint);
  model.on("change:bandwidth", paint);
  paint();

  root.append(
    svg,
    controlRow("Number of bins", binInput, binOut),
    controlRow("KDE bandwidth", bwInput, bwOut),
    caption,
  );
  el.appendChild(root);

  return () => root.remove();
}

export default { render };
export { render };
