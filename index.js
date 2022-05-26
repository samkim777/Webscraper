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
  await page.goto(
    "https://www.amazon.ca/s?k=gaming+mouse&crid=2JTGO38LHUJ2M&sprefix=gaming+mou%2Caps%2C430&ref=nb_sb_noss_2",
    {
      waitUntil: "domcontentloaded", // Wait until dom loaded
    }
  );
  await page.waitForSelector(".a-section.a-spacing-base", {
    visible: true,
    // Wait for item cards to be loaded
  });

  const grabItemName = await page.evaluate(() => {
    let products = [];

    const itemCard = document.querySelectorAll(
      // Grab the card that contains all information about the item
      ".a-section.a-spacing-base"
    );
    const itemCardFiltered = Array.from(itemCard).filter(
      (card) => !card.className.includes("s-shopping-adviser")
      // @@@ Get rid of amazon suggestions
    );

    itemCardFiltered.forEach((tag) => {
      tag.remove();
      let item_name_null =
        tag.querySelector(
          ".a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal"
        ) == null;
      let item_price_null = tag.querySelector(".a-price") == null;
      let item_rating_null = tag.querySelector(".a-row.a-size-small") == null;

      products.push({
        // Ternary operator uses first value as truthy, second as falsy
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
    // @@@ Sample code for getting sample size
    // let text = "4.5 out of 5 stars 1,558 ";
    // const ratingStar = text.split(" ",1);
    // const sampleSize = text.slice(18,text.length).replace(/,/g, '');

    return products;
  });
  console.dir(grabItemName, { maxArrayLength: null });
  await browser.close();
}

getItem();
