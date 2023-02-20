# Amazon item Scraper


## Description
###### A webscraper for scraping product name, price, rating, and rating sample size. Built with Puppeteer library. Compatible with both Amazon.ca.

###### Items returned will be filtered from highest ratings to lowest ratings. Since > 200 sample size condition will be met by all the items, it seems fitting that higher ratings hold more value. 

###### Reviews are mostly J-shaped, meaning consumers either *hate* or *love* the product. This means that if an item is a happy purchase for many, chances are you'll like it too.

###### Users decide what they want to search for, and how many pages to scrap can be found inside index.js

## How to use

###### 0. Install dependencies using:
```
npm install
```

###### 1. First, run index.js inside terminal. 
```
index.js
```
###### Then, open a new terminal and launch React with command: 
```
cd react-client/src
npm start
```
###### Type in the name of item that you want to search inside the textbox, and press the search button. The scraped and filtered results will be displayed to you shortly.



###### ![](demo.gif)
