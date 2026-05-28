# 9. Sampling

So far we have focused on **exploratory data analysis** and **visualization** — understanding and displaying the data we have. But how did we get that data? And when we use it to draw conclusions about a larger population, what justifies that step? **Sampling** is the process of selecting a subset of a population to study; the way we sample affects what we can say about the world. This chapter covers when and how to sample effectively, how to quantify the uncertainty in our samples, and the dangers of **sampling bias**. It connects "understand the data" to "prediction and inference": good inference depends on understanding how the data were collected.

Topics include censuses and surveys, definitions of population and sample, a case study on sampling bias, probability samples, and multinomial probabilities. These ideas underpin the modeling chapters that follow.

---

## Why sampling matters

If our data are a **convenience sample** or otherwise biased, conclusions about the population can be wrong. Probability sampling (random selection under known probabilities) and a clear definition of the **population** and **sample** help us state what we can and cannot generalize. We also learn to quantify variability (e.g., through the distribution of sample statistics) so we can communicate uncertainty.

:::{important} Sampling bias
A biased sample can lead to misleading conclusions no matter how sophisticated our analysis. Always ask: Who or what is in the sample, and who or what is missing?
:::
