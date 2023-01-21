# Amazon item Scraper


## Description
###### A webscraper for scraping product name, price, rating, and rating sample size. Built with Puppeteer library. Compatible with both Amazon.ca.

###### Items returned will be filtered from descending rating size. That is, items with 10,000 ratings will be shown prior to an item with 9,000 ratings, regardless of their actual rating.

###### Reviews are mostly J-shaped, meaning consumers either *hate* or *love* the product. This means that if an item is a happy purchase for many, chances are you'll like it too.

###### Users decide what they want to search for, and how many pages to scrap can be found inside index.js

## How to use
###### 1. First, run index.js inside terminal. 
```
index.js
```
###### Then, launch React with command: 
```
cd react-client/src
npm start
```
###### Type in the name of item that you want to search inside the textbox, and press the search button. The scraped and filtered results will be displayed to you shortly.

![](demo.gif)
