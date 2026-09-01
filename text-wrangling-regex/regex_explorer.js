/**
 * Client-side Regex Explorer for Text Wrangling & Regex.
 * Evaluates RegExp in the browser without requiring a Python kernel.
 */

const GROUP_COLORS = [
  "#ffd54f", // amber
  "#80cbc4", // teal
  "#f48fb1", // pink
  "#90caf9", // blue
  "#c5e1a5", // green
  "#ce93d8", // purple
];

const DEFAULT_TEXT =
  '169.237.46.168 - - [26/Jan/2014:10:47:58 -0800] "GET /stat141/ HTTP/1.1" 200\n' +
  '193.205.203.3 - - [2/Feb/2005:17:23:06 -0800] "GET /notes/dim.html HTTP/1.0" 404\n' +
  '169.237.46.240 - - [3/Feb/2006:10:18:37 -0800] "GET /hw/hw1.pdf HTTP/1.1" 200\n';

const DEFAULT_PATTERN = "\\[(\\d+)/(\\w+)/(\\d+):(\\d+):(\\d+):(\\d+)";

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function legendHtml(numGroups) {
  if (numGroups === 0) return "";
  const chips = [];
  for (let i = 0; i < numGroups; i += 1) {
    const color = GROUP_COLORS[i % GROUP_COLORS.length];
    chips.push(
      `<span class="cs9-rx-chip" style="background:${color};">group ${i + 1}</span>`,
    );
  }
  return `<div class="cs9-rx-legend">${chips.join("")}</div>`;
}

