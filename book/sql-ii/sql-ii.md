# 15. SQL II

SQL I introduced **why databases**, **tables and schema**, and **basic queries** (SELECT, FROM, WHERE, and simple GROUP BY). **SQL II** goes deeper: **grouping** and aggregation in more detail, **joins** (combining multiple tables on common keys), and other patterns that mirror what you did in pandas — but expressed in SQL and executed by the database. This chapter completes the SQL foundation you need to work with relational data in real-world pipelines and analytics.

Together, SQL I and II support the lifecycle when data is too large or too dynamic for CSV + pandas alone. They also connect to topics you have seen elsewhere: merging in Pandas III (conceptually similar to SQL joins), and the idea that the right tool depends on where and how the data is stored.

---

## Grouping and aggregation in SQL

Just as in pandas we use `.groupby().agg()`, in SQL we use **GROUP BY** with aggregate functions (COUNT, SUM, AVG, etc.) to summarize by category. We can filter groups with **HAVING** (analogous to filtering after a groupby in pandas). These patterns let you answer questions like "How many records per year?" or "What is the average value per region?" directly in the database.

:::{tip} GROUP BY and SELECT
In SQL, columns in the SELECT list must either appear in GROUP BY or be inside an aggregate function. This rule keeps the result well-defined: one row per group.
:::

---

## Joins

Real data is often split across **multiple tables** (e.g., orders and customers, or events and locations). **Joins** combine tables on matching keys (e.g., `customer_id`). Inner joins, left joins, and other variants control which rows appear when there is no match. Mastering joins in SQL lets you work with normalized databases and integrate data from different sources — a core skill in data engineering and analysis.
