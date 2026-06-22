# Summary

Text wrangling is the work of turning messy strings into something you can analyze. This chapter built up two toolkits for it.

**String methods** came first. The `.str` accessor applies Python's string operations to a whole column, and chaining a few of them, lowercase, strip, replace, is enough to canonicalize most categorical text. That is what let two tables with mismatched county spellings finally join.

**Regular expressions** came second, for the jobs that fixed substrings cannot reach. A regex describes a pattern rather than an exact string, so it can find a date wherever it sits in a line, pull apart a timestamp into its pieces, or recode thousands of free-text descriptions by keyword. In pandas, `.str.extract`, `.str.findall`, `.str.replace`, and `.str.contains` all take a regex and run it across an entire column.

## Which tool when

- Reach for a plain string method when the change is the same everywhere: a known substring to remove, a case to fix, whitespace to trim. It is clearer to read and easier to get right.
- Reach for a regular expression when the thing you are matching varies from row to row, or when you need to capture parts of a match. Anything shaped like a date, an ID, an IP address, or a bracketed note is regex territory.

:::{tip} Build patterns by experiment
A regex you cannot read is a bug waiting to happen. Test patterns on real examples before trusting them, in the [interactive explorer](02_regular_expressions.ipynb) or on a site like [regex101.com](https://regex101.com), and keep them as simple as the data allows.
:::

## Where this leads

Clean text feeds everything downstream. The [visualization](../visualization-i/index.md) chapters assume your categories are already canonicalized, and the modeling chapters assume your features are already extracted. The restaurant case study showed the whole arc in miniature: wrangle the text, count the keywords, then let the analysis reveal how violations track with inspection scores.
