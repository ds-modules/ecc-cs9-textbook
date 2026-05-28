# 6. Text Wrangling and Regex

After exploring and cleaning tabular data, we often need to work with **text**: names that are formatted inconsistently, categories buried in strings, or patterns we want to find and replace. **Text wrangling** is the process of transforming raw text into a shape we can analyze. **Regular expressions** (regex) give us a compact language for describing patterns in strings (digits, words, punctuation) and are built into Python and pandas.

This chapter connects EDA and cleaning to visualization: once text columns are standardized, we can group, plot, and model more reliably. You will see regex as a tool for selective matching and replacement, not as a recipe to memorize.

---

## Why text matters in data science

Survey responses, product descriptions, log files, and scraped web data often arrive as strings. Small inconsistencies (extra spaces, mixed capitalization, alternate spellings) can break joins and summaries. Before plotting or modeling, we ask whether the text column encodes a category, a date, or free-form content, and choose tools accordingly.

:::{tip} Start simple
Try string methods (`.str.lower()`, `.str.strip()`, `.str.replace()`) before reaching for full regex. Use regex when the pattern is genuinely variable or repetitive.
:::

---

## Regular expressions in practice

A regular expression describes a **pattern** (e.g., “one or more digits,” “a word boundary”). In pandas, `.str.contains()`, `.str.extract()`, and `.str.replace()` accept regex when `regex=True`. The goal is to **extract** structured information from messy text or **clean** values in bulk. Visualization and modeling in the next chapters assume columns have sensible types and labels.
