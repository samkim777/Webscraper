const pupeteer = require("puppeteer");

function orderList(name, price, rating) {
  let new_list = [];
  for (let i = 0; i < name.length; i++) {
    new_list.push({
      Name: name[i],
      Price: price[i],
      Rating: rating[i],
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
  await page.goto("https://www.amazon.ca/s?k=gaming+mouse&ref=nb_sb_noss", {
    waitUntil: "domcontentloaded", // Wait until dom loaded
  });
  await page.waitForSelector(".a-section.a-spacing-base", {
    visible: true,
    // Wait for item cards to be loaded
  });

  const grabItemName = await page.evaluate(() => {
    let item_Name = [];
    let item_Price = [];
    let item_Rating = [];
    let test = [];

    const itemCard = document.querySelectorAll(
      // Grab the card that contains all information about the item
      ".a-section.a-spacing-base"
    );
    const itemCardFiltered = Array.from(itemCard).filter(
      (card) => !card.className.includes("s-shopping-adviser")
      // @@@ Get rid of amazon suggestions
    );

    itemCard.forEach((tag) => {
      test.push({
        Name: tag.querySelector(".a-row.a-size-small").innerText,
        Price: tag.querySelector(".a-price").innerText,
        Rate: tag.querySelector(
          ".a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal"
        ).innerText,
      });
    });

    return test;
  });
  console.dir(grabItemName, { maxArrayLength: null });
  await browser.close();
}

getItem();
