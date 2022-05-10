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

function orderList(name, price, rating, size) {
  let new_list = [];
  for (let i = 0; i < name.length; i++) {
    new_list.push({
      Name: name[i],
      Price: price[i],
      Rating: rating[i],
      SampleSize: size[i],
    });
  }
  return new_list;
}

function createOrderedList(list) {
  let new_listRating = [];
  let new_listSize = [];
  for (let i = 0; i < list.length; i += 2) {
    new_listRating.push(list[i]);
  }
  for (let j = 1; j < list.length; j += 2) {
    new_listSize.push(list[j]);
  }
  return [{ Rating: new_listRating }, { Sample_Size: new_listSize }];
}

async function getItem() {
  const browser = await pupeteer.launch({
    // Launch the pupeteer browser without seeing what the script is doing
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(
    "https://www.amazon.ca/s?k=gaming+mouse&crid=RCE8VDKAUX4D&sprefix=%2Caps%2C1052&ref=nb_sb_noss_2"
  );

  const grabItemName = await page.evaluate(() => {
    // Grab the HTML with information on 'Product Name':
    const itemName = document.querySelectorAll(
      ".a-size-mini.a-spacing-none.a-color-base.s-line-clamp-4"
    );
    // Define list of item names
    let item_Name = [];
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
    let item_Price = [];
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
    let item_Rating = [];
    itemRating.forEach((tag) => {
      // Remove any HTML syntax from the scraped HTML
      tag.remove();

      // Filter out any blank spaces
      if (tag.innerText !== "") {
        item_Rating.push(tag.innerText);
      }
    });
    let item_List = orderList(
      item_Name,
      item_Price,
      createOrderedList(item_Rating)[0],
      createOrderedList(item_Rating)[1]
    );
    return item_List;
  });
  console.log(shiet);
  await browser.close();
}
getItem();
