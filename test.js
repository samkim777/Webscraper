// import { orderList, createOrderedList } from "./test";
const pupeteer = require("puppeteer");

// Function for taking two lists and putting them together in doubles
// For example, ['a','b','c'] and ['c','b','a'] would return
// [{rating: 'a', rating_size:'c'},
// {rating:'b',rating_size:'b'},
// {rating:'c',rating_size:'a'}]
let a = ["a"];
let b = ["b"];
let c = ["c"];
let d = ["d", "a"];

function orderList(name, price, rating) {
  let new_list = [];

  for (let i = 0; i < name.length; i++) {
    new_list.push({
      Name: name[i],
      Price: price[i],
      Rating: rating[0][i],
    });
  }
  return new_list;
}

// Parameter passed in here is a list of strings
function createOrderedList(list) {
  let new_listRating = [];
  let new_listSize = [];
  // Debugging for looping over objects, not arrays!
  for (let i = 0; i < Object.values(list).length; i += 2) {
    new_listRating.push(Object.values(list)[i]);
  }
  for (let j = 1; j < Object.values(list).length; j += 2) {
    new_listSize.push(Object.values(list)[j]);
  }
  return [new_listRating, new_listSize];
}

async function getItem() {
  const browser = await pupeteer.launch({
    // Launch the pupeteer browser without seeing what the script is doing
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto("https://www.amazon.ca/s?k=gaming+mouse&ref=nb_sb_noss");

  const grabItemName = await page.evaluate(() => {
    let item_Name = [];
    let item_Price = [];
    let item_Rating = [];
    // Grab the HTML with information on 'Product Name':
    const itemName = document.querySelectorAll(
      ".a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2"
    );

    // Put each list into its own array
    itemName.forEach((name) => {
      name.remove();
      if (name.innerText !== "") {
        item_Name.push(name.innerText);
      }
    });

    // Grab HTML with information on 'Price'
    const itemPrice = document.querySelectorAll(".a-price span.a-offscreen");
    // Define list of item names
    // Put each list into its own array
    itemPrice.forEach((price) => {
      price.remove();
      if (price.innerText !== "") {
        item_Price.push(price.innerText);
      }
    });

    const itemRating = document.querySelectorAll(
      // Grab HTML with information on 'Total Rating' and the 'Total number of Ratings'
      ".a-row.a-size-small [aria-label]"
    );
    itemRating.forEach((tag) => {
      // Remove any HTML syntax from the scraped HTML
      tag.remove();
      // If item has no reviews, notify the user accordingly
      if (tag == null) {
        item_Rating.push("This item currently has no reviews");
      }
      // Filter out any blank spaces
      if (tag.innerText !== "") {
        item_Rating.push(tag.innerText);
      }
    });
    return [item_Name, item_Price, item_Rating];
  });
  console.log(
    orderList(
      grabItemName[0],
      grabItemName[1],
      createOrderedList(grabItemName[2])
    )
  );
  await browser.close();
}

getItem();
// Todo: createOrderedlist to properly spit out Ratings.
