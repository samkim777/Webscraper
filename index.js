const pupeteer = require("puppeteer");
let products = [];
const express = require('express');
const cors = require("cors");
const app = express()
const PORT = process.env.PORT || 3001;
let search_item = '';
let search_name = ''; 
// var userAgent = require('user-agents');






// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });
// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://webscraper-front.onrender.com/');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});



async function getItem(item_names) { 
  search_item = item_names.replace(/ /g, "+"); // Replace blank space with a '+' sign
  search_name = search_item.replaceAll('+', ' ');
  let urls = [];
 

  var filtered_products = [];

  for (let pages = 0; pages < 2; pages++) {
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
    // executablePath: '/opt/homebrew/bin/chromium' 
 
  });

  for (let j = 0; j < urls.length; j++) {
    const page = await browser.newPage();

    // override browser user agent
   ///  await page.setUserAgent(userAgent.random().toString())


    await page.goto(urls[j], { waitUntil: "domcontentloaded" },{timeout: 500000});

    await page.waitForSelector(".a-section.a-spacing-base", {
      visible: false,
      timeout:500000, // Wait 50 seconds for elements
      // Wait for item cards to be loaded
    });
    
    // ****
    const grabItemName = await page.evaluate((products,search_name) => {
      const itemCard = document.querySelectorAll(".a-section.a-spacing-base");

      // Grab the card that contains all information about the item
      
      const itemCardFiltered = Array.from(itemCard).filter(
        (card) => !card.className.includes("s-shopping-adviser") && !card.innerHTML.includes('Sponsored') 
      


        //@@@ page.evaluate needs to be passed in a parameter
        
      );
     // NULL CHECKING ---------------------------------
      // -> Scoping issues with the varible 'products'
      itemCardFiltered.forEach((tag) => {
       // tag.remove(); // -> Also gets rid of url as well as '\n' 
        let item_name_null =
          tag.querySelector(
            ".a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal"
          ) == null;
        let item_price_null = tag.querySelector(".a-price") == null;
        let item_rating_null = tag.querySelector(".a-row.a-size-small") == null;
        let item_img_null = tag.querySelector(".s-image") == null || tag.querySelector(".s-image").src == null;
        let item_url_null = tag.querySelector(".a-link-normal.s-no-outline").href == null;
        let rating_length = tag.querySelector(".a-row.a-size-small");

        try {
        products.push({
          // Ternary operator for when an element is null, else give value
          Image: item_img_null 
          ? "No image avaliable"
          : tag.querySelector(".s-image").src,
          Link: item_url_null 
          ? "No url avaliable"
          : tag.querySelector(".a-link-normal.s-no-outline").href,
          Name: item_name_null
            ? "No name for this item"
            : tag.querySelector(
                ".a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal"
              ).innerText,
          Rating: item_rating_null
            ? "No rating for this item"
            : /\d/.test(tag.querySelector(".a-row.a-size-small").innerText) ? 
            tag.querySelector(".a-row.a-size-small").innerText.substr(0,rating_length.innerText.length) : // Get rid of dup rating ie 4.74.8 out of 5
            "Wrong string for this item",
          Price: item_price_null
            ? "No price for this item"
            : // Get rid of duplicate prices with firstChild
              tag.querySelector(".a-price").firstChild.innerText,
        })} catch {

        };
      });


      return products;
    }, products,search_name);


     filtered_products =  grabItemName.filter(function (items) {
      return (
        parseInt(items.Rating.match(/\d+$/)) >= 200 && parseFloat(items.Rating) >= 4 
      )
    })


   

    //  await page.close(); // Close the scraped page

    // //@@@ Sorting by decreasing rating
    if (j == urls.length - 1) {
      filtered_products.sort(function (a, b) {
        var keyA = parseFloat(a.Rating.substr(0, 4).replace(/,/g, ""));
        var keyB = parseFloat(b.Rating.substr(0, 4).replace(/,/g, ""));
        if (keyA > keyB) return  -1;
        if (keyA < keyB) return   1;
        return 0;
      });
 
    }
  
   

  }
  
   await browser.close();

  console.dir(filtered_products, { maxArrayLength: null });
  // Return filtered list
  return filtered_products;

}





app.get('/', async function(req,res) {
  try{
  // Fetch user input data 
  let params = req.query.data
  results = []
  // Run the scraper on request
  // Only run if parameter received
  if (typeof params !== 'undefined') 
  {
  results = await getItem(params);
  // Send scraped JSON
  
  }
  res.send(results);
  
  }
  catch (error){
    console.error(error.response.data);     // NOTE - use "error.response.data` (not "error")
  }
})


app.listen(PORT, () => {
  console.log('Scraping on port: ' + PORT)
})
