"""Interactive regex explorer for the Text Wrangling and Regex chapter.

A small in-browser version of regex101.com. Type a pattern, and the sample
text lights up wherever the pattern matches, with capture groups shown in
their own colors and listed in a table underneath.

The matching and highlighting logic lives in `highlight()`, a pure function
with no widget dependencies, so it can be tested without a Jupyter kernel.
The widget wiring lives in `run_regex_demo()`, which is what notebooks call.
"""

import html
import re

# A handful of colors for capture groups. Group 1 gets the first color,
# group 2 the second, and so on; they cycle if a pattern has many groups.
GROUP_COLORS = [
    "#ffd54f",  # amber
    "#80cbc4",  # teal
    "#f48fb1",  # pink
    "#90caf9",  # blue
    "#c5e1a5",  # green
    "#ce93d8",  # purple
]

# Sample text that shows up when the demo first loads. These are messy web
# server log lines, the same kind of data the chapter wrangles by hand before
# reaching for regex.
DEFAULT_TEXT = (
    "169.237.46.168 - - [26/Jan/2014:10:47:58 -0800] \"GET /stat141/ HTTP/1.1\" 200\n"
    "193.205.203.3 - - [2/Feb/2005:17:23:06 -0800] \"GET /notes/dim.html HTTP/1.0\" 404\n"
    "169.237.46.240 - - [3/Feb/2006:10:18:37 -0800] \"GET /hw/hw1.pdf HTTP/1.1\" 200\n"
)

# A pattern that pulls the date and time out of the square brackets. It has
# named-looking capture groups so the table below the text has something to show.
DEFAULT_PATTERN = r"\[(\d+)/(\w+)/(\d+):(\d+):(\d+):(\d+)"


def build_flags(ignorecase=False, multiline=False):
    """Turn the checkbox booleans into a combined `re` flag integer."""
    flags = 0
    if ignorecase:
        flags |= re.IGNORECASE
    if multiline:
        flags |= re.MULTILINE
    return flags


def _legend_html(num_groups):
    """A small color key explaining which color belongs to which group."""
    if num_groups == 0:
        return ""
    chips = []
    for i in range(num_groups):
        color = GROUP_COLORS[i % len(GROUP_COLORS)]
        chips.append(
            f"<span style='background:{color};padding:1px 6px;"
            f"border-radius:3px;margin-right:6px;'>group {i + 1}</span>"
        )
    return "<div style='margin-bottom:8px;font-size:0.85em;'>" + "".join(chips) + "</div>"


def highlight(text, pattern, flags=0):
    """Return an HTML string of `text` with every match of `pattern` marked up.

    Full matches are underlined; each capture group is shaded in its own color.
    A table of matches and their groups follows the marked-up text. If the
    pattern does not compile, a friendly error message is returned instead of
    raising, so the demo never crashes on a half-typed pattern.
    """
    if not pattern:
        return "<p style='color:#888;'>Type a pattern above to see matches.</p>"

    try:
        compiled = re.compile(pattern, flags)
    except re.error as err:
        return (
            "<p style='color:#c62828;'>Not a valid pattern yet: "
            f"{html.escape(str(err))}</p>"
        )

    matches = list(compiled.finditer(text))
    num_groups = compiled.groups

    # Walk the string left to right, copying untouched text verbatim and
    # wrapping matched spans. We escape every piece so the sample text cannot
    # inject its own HTML.
    pieces = []
    cursor = 0
    for m in matches:
        start, end = m.span()
        if start < cursor:
            # Overlapping or zero-width oddities: skip to stay in order.
            continue
        pieces.append(html.escape(text[cursor:start]))

        if num_groups == 0:
            inner = html.escape(text[start:end])
        else:
            # Shade each group within the match, leaving the rest of the
            # match plain. Groups are processed in order across the span.
            inner = ""
            inner_cursor = start
            spans = []
            for gi in range(1, num_groups + 1):
                if m.span(gi) != (-1, -1):
                    spans.append((m.span(gi)[0], m.span(gi)[1], gi))
            for gstart, gend, gi in sorted(spans):
                if gstart < inner_cursor:
                    continue
                inner += html.escape(text[inner_cursor:gstart])
                color = GROUP_COLORS[(gi - 1) % len(GROUP_COLORS)]
                inner += (
                    f"<span style='background:{color};border-radius:3px;'>"
                    f"{html.escape(text[gstart:gend])}</span>"
                )
                inner_cursor = gend
            inner += html.escape(text[inner_cursor:end])

        pieces.append(
            "<span style='border-bottom:2px solid #ff7043;'>" + inner + "</span>"
        )
        cursor = end
    pieces.append(html.escape(text[cursor:]))

    rendered = "".join(pieces).replace("\n", "<br>")
    body = (
        _legend_html(num_groups)
        + "<div style='font-family:monospace;white-space:pre-wrap;"
        "line-height:1.8;padding:10px;background:#fafafa;border:1px solid #eee;"
        "border-radius:4px;'>"
        + rendered
        + "</div>"
    )

    # Summary line plus a table of matches.
    if not matches:
        body += "<p style='margin-top:10px;color:#888;'>No matches.</p>"
        return body

    plural = "es" if len(matches) != 1 else ""
    body += f"<p style='margin-top:10px;'>{len(matches)} match{plural}.</p>"

    if num_groups > 0:
        header = "<th style='text-align:left;padding:2px 10px;'>match</th>"
        header += "".join(
            f"<th style='text-align:left;padding:2px 10px;'>group {i + 1}</th>"
            for i in range(num_groups)
        )
        rows = ""
        for m in matches:
            cells = (
                f"<td style='padding:2px 10px;'><code>{html.escape(m.group(0))}</code></td>"
            )
            for gi in range(1, num_groups + 1):
                value = m.group(gi)
                shown = html.escape(value) if value is not None else "<i>None</i>"
                cells += f"<td style='padding:2px 10px;'><code>{shown}</code></td>"
            rows += f"<tr>{cells}</tr>"
        body += (
            "<table style='margin-top:6px;border-collapse:collapse;font-size:0.9em;'>"
            f"<tr>{header}</tr>{rows}</table>"
        )
    return body


def run_regex_demo(text=DEFAULT_TEXT, pattern=DEFAULT_PATTERN):
    """Display the interactive regex explorer.

    Call this from a notebook cell. The widgets are live once the page runs on
    a kernel (for example, after launching Binder).
    """
    import ipywidgets as widgets
    from IPython.display import HTML, display

    text_box = widgets.Textarea(
        value=text,
        description="Text",
        layout=widgets.Layout(width="100%", height="110px"),
        style={"description_width": "60px"},
    )
    pattern_box = widgets.Text(
        value=pattern,
        description="Pattern",
        layout=widgets.Layout(width="100%"),
        style={"description_width": "60px"},
    )
    ignorecase_box = widgets.Checkbox(value=False, description="IGNORECASE", indent=False)
    multiline_box = widgets.Checkbox(value=False, description="MULTILINE", indent=False)
    out = widgets.Output()

    def render(_change=None):
        flags = build_flags(ignorecase_box.value, multiline_box.value)
        with out:
            out.clear_output(wait=True)
            display(HTML(highlight(text_box.value, pattern_box.value, flags)))

    for w in (text_box, pattern_box, ignorecase_box, multiline_box):
        w.observe(render, names="value")

    ui = widgets.VBox(
        [
            pattern_box,
            widgets.HBox([ignorecase_box, multiline_box]),
            text_box,
            out,
        ]
    )
    display(ui)
    render()
    return ui
