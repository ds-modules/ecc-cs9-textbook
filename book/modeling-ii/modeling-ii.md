# 11. Modeling II

Linear regression assumes we feed the model **useful inputs**. In practice, raw columns rarely arrive in that form: we need **features** that capture the signal we care about (transformations, encodings, interactions). **Feature engineering** is the process of designing, selecting, and transforming variables before fitting a model.

This chapter builds on simple and multiple linear regression: the same loss-and-fit workflow applies, but the art shifts to **what** we put into the model. Good features improve accuracy and interpretability; poor features can leak information or hide bias.

---

## From raw columns to features

Common steps include handling categorical variables (one-hot or ordinal encoding), scaling or logging numeric predictors, creating interaction terms, and dropping redundant or high-missing columns. We also think about **train vs. test**: any statistic used to build features (means, category lists) should be learned on training data only, then applied to held-out data.

:::{important} Fit transforms on training data
When you scale, impute, or encode using data-driven rules, fit those rules on the training set and apply them to validation and test sets. Fitting on the full dataset before splitting inflates performance estimates.
:::

---

## Pipelines and the path ahead

**scikit-learn** `Pipeline` objects chain preprocessing and modeling so the same steps run at prediction time. Feature engineering connects to the next chapters: **standardization and multicollinearity** (how scaled, related predictors behave) and **hyperparameter tuning** (choosing model complexity with cross-validation).
