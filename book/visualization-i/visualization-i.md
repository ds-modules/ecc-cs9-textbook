# 7. Visualization

Exploratory data analysis answers "What is in the data?" **Visualization** turns that understanding into something we can **see** and **communicate**. A well-chosen plot can reveal distributions, trends, and relationships at a glance; it can also mislead if we choose the wrong plot or scale. This chapter covers the **goals of visualization**, **visualizing distributions** (histograms, etc.), and **kernel density estimation (KDE)**. It connects EDA — understanding the data — to the "reports, decisions, and solutions" side of the lifecycle by making insights visible.

In CSCI 8 you used visualizations to summarize data and communicate trends. Here we use **matplotlib** (and later seaborn and plotly) as the industry-standard tools and focus on when and how to visualize distributions effectively.

---

## Goals of visualization

Visualizations can provide a high-level overview of a complex dataset, communicate trends to viewers, and support (or challenge) arguments. The same data can tell different stories depending on what we plot and how we design it. We will return to visualization theory and relationships between variables in the next chapter; here the focus is on **distributions** — the shape and spread of a single variable or the comparison of distributions across groups.

:::{tip} One well-chosen metric or plot
Sometimes one carefully chosen plot or metric is more effective than many. Think about what question you are answering and who will see the figure.
:::

---

## Distributions and KDE

**Histograms** bin values and show counts or proportions; they give a sense of shape, center, and spread. **Kernel density estimation (KDE)** smooths the data into a continuous curve, often making it easier to see the overall shape. Both are tools for "what does this variable look like?" — a central EDA question that carries through to modeling (e.g., checking assumptions) and reporting.
