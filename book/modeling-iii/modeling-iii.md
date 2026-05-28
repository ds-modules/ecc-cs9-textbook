# 12. Modeling III

Once we have features and a regression model, we ask harder questions: Are predictors on comparable scales? Do some columns duplicate information? Does the model **generalize** beyond the rows we used to fit it? This chapter focuses on **standardization**, **multicollinearity**, and ideas of **generalization** that sit between basic regression and more flexible models.

You may have fit linear models in earlier work; here we stress diagnostics and humility: a good training fit does not guarantee good predictions on new data.

---

## Standardization and scale

Predictors measured in different units (dollars vs. years vs. counts) can make coefficients hard to compare and optimization less stable. **Standardizing** (zero mean, unit variance) or **normalizing** puts numeric features on a common scale. For interpretation, we distinguish scaling done for numerical reasons from scaling done because the variable’s natural units are not meaningful in the model.

---

## Multicollinearity

When two or more predictors are **highly correlated**, coefficient estimates can swing widely with small data changes (**multicollinearity**). We detect this with correlation matrices and variance inflation factors (VIF), and respond by dropping redundant features, combining them, or using regularization. Understanding multicollinearity helps you read regression output honestly.

:::{seealso} Generalization
**Generalization** means performance on unseen data. Train/validation/test splits, and later cross-validation, are how we estimate whether patterns in the training set are real or noise.
:::

---

## Toward more flexible models

With standardized features and an eye on related predictors, we are ready for **hyperparameter tuning**, **cross-validation**, and models such as **decision trees** that capture non-linear structure without hand-building every interaction.
