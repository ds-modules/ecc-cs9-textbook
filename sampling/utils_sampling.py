"""Interactive sampling demo for the Sampling chapter.

Draw many random samples from a fixed population and watch the sampling
distribution of the sample mean. Change the sample size and see how the
spread of those means shrinks — the same idea behind why larger surveys are
more stable.

The sampling logic lives in `sample_means()`, a pure function with no widget
dependencies. The widget wiring lives in `run_sampling_demo()`.
"""

import numpy as np

# A fixed population of exam-style scores. The true mean is known, so students
# can compare each sample mean to the vertical reference line.
RNG = np.random.default_rng(1)
DEFAULT_POPULATION = RNG.normal(loc=70, scale=12, size=5000)


def sample_means(population, sample_size=30, n_samples=200, seed=None):
    """Draw `n_samples` samples of size `sample_size` and return their means.

    Sampling is with replacement from `population`. Returns a 1-d array of
    length `n_samples`.
    """
    population = np.asarray(population, dtype=float)
    sample_size = max(int(sample_size), 1)
    n_samples = max(int(n_samples), 1)
    rng = np.random.default_rng(seed)
    # Vectorized: one big draw, then reshape and average each row.
    draws = rng.choice(population, size=(n_samples, sample_size), replace=True)
    return draws.mean(axis=1)


def draw_sampling_distribution(population, sample_size=30, n_samples=200, seed=None, ax=None):
    """Plot the sampling distribution of the mean for the given settings.

    Returns the matplotlib Axes.
    """
    import matplotlib.pyplot as plt

    population = np.asarray(population, dtype=float)
    means = sample_means(population, sample_size=sample_size, n_samples=n_samples, seed=seed)
    pop_mean = float(np.mean(population))

    if ax is None:
        _, ax = plt.subplots(figsize=(7, 3.5))

    ax.hist(means, bins=25, color="#80cbc4", edgecolor="white", alpha=0.9)
    ax.axvline(pop_mean, color="#c62828", linewidth=2, label=f"population mean = {pop_mean:.1f}")
    ax.set_xlabel("sample mean")
    ax.set_ylabel("count")
    ax.set_title(
        f"{n_samples} samples of size n = {sample_size}  "
        f"(SD of means ≈ {float(np.std(means, ddof=1)):.2f})"
    )
    ax.legend(loc="upper right", frameon=False)
    return ax


def run_sampling_demo(population=None):
    """Display the interactive sampling-distribution explorer.

    Call this from a notebook cell. The widgets are live once the page runs on
    a kernel (for example, after launching Binder).
    """
    import matplotlib.pyplot as plt
    import ipywidgets as widgets
    from IPython.display import display

    if population is None:
        population = DEFAULT_POPULATION

    size_slider = widgets.IntSlider(
        value=30,
        min=5,
        max=200,
        step=5,
        description="Sample size n",
        continuous_update=False,
        style={"description_width": "100px"},
        layout=widgets.Layout(width="90%"),
    )
    reps_slider = widgets.IntSlider(
        value=200,
        min=50,
        max=500,
        step=25,
        description="# of samples",
        continuous_update=False,
        style={"description_width": "100px"},
        layout=widgets.Layout(width="90%"),
    )
    redraw_btn = widgets.Button(description="Redraw samples", button_style="primary")
    out = widgets.Output()
    seed_box = {"seed": 0}

    def render(_change=None):
        with out:
            out.clear_output(wait=True)
            fig, ax = plt.subplots(figsize=(7, 3.5))
            draw_sampling_distribution(
                population,
                sample_size=size_slider.value,
                n_samples=reps_slider.value,
                seed=seed_box["seed"],
                ax=ax,
            )
            display(fig)
            plt.close(fig)

    def on_redraw(_btn):
        seed_box["seed"] += 1
        render()

    for w in (size_slider, reps_slider):
        w.observe(render, names="value")
    redraw_btn.on_click(on_redraw)

    ui = widgets.VBox([size_slider, reps_slider, redraw_btn, out])
    display(ui)
    render()
