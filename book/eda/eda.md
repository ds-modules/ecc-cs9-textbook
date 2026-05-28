# 5. EDA

With Pandas I–III you can load, filter, transform, group, and merge data. **Exploratory data analysis (EDA)** is the step where we use those tools to **understand** the data: its structure, granularity, scope, and limitations. EDA sits at the heart of the data science lifecycle — the "understand the data" track. We look for what we believe is there and also for what we might not expect: gaps, biases, and patterns that inform how we interpret and model the data later.

As John Tukey put it: EDA is "an attitude, a state of flexibility, a willingness to look for those things that we believe are not there, as well as those that we believe to be there." This chapter makes that attitude concrete.

---

## Key properties to consider

When exploring data, we pay attention to:

- **Structure** — The "shape" of the data: rows, columns, nesting, file format.
- **Granularity** — How fine or coarse is each row? One row per person, per year, per event?
- **Scope** — How complete is the data? What is missing, and why?
- **Temporality** — How is the data situated in time? Snapshots? Time series?
- **Faithfulness** — How well does the data capture reality? What are the sources of error or bias?

:::{important} EDA before modeling
Skipping EDA and jumping to modeling is risky. Understanding structure, missingness, and bias helps you choose appropriate models, interpret results, and avoid misleading conclusions.
:::

---

## From EDA to the rest of the lifecycle

EDA feeds into **text wrangling** (standardizing string columns), **visualization** (we plot distributions and relationships to see patterns), **modeling** (we use EDA to choose features and assess assumptions), and **reporting** (we communicate what we found). Practice on real datasets — structure, cleaning, and asking questions — to set you up for the chapters that follow.
