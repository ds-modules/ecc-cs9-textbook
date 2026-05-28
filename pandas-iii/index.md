# 4. Pandas III

Pandas I and II gave you the ability to load data, select rows and columns, and modify tables. Many questions, however, require **aggregating** data: for example, "How many babies were born each year?" or "What is the average value per category?" **Pandas III** introduces **grouping** (`.groupby()`), **aggregation** (`.agg()`), **pivot tables**, and **merging** (joining) multiple tables. These operations let you summarize trends and combine data from different sources — essential for both EDA and modeling.

This chapter sits at the boundary between "understanding the data" and "preparing for inference." Once you can group and merge, you are ready to explore structure and relationships in depth (EDA) and to build features for models (modeling).

---

## Group and aggregate

The pattern is: **group** rows that share a category (e.g., the same year), then **apply an aggregation** (sum, mean, count, etc.) to each group. In CSCI 8 you may have used `Table.group(column_name, collect=...)`. In pandas we use `dataframe.groupby(column_name).agg(function)`. The result is a smaller table: one row per group, with aggregated values. This is a powerful way to summarize a dataset and to compute statistics by category.

:::{tip} Split–apply–combine
Grouping is often described as split (into groups), apply (a function to each group), and combine (results). Understanding this pattern helps when you move on to more complex aggregations and pivot tables.
:::

---

## Pivot tables and merging

**Pivot tables** reshape data so that categories become rows or columns, making it easier to compare across groups. **Merging** (or joining) combines two DataFrames on a common key — like linking a table of orders to a table of customers. Real-world data often lives in multiple tables; merging is how we bring it together for analysis.
