const { filter } = require("domutils");
const pupeteer = require("puppeteer");
let products = [];
const express = require('express');
const app = express()
const PORT = process.env.PORT || 3001;
const cors = require('cors');




async function getItem() {
  app.use(cors());
  let search_item = "pink gaming keyboard".replace(/ /g, "+"); // Replace blank space with a '+' sign
  let search_name = search_item.replaceAll('+', ' ');
  let urls = [];
  for (let pages = 0; pages < 3; pages++) {
    urls.push(
      "https://www.amazon.ca/s?k=" +
        search_item +
        "&page=" +
        pages +
        "&qid=1654765502&ref=sr_pg_" +
        pages
    );
  }

  const browser = await pupeteer.launch({
    // Launch the pupeteer browser without seeing what the script is doing
    headless: true,
    executablePath: '/opt/homebrew/bin/chromium' // For M1 chip compatibility issues with puppeteer
  });

  for (let j = 0; j < urls.length; j++) {
    const page = await browser.newPage();

    await page.goto(urls[j], { waitUntil: "domcontentloaded" });

    await page.waitForSelector(".a-section.a-spacing-base", {
      visible: true,
      // Wait for item cards to be loaded
    });

    const grabItemName = await page.evaluate((products,search_name) => {
      const itemCard = document.querySelectorAll(".a-section.a-spacing-base");
      // Grab the card that contains all information about the item

      const itemCardFiltered = Array.from(itemCard).filter(
        (card) => !card.className.includes("s-shopping-adviser") && !card.innerHTML.includes('Sponsored') 
      
        //##### Checking if string contains multiple words is bit more complicated


        //@@@ page.evaluate needs to be passed in a parameter
        
      );
     
      // -> Scoping issues with the varible 'products'
      itemCardFiltered.forEach((tag) => {
        tag.remove();
        let item_name_null =
          tag.querySelector(
            ".a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal"
          ) == null;
        let item_price_null = tag.querySelector(".a-price") == null;
        let item_rating_null = tag.querySelector(".a-row.a-size-small") == null;

        products.push({
          // Ternary operator for when an element is null, else give value
          Name: item_name_null
            ? "No name for this item"
            : tag.querySelector(
                ".a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal"
              ).innerText,
          Rating: item_rating_null
            ? "No rating for this item"
            : tag.querySelector(".a-row.a-size-small").innerText,
          Price: item_price_null
            ? "No price for this item"
            : // Get rid of duplicate prices with firstChild
              tag.querySelector(".a-price").firstChild.innerText,
        });
      });
      return products;
    }, products,search_name);

    var filtered_products = grabItemName.filter(function (items) {
      return (
        parseInt(
          items.Rating.substr(18, items.Rating.length).replace(/,/g, "")
        ) >= 200 && parseFloat(items.Rating.substr(0, 3)) >= 4 
      )
    });
    await page.close(); // Close the scraped page

    //@@@ Sorting algorithm
    if (j == urls.length - 1) {
      filtered_products.sort(function (a, b) {
        var keyA = parseInt(a.Rating.substr(18, a.length).replace(/,/g, ""));
        var keyB = parseInt(b.Rating.substr(18, b.length).replace(/,/g, ""));
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return 0;
      });
      

     

 
       console.dir(filtered_products, { maxArrayLength: null });
       
       app.get('/', function(req,res) {
        // Post to localhost:3001
        res.send(filtered_products);
      })

       
      
 
    }
  
   

  }
  

  await browser.close();
 
}
getItem();





app.listen(PORT, () => {
  console.log('Scraping on port: ' + PORT)
})


