# What statistical inference could a buyer conclude from an item's rating and the number of ratings that it has received?

## Factors:

### Selection Bias: Who are more likely to leave a review for their purchase?

#### Consumer with radical opinion on the product. Customer reviews are often highly polarized, and therefore a bimodal distribution of reviews, or a J-shaped distribution. They either love it or hate it. #### - \*\*Fake reviews.\*\* The company distributing the product may use fake reviews to exploit the fact that 93% of total consumers rely on online reviews for their purchase decision, and positive review can boost sales by up to 31%. On the contrary, a negative review can hurt sales by potentially upto 59%.

#### Consumers asked by the product's company: Around 68% of customers are willing to write reviews for the company when asked.

### Price Sensitivity: The higher the price of an item is, the more sensitive its star rating to change.

### Time frame variability: If an item has changed price due to an external factor - such as seasonal demand of air conditioners rising during summer - then this affects the review of the item. It could be subject to harsher reviews when its price is higher, and vice-versa, more lenient reviews when the price is deducted. So the history of prices is an important factor.

#### In 2015, Amazon changed its rating calculation to add more weight to certain reviews. Verified users are weighted more 'important' [https://www.feedbackwhiz.com/blog/how-does-amazon-calculate-product-ratings/]

With the bimodal parent distribution, a sample size of 30 may be sufficient enough to invoke the CLT.
CLT: Distriution approximately normal with sufficient sample size
[https://www.umass.edu/remp/Papers/Smith&Wells_NERA06.pdf]

## Factors to be considered in this project:

### Filter condition (Due to the complexity of variables, only the most important variables to the user's short-term consumption utility will be considered):

#### 1. Item rating sample size < 200

#### 2. Item star rating < 4

#### 3. Top (maximum) 10 items with highest sample size & rating will be given to the user

#### 4. Items will be given a 95% confidence interval for the item's star rating, which will aid in consumer's purchase choice.

##### If no items can satisify all such conditions, it may be better to search other shopping platforms for that item

###### Sources: https://www.qualtrics.com/blog/online-review-stats/,

###### https://www.tandfonline.com/doi/abs/10.1080/02642069.2010.529436

###### https://www.colorado.edu/business/sites/default/files/attached-files/jcr_2016_de_langhe_fernbach_lichtenstein_0.pdf

###### https://fivethirtyeight.com/features/yelp-and-michelin-have-the-same-taste-in-new-york-restaurants/
