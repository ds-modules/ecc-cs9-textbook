"""Interactive model-complexity demo for Modeling III.

Fit polynomial regressions of different degrees on the same noisy curve and
compare training error to test error. As the degree climbs, training error
usually falls — but test error often rises. That gap is overfitting made
visible.

The fitting logic lives in `fit_poly_errors()` and `draw_complexity()`, which
have no widget dependencies. The widget wiring lives in `run_complexity_demo()`.
"""

import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PolynomialFeatures

# A fixed nonlinear signal with noise. Students always see the same train/test
# split so moving the degree slider is the only thing that changes.
RNG = np.random.default_rng(2)
_X_RAW = np.linspace(-3, 3, 80)
_Y_RAW = np.sin(_X_RAW) + 0.35 * RNG.normal(size=_X_RAW.size)
DEFAULT_X_TRAIN, DEFAULT_X_TEST, DEFAULT_Y_TRAIN, DEFAULT_Y_TEST = train_test_split(
    _X_RAW, _Y_RAW, test_size=0.35, random_state=2
)


def fit_poly_errors(x_train, y_train, x_test, y_test, degree=3):
    """Fit a polynomial of the given degree and return train/test RMSE.

    Returns ``(model, poly, train_rmse, test_rmse)``.
    """
    degree = max(int(degree), 1)
    poly = PolynomialFeatures(degree=degree, include_bias=True)
    Xtr = poly.fit_transform(np.asarray(x_train).reshape(-1, 1))
    Xte = poly.transform(np.asarray(x_test).reshape(-1, 1))
    model = LinearRegression()
    model.fit(Xtr, y_train)
    train_pred = model.predict(Xtr)
    test_pred = model.predict(Xte)
    train_rmse = float(np.sqrt(mean_squared_error(y_train, train_pred)))
    test_rmse = float(np.sqrt(mean_squared_error(y_test, test_pred)))
    return model, poly, train_rmse, test_rmse


def draw_complexity(x_train, y_train, x_test, y_test, degree=3, ax=None):
    """Plot data, fitted curve, and report train/test RMSE on the axes title.

    Returns ``(ax, train_rmse, test_rmse)``.
    """
    import matplotlib.pyplot as plt

    model, poly, train_rmse, test_rmse = fit_poly_errors(
        x_train, y_train, x_test, y_test, degree=degree
    )

    if ax is None:
        _, ax = plt.subplots(figsize=(7, 3.5))

    ax.scatter(x_train, y_train, s=28, alpha=0.75, color="#90caf9", label="train")
    ax.scatter(x_test, y_test, s=28, alpha=0.75, color="#ffcc80", label="test")

    xs = np.linspace(
        float(np.min(np.concatenate([x_train, x_test]))),
        float(np.max(np.concatenate([x_train, x_test]))),
        300,
    )
    ys = model.predict(poly.transform(xs.reshape(-1, 1)))
    ax.plot(xs, ys, color="#c62828", linewidth=2, label=f"degree {int(degree)}")

    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title(
        f"degree = {int(degree)}   |   "
        f"train RMSE = {train_rmse:.3f}   |   "
        f"test RMSE = {test_rmse:.3f}"
    )
    ax.legend(loc="upper right", frameon=False)
    return ax, train_rmse, test_rmse


def run_complexity_demo(x_train=None, y_train=None, x_test=None, y_test=None):
    """Display the interactive complexity explorer.

    Call this from a notebook cell. The widgets are live once the page runs on
    a kernel (for example, after launching Binder).
    """
    import matplotlib.pyplot as plt
    import ipywidgets as widgets
    from IPython.display import display

    if x_train is None:
        x_train, y_train, x_test, y_test = (
            DEFAULT_X_TRAIN,
            DEFAULT_Y_TRAIN,
            DEFAULT_X_TEST,
            DEFAULT_Y_TEST,
        )

    degree_slider = widgets.IntSlider(
        value=3,
        min=1,
        max=12,
        step=1,
        description="Degree",
        continuous_update=False,
        style={"description_width": "70px"},
        layout=widgets.Layout(width="90%"),
    )
    out = widgets.Output()

    def render(_change=None):
        with out:
            out.clear_output(wait=True)
            fig, ax = plt.subplots(figsize=(7, 3.5))
            draw_complexity(
                x_train,
                y_train,
                x_test,
                y_test,
                degree=degree_slider.value,
                ax=ax,
            )
            display(fig)
            plt.close(fig)

    degree_slider.observe(render, names="value")
    ui = widgets.VBox([degree_slider, out])
    display(ui)
    render()
