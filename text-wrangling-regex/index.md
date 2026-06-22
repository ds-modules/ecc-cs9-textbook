# 6. Text Wrangling and Regex

So far the data we have worked with arrived in tidy columns of numbers and clean labels. Real data is rarely so polite. Survey answers come in as free text. Two files that should join on "county" spell the same county three different ways. A web server records every visit as a single dense line of text with the date buried somewhere in the middle. Before you can group, plot, or model any of this, you have to get the text into shape.

That work is called text wrangling, and this chapter is about doing it well. We start with the string tools you already have in pandas, then introduce regular expressions, a compact language for describing patterns in text. Regular expressions look cryptic at first. By the end of the chapter you will read them as what they are: a precise way to say "find me everything that looks like a date" or "strip out anything inside square brackets."

## Why text gets messy

Text carries information that no one bothered to standardize. A person typing "St. John the Baptist" and a database storing "St John the Baptist Parish" both mean the same place, but a computer sees two different strings. Logs, receipts, scraped web pages, and form responses all share this problem. Small inconsistencies, an extra space here, a stray capital letter there, are enough to break a join or split one category into ten.

The fix is **canonicalization**: deciding on one standard form and transforming every value into it. Much of text wrangling is canonicalization, and both string methods and regular expressions are tools for getting there.

## What you will learn

- [String methods in pandas](01_string_methods.ipynb): clean and canonicalize text with the `.str` accessor, and see why slicing at fixed positions falls apart on real data.
- [Regular expressions](02_regular_expressions.ipynb): the pattern language itself, plus an interactive explorer for trying patterns against your own text.
- [Regex in pandas](03_regex_in_pandas.ipynb): extract structured fields and recode categories at scale, ending with a real restaurant inspection dataset.
- [Summary](04_summary.md): when to reach for a plain string method and when a regular expression earns its keep.

:::{note} Running the code
The pages with code are notebooks. Read them straight through, or click the launch button at the top of a notebook page to open it live and run every cell yourself. The regex explorer in the next-but-one section is fully interactive once the notebook is running.
:::
