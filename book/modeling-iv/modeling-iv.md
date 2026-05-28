# 13. Modeling IV

Real models have **knobs**: tree depth, regularization strength, number of neighbors. **Hyperparameters** are choices we make before fitting, not learned from the data in the same way as regression coefficients. **Cross-validation** helps estimate how well a model generalizes when we try different settings. This chapter also introduces **decision trees** and **random forests** and how we **evaluate classifiers** beyond accuracy alone.

---

## Hyperparameters and cross-validation

Splitting data once into train and test is a start; **k-fold cross-validation** rotates which fold is held out so we get a more stable estimate of error. We use validation performance to choose hyperparameters (e.g., max depth of a tree) without peeking at the final test set. The workflow is: define a grid or search space, fit on training folds, score on validation folds, then report once on a locked-away test set.

:::{tip} Keep a final test set sacred
Use cross-validation on the training portion to tune models. Evaluate the final chosen model on the test set only at the end, not repeatedly during tuning.
:::

---

## Decision trees and random forests

A **decision tree** splits data by feature thresholds; it can capture non-linear patterns and interactions without explicit feature products. **Random forests** average many trees trained on random subsets of data and features, often improving stability. For **classification**, we care about precision, recall, and confusion matrices, not only overall accuracy, especially when classes are imbalanced.

---

## Where this fits in the course

These tools complete the modeling thread before **SQL**: you can now move from tables in memory to questions asked of databases at scale.