function highlight(text, pattern, { ignorecase = false, multiline = false } = {}) {
  if (!pattern) {
    return "<p class='cs9-rx-hint'>Type a pattern above to see matches.</p>";
  }

  let regex;
  try {
    const flags = "g" + (ignorecase ? "i" : "") + (multiline ? "m" : "") + "d";
    regex = new RegExp(pattern, flags);
  } catch (err) {
    return `<p class='cs9-rx-error'>Not a valid pattern yet: ${escapeHtml(err.message)}</p>`;
  }

  const matches = [];
  let m;
  let safety = 0;
  while ((m = regex.exec(text)) !== null && safety++ < 1000) {
    if (m[0].length === 0) {
      regex.lastIndex += 1;
    }
    matches.push(m);
  }

  const numGroups = matches.length > 0 && matches[0].length ? matches[0].length - 1 : 0;

  let pieces = [];
  let cursor = 0;

  for (const match of matches) {
    const start = match.index;
    const end = match.index + match[0].length;

    if (start < cursor) {
      continue;
    }

    pieces.push(escapeHtml(text.slice(cursor, start)));

    if (numGroups === 0 || !match.indices) {
      pieces.push(
        `<span class="cs9-rx-match">${escapeHtml(text.slice(start, end))}</span>`,
      );
    } else {
      let inner = "";
      let innerCursor = start;
      const groupSpans = [];

      for (let gi = 1; gi <= numGroups; gi += 1) {
        if (match.indices[gi]) {
          const [gStart, gEnd] = match.indices[gi];
          if (gStart !== undefined && gEnd !== undefined) {
            groupSpans.push({ start: gStart, end: gEnd, gi });
          }
        }
      }

      groupSpans.sort((a, b) => a.start - b.start);

      for (const span of groupSpans) {
        if (span.start < innerCursor) continue;
        inner += escapeHtml(text.slice(innerCursor, span.start));
        const color = GROUP_COLORS[(span.gi - 1) % GROUP_COLORS.length];
        inner += `<span class="cs9-rx-group" style="background:${color};">${escapeHtml(
          text.slice(span.start, span.end),
        )}</span>`;
        innerCursor = span.end;
      }
      inner += escapeHtml(text.slice(innerCursor, end));
      pieces.push(`<span class="cs9-rx-match">${inner}</span>`);
    }

    cursor = end;
  }
  pieces.push(escapeHtml(text.slice(cursor)));

  const rendered = pieces.join("").replace(/\n/g, "<br>");
  let body = legendHtml(numGroups) + `<div class="cs9-rx-display">${rendered}</div>`;

  if (matches.length === 0) {
    body += "<p class='cs9-rx-hint'>No matches.</p>";
    return body;
  }

  const plural = matches.length !== 1 ? "es" : "";
  body += `<p class="cs9-rx-count">${matches.length} match${plural}.</p>`;

  if (numGroups > 0) {
    let header = "<th>match</th>";
    for (let i = 0; i < numGroups; i += 1) {
      header += `<th>group ${i + 1}</th>`;
    }

    let rows = "";
    for (const match of matches) {
      let cells = `<td><code>${escapeHtml(match[0])}</code></td>`;
      for (let gi = 1; gi <= numGroups; gi += 1) {
        const val = match[gi];
        const displayVal = val !== undefined ? escapeHtml(val) : "<i>None</i>";
        cells += `<td><code>${displayVal}</code></td>`;
      }
      rows += `<tr>${cells}</tr>`;
    }

    body += `<div class="cs9-rx-table-wrap"><table class="cs9-rx-table"><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  return body;
}

function render({ model, el }) {
  const getPattern = () => model.get("pattern") ?? DEFAULT_PATTERN;
  const getText = () => model.get("text") ?? DEFAULT_TEXT;
  const getIgnoreCase = () => Boolean(model.get("ignorecase"));
  const getMultiline = () => Boolean(model.get("multiline"));

  const setModel = (key, value) => {
    model.set(key, value);
    if (typeof model.save_changes === "function") {
      try {
        model.save_changes();
      } catch (_) {}
    }
  };

  const root = document.createElement("div");
  root.className = "cs9-rx";

  // Controls container
  const controls = document.createElement("div");
  controls.className = "cs9-rx-controls";

  // Pattern input
  const patternRow = document.createElement("div");
  patternRow.className = "cs9-rx-row";
  const patternLabel = document.createElement("label");
  patternLabel.className = "cs9-rx-label";
  patternLabel.textContent = "Pattern:";
  const patternInput = document.createElement("input");
  patternInput.type = "text";
  patternInput.className = "cs9-rx-input";
  patternInput.value = getPattern();
  patternInput.placeholder = "e.g. \\d+";
  patternRow.append(patternLabel, patternInput);

  // Flags checkboxes
  const flagsRow = document.createElement("div");
  flagsRow.className = "cs9-rx-flags";

  const icLabel = document.createElement("label");
  icLabel.className = "cs9-rx-checkbox-label";
  const icBox = document.createElement("input");
  icBox.type = "checkbox";
  icBox.checked = getIgnoreCase();
  icLabel.append(icBox, document.createTextNode(" IGNORECASE (i)"));

  const mlLabel = document.createElement("label");
  mlLabel.className = "cs9-rx-checkbox-label";
  const mlBox = document.createElement("input");
  mlBox.type = "checkbox";
  mlBox.checked = getMultiline();
  mlLabel.append(mlBox, document.createTextNode(" MULTILINE (m)"));

  flagsRow.append(icLabel, mlLabel);

  // Textarea for test string
  const textRow = document.createElement("div");
  textRow.className = "cs9-rx-row cs9-rx-text-row";
  const textLabel = document.createElement("label");
  textLabel.className = "cs9-rx-label";
  textLabel.textContent = "Text:";
  const textArea = document.createElement("textarea");
  textArea.className = "cs9-rx-textarea";
  textArea.rows = 4;
  textArea.value = getText();
  textRow.append(textLabel, textArea);

  // Output container
  const output = document.createElement("div");
  output.className = "cs9-rx-output";

  const paint = () => {
    const pat = getPattern();
    const txt = getText();
    const ic = getIgnoreCase();
    const ml = getMultiline();

    if (patternInput.value !== pat) patternInput.value = pat;
    if (textArea.value !== txt) textArea.value = txt;
    if (icBox.checked !== ic) icBox.checked = ic;
    if (mlBox.checked !== ml) mlBox.checked = ml;

    output.innerHTML = highlight(txt, pat, { ignorecase: ic, multiline: ml });
  };

  patternInput.addEventListener("input", () => {
    setModel("pattern", patternInput.value);
    paint();
  });

  textArea.addEventListener("input", () => {
    setModel("text", textArea.value);
    paint();
  });

  icBox.addEventListener("change", () => {
    setModel("ignorecase", icBox.checked);
    paint();
  });

  mlBox.addEventListener("change", () => {
    setModel("multiline", mlBox.checked);
    paint();
  });

  model.on("change:pattern", paint);
  model.on("change:text", paint);
  model.on("change:ignorecase", paint);
  model.on("change:multiline", paint);

  controls.append(patternRow, flagsRow, textRow);
  root.append(controls, output);
  el.appendChild(root);

  paint();

  return () => root.remove();
}

export default { render };
export { render };
