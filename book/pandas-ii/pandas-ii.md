# 3. Pandas II

In Pandas I you learned how to load tabular data and extract rows and columns by position (`.iloc`) or by label (`.loc`, `[]`). Often we do not want every row — we want only the rows that **satisfy a condition** (e.g., only females, only years after 2000). This chapter builds directly on that: **conditional selection** using boolean arrays, plus **adding, removing, and modifying columns** and **utility functions** (including custom sorts). These operations are the bread and butter of preparing data for exploration and modeling.

Everything you do in EDA and visualization will rely on selecting the right subsets of your data and creating new columns; Pandas II gives you the tools.

---

## Conditional selection

We can pass a **boolean array** (a Series of `True`/`False` values) into `.loc` or `[]`. Pandas keeps only the rows where the value is `True`. The power comes from **creating** that boolean array using comparison and logical operators on columns: for example, `df["Sex"] == "F"` or `(df["Year"] >= 2000) & (df["Count"] > 1000`. That way we filter by meaningful conditions instead of by hand.

:::{note} Logical operators
Combining conditions uses `&` (and), `|` (or), and `~` (not). For row-wise boolean indexing, pandas often requires parentheses around each condition to avoid ambiguity.
:::

---

## Modifying the table

Beyond selecting rows, we often need to **add columns** (e.g., computed values), **drop columns** we do not need, or **rename** them. Utility functions and **custom sorts** let us order rows by one or more columns. These steps are part of getting data into the shape we need for the next stage of the lifecycle — exploratory data analysis.
