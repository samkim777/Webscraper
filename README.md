# Amazon item Scraper


## Description
###### A webscraper for scraping product name, price, rating, and rating sample size. Built with Puppeteer library. Compatible with both Amazon.ca and Amazon.com.

###### Items returned will be filtered from descending rating size. That is, items with 10,000 ratings will be shown prior to an item with 9,000 ratings, regardless of their actual rating.

###### Reviews are mostly J-shaped, meaning consumers either *hate* or *love* the product. This means that if an item is a happy purchase for many, chances are you'll like it too.

###### Users decide what they want to search for, and also how many pages of search results for the program to read through.

## How to use
###### 1. First, decide on which item to search for, and the desired number of pages to scrape. Please be careful when choosing number of pages, because if you decide to scrape too many pages, it may return inaccurate or no results. A good number is around 2-5.
###### 2. Change the variables *search_item* and *pages* to what you want, which indicate item name and number of pages to scrape respectively.


###### 3. Finally, after cloning the project to a desired directory, it can be run with the command 
```
node index.js
```
###### which will log the scraped data in the console.
