# 2. Pandas I

The _Introduction_ chapter described the data science lifecycle: we formulate questions, acquire data, explore it, and draw conclusions. Once we have data (a "box of data"), we need to work with it in practice. **Pandas** is the industry-standard Python library for tabular data. This chapter connects the lifecycle's "data acquisition" and "understand the data" stages to the tools you will use in every later chapter: DataFrames, Series, and the basics of loading, inspecting, and extracting data.

If you have seen CSCI 8's [datascience](https://data8.org/datascience/) library and **Table**s, pandas **DataFrame**s and **Series** are the analogous concepts in the wider Python ecosystem. Mastering pandas syntax here sets you up for EDA, visualization, and modeling.

---

## Why tabular data?

Data scientists often work with **tabular data**: data in rows and columns, like a spreadsheet. Each row is typically one observation (e.g., one person, one year, one event); each column is a variable. Pandas gives us **DataFrame**s (the whole table) and **Series** (a single column). Along with an **Index** (labels for rows and columns), these structures let us load data from files (e.g., CSV), inspect it, and extract subsets using position (`.iloc`) or labels (`.loc` and `[]`).

:::{tip} From Tables to DataFrames
If you used `Table` in CSCI 8, think of a DataFrame as the pandas equivalent; the same kinds of operations (select, filter, group) exist with different syntax. See the [datascience documentation](https://data8.org/datascience/) for the Table API.
:::

---

## What you will learn

This chapter introduces pandas syntax, operators, and functions: creating or reading DataFrames, understanding structure (rows, columns, index), and **data extraction** with `loc`, `iloc`, and bracket notation. You will also review how Python data structures (arrays, lists, dictionaries) relate to working with tabular data. The goal is to feel comfortable opening a dataset and selecting the rows and columns you need for analysis.
