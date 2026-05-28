# 14. SQL I

Until now we have worked with data in **CSV files** and **pandas**: load the file into memory, then filter, group, and merge. That workflow is appropriate for **moderately sized**, **static** data (e.g., under roughly a third of your machine's RAM, or a weekly snapshot). In the real world, data is often stored in a **database** managed by a **Database Management System (DBMS)**. Data may be large, updated continuously, or shared across many users. **SQL** (Structured Query Language) is the standard way to ask questions of such databases — to select, filter, aggregate, and join data without loading everything into Python at once.

This chapter steps away from Python and pandas to introduce **why databases**, **SQL basics**, **tables and schema**, and **basic queries** (including grouping). It connects the lifecycle's "data acquisition" and "understand the data" to situations where the data lives in a relational database rather than in a single CSV.

---

## Why databases?

Databases support **operational** use (many users, frequent updates), **analytical** use (complex queries over large data), and **consistency** and **efficiency**. We write **queries** that describe *what* we want; the DBMS figures out *how* to retrieve it. Learning SQL lets you work with data at scale and with data that is stored in tables linked by keys — the relational model — which is ubiquitous in industry.

:::{seealso} SQL II
The next chapter extends SQL with more grouping, joins, and advanced query patterns. Together, SQL I and II give you the foundation for querying relational data in the wild.
:::

---

## Tables, schema, and basic queries

Data in a database is organized into **tables** (like DataFrames) with **columns** and **rows**. The **schema** describes the table names, column names, and types. We write **SELECT** statements to specify columns, **FROM** to specify tables, **WHERE** to filter rows, and **GROUP BY** to aggregate. The syntax is different from pandas, but the concepts — selection, filtering, grouping — are familiar from Pandas I–III.
