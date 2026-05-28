# 8. Visualization II

The previous chapter focused on **distributions** — histograms, KDE, and the goals of making data visible. This chapter goes further: **relationships between quantitative variables** (e.g., scatter plots, correlation) and **visualization theory** — how to choose encodings, avoid misleading viewers, and design clear figures. Together, these two chapters support the whole lifecycle: EDA (seeing patterns), modeling (diagnostics and communication), and reports and decisions.

---

## Relationships between variables

When we ask "How does X relate to Y?" we often plot one variable against another: **scatter plots**, **line plots** over time, or grouped displays. The choice of plot depends on whether variables are quantitative or categorical and on what story we want to tell. We also consider scale, color, and layout so that the figure is readable and honest.

:::{note} Correlation and causation
Visualizing a relationship can suggest correlation; it does not by itself show causation. We interpret patterns in light of domain knowledge and study design.
:::

---

## Visualization theory

Good visualization theory helps us decide *what* to plot and *how*: encodings (position, color, size), the use of color and legend, and avoiding chart junk or misleading axes. These principles apply whether we use matplotlib, seaborn, or plotly — and whether we are exploring data ourselves or presenting to others.
