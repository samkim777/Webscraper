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
  // for (let k = 0; k < Object.values(list).length; k++) {
  //   if (list[k].contains("stars")) {
  //     new_listRating.push(Object.values(list)[k]);
  //   } else if (typeof list[k] === 'number') {
  //       new_listRating.push()
  //   }
  // }
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

    const itemCard = document.querySelectorAll(
      // Grab the card that contains all information about the item
      ".a-section.a-spacing-base"
    );

    // Hmmm,, how should I solve this issue?
    itemCard.forEach((tag) => {
      const itemRatingChild = tag.querySelectorAll(
        ".a-row.a-size-small [aria-label]"
      );
      itemRatingChild.forEach((child) => {
        child.remove();
        if (child.innerText != "" && child != null) {
          item_Rating.push(child.innerText);
          // Some products show twice but that's just because amazon shows the same thing twice
          // I have to change 'changeOrderList' because now it's not in pairs once the item has no rating
          // So catch when it says no rating, and adjust the function
        } else {
          item_Rating.push("This item currently has no rating");
        }
      });
      // a-section sbv-product -> These ones are pegged to advertisements, and seem to be messing up order
      // So we should ignore this class because it contains every element that I'm looking for
      // How to ignore class?
      // The method I'm doing here is taking all product name, price, and rating and putting them together
      // But what if I just grab the card that contains their information, and extract it like that?

      const itemNameChild = tag.querySelectorAll(
        ".a-size-mini.a-spacing-none.a-color-base.s-line-clamp-3"
      );
      itemNameChild.forEach((child_name) => {
        child_name.remove();
        if (child_name.innerText !== "") {
          item_Name.push(child_name.innerText);
        }
      });

      const itemPrice = tag.querySelectorAll(".a-price");
      // @@@ Price needs to collect only current prices, not the 'was' prices as it is doing now
      // @@@ currently selecting every element that has '.a-price' tag
      // @@@ How do I filter so that only a-price is selected?
      // todo: Filter so that only the exact class element is chosen
      itemPrice.forEach((price) => {
        price.remove();
        if (price.innerText !== "") {
          item_Price.push(price.innerText);
        }
      });
    });

    return [item_Name, item_Price];
  });
  console.dir(grabItemName, { maxArrayLength: null });
  await browser.close();
}

getItem();
