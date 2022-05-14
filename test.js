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
      ".a-size-mini.a-spacing-none.a-color-base.s-line-clamp-3"
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
      // Grab the card that contains all information about the item
      ".a-section.a-spacing-base"
    );

    // Hmmm,, how should I solve this issue?
    itemRating.forEach((tag) => {
      const itemRatingChild = tag.querySelectorAll(
        ".a-row.a-size-small [aria-label]"
      );
      itemRatingChild.forEach((child) => {
        if (child.innerText != "" && child != null) {
          item_Rating.push(child.innerText);
          // Some products show twice but that's just because amazon shows the same thing twice
        } else {
          item_Rating.push("This item currently has no rating");
        }
      });
      // a-section sbv-product -> These ones are pegged to advertisements, and seem to be messing up order
      // So we should ignore this class because it contains every element that I'm looking for
      // How to ignore class?
      // The method I'm doing here is taking all product name, price, and rating and putting them together
      // But what if I just grab the card that contains their information, and extract it like that?
      // ^ Should implement it like this
    });

    return item_Rating;
  });
  console.dir(grabItemName, { maxArrayLength: null });
  await browser.close();
}

getItem();
