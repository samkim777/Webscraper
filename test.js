// import { orderList, createOrderedList } from "./test";
const pupeteer = require("puppeteer");

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

    const itemCard = document.querySelectorAll(
      // Grab the card that contains all information about the item
      ".a-section.a-spacing-base"
      // Grabs 72 elements, 71 of which are items
      // @@@ Besides the one js stuff, seems to be grabbing the right things
    );
    const itemCardFiltered = Array.from(itemCard).filter(
      (card) => !card.className.includes("a-spacing-top-base")
      // @@@ This doesn't seem to do anything
    );

    itemCard.forEach((tag) => {
      // test.push(tag.className);
      const itemRatingChild = tag.querySelectorAll(
        ".a-row.a-size-small"
        // @@@ Does not include items w/o rating at all.
        // @@@ This means that inside here, we don't have any items w/o rating, so just assign null to those
        // @@@ With this selection I get the right items, but what are the 8 ' ' given? Why the empty string??
        // @@ TODO: Find out why I'm getting the empty string
      );
      const itemRatingChildFiltered = Array.from(itemRatingChild).filter(
        (card) => !card.className.includes("a-color-secondary")
        // @@@ Get rid of all the non-rating related classes, such as eligibility of Prime delivery
      );

      itemRatingChildFiltered.forEach((child) => {
        child.remove();
        if (child.innerText != "") {
          item_Rating.push(child.innerText);
        } else {
          item_Rating.push("No rating");
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
      // todo: Filter so that only the exact class element is chosen ### Fixed

      itemPrice.forEach((price) => {
        price.remove();
        // Make sure we're only selecting this exact class
        if (price.className == "a-price") {
          // If non-empty value, add to list
          if (price.innerText !== "") {
            // Avoid duplicative prices
            item_Price.push(price.firstChild.innerText);
          }
        }
      });
    });

    return item_Rating;
  });
  console.dir(grabItemName, { maxArrayLength: null });
  await browser.close();
}

getItem();
