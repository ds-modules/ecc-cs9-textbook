"""Interactive density explorer for the Visualization chapter.

A small live demo of histograms and kernel density estimates (KDE). Move the
sliders for bin width and bandwidth, and watch how the same data can look
smooth or spiky depending on those choices.

The plotting logic lives in `draw_density()`, a pure function with no widget
dependencies, so it can be tested without a Jupyter kernel. The widget wiring
lives in `run_kde_demo()`, which is what notebooks call.
"""

import numpy as np

# A fixed sample that shows up when the demo first loads: a mild mixture of
# two bumps, so students can see both oversmoothing and undersmoothing.
RNG = np.random.default_rng(0)
DEFAULT_DATA = np.concatenate(
    [
        RNG.normal(loc=-1.5, scale=0.6, size=80),
        RNG.normal(loc=1.2, scale=0.5, size=60),
    ]
)


def kde_curve(data, xs, bandwidth):
    """Gaussian KDE evaluated at `xs` (NumPy only; no SciPy required)."""
    data = np.asarray(data, dtype=float)
    bandwidth = max(float(bandwidth), 1e-6)
    # Standard normal kernel, averaged over data points.
    z = (xs[None, :] - data[:, None]) / bandwidth
    dens = np.exp(-0.5 * z * z).sum(axis=0)
    dens /= len(data) * bandwidth * np.sqrt(2 * np.pi)
    return dens


def draw_density(data, bin_width=0.5, bandwidth=0.4, ax=None):
    """Draw a histogram and KDE for `data` on the given (or a new) axes.

    `bin_width` controls histogram bin size. `bandwidth` controls how much the
    KDE smooths. Returns the matplotlib Axes.
    """
    import matplotlib.pyplot as plt

    data = np.asarray(data, dtype=float)
    if ax is None:
        _, ax = plt.subplots(figsize=(7, 3.5))

    data_min, data_max = float(np.min(data)), float(np.max(data))
    span = max(data_max - data_min, 1e-6)
    pad = 0.15 * span
    left, right = data_min - pad, data_max + pad

    bin_width = max(float(bin_width), 0.05)
    bins = np.arange(left, right + bin_width, bin_width)
    ax.hist(
        data,
        bins=bins,
        density=True,
        alpha=0.45,
        color="#90caf9",
        edgecolor="white",
        label="histogram",
    )

    bandwidth = max(float(bandwidth), 0.05)
    xs = np.linspace(left, right, 300)
    ax.plot(xs, kde_curve(data, xs, bandwidth), color="#c62828", linewidth=2, label="KDE")

    ax.set_xlim(left, right)
    ax.set_xlabel("value")
    ax.set_ylabel("density")
    ax.set_title(f"bin width = {bin_width:.2f}, bandwidth = {bandwidth:.2f}")
    ax.legend(loc="upper right", frameon=False)
    return ax


def run_kde_demo(data=None):
    """Display the interactive density explorer.

    Call this from a notebook cell. The widgets are live once the page runs on
    a kernel (for example, after launching Binder).
    """
    import matplotlib.pyplot as plt
    import ipywidgets as widgets
    from IPython.display import display

    if data is None:
        data = DEFAULT_DATA

    bin_slider = widgets.FloatSlider(
        value=0.5,
        min=0.15,
        max=1.5,
        step=0.05,
        description="Bin width",
        continuous_update=False,
        style={"description_width": "90px"},
        layout=widgets.Layout(width="90%"),
    )
    bw_slider = widgets.FloatSlider(
        value=0.4,
        min=0.1,
        max=1.5,
        step=0.05,
        description="Bandwidth",
        continuous_update=False,
        style={"description_width": "90px"},
        layout=widgets.Layout(width="90%"),
    )
    out = widgets.Output()

    def render(_change=None):
        with out:
            out.clear_output(wait=True)
            fig, ax = plt.subplots(figsize=(7, 3.5))
            draw_density(data, bin_width=bin_slider.value, bandwidth=bw_slider.value, ax=ax)
            display(fig)
            plt.close(fig)

    for w in (bin_slider, bw_slider):
        w.observe(render, names="value")

    ui = widgets.VBox([bin_slider, bw_slider, out])
    display(ui)
    render()
