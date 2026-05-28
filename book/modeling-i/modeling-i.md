# 10. Modeling I

EDA and visualization help us understand and communicate data. **Modeling** takes the next step: we build an **idealized representation** of a system to explain phenomena, predict outcomes, or guide decisions. As the statistician George Box said, "Essentially, all models are wrong, but some are useful." This chapter introduces the **modeling process** — choose a model, choose a loss function, fit the model, evaluate performance — and focuses on **simple and multiple linear regression**. We use **scikit-learn** as the standard Python library for modeling and connect the lifecycle stages of "prediction and inference" to concrete tools.

You may have seen correlation and regression in CSCI 8; here we formalize the process (loss, fitting, evaluation) and use it as a template for more advanced models later (e.g., feature engineering, pipelines, decision trees).

---

## What is a model?

A model is a simplified picture of reality. We trade off **interpretability** and **accuracy**: simpler models are easier to explain; more complex models may fit the data better but be harder to interpret. We build models to explain complex phenomena, to predict outcomes, or to guide decisions. The modeling process involves choosing a model class, defining a **loss function** (how we measure error), **fitting** the model to data (minimizing loss), and **evaluating** performance (e.g., on held-out data).

:::{tip} Constant model first
A useful baseline is the **constant model** (predict the mean). Comparing a regression model to this baseline shows whether the added complexity is justified.
:::

---

## Linear regression

**Simple linear regression** predicts a quantitative outcome from a single predictor; **multiple linear regression** uses several predictors. We use squared error as the loss and fit by minimizing it. These patterns — choose model, define loss, fit, evaluate — reappear in feature engineering, pipelines, and more advanced methods.
