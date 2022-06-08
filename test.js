const pupeteer = require("puppeteer");
const open = require("open");

async function getItem() {
  const browser = await pupeteer.launch({
    // Launch the pupeteer browser without seeing what the script is doing
    headless: false,
  });
  let search_item = "gaming mouse".replace(/ /g, "+"); // Replace blank space with a '+' sign
  let page_number = 1;

  const page = await browser.newPage();
  let url =
    "https://www.amazon.ca/s?k=" +
    search_item +
    "&page=" +
    page_number +
    "&qid=1654220875&ref=sr_pg+" +
    page_number;

  await page.goto(url, {
    waitUntil: "domcontentloaded", // Wait until dom loaded
  });

  // @@@ document.querySelectorAll('.s-pagination-item.s-pagination-disabled')[1].innerText
  // - > Grabbing the maximum number of urls we should be going thru

  await page.waitForSelector(".a-section.a-spacing-base", {
    visible: true,
    // Wait for item cards to be loaded
  });

  // @@@ Perhaps just iterate the different urls until code 404 -->
  //  --> Doesn't work, amazon keeps giving pages

  // @@@ page.$(ELEMENT_SELECTOR), grab and evaluate seperately instead of all inside page.evaluate

  const grabItemName = await page.evaluate(() => {
    let item = "gaming mouse".replace(/ /g, "+");
    const max_page_num = document.querySelectorAll(
      ".s-pagination-item.s-pagination-disabled"
    )[1].innerText;
    for (let j = 1; j < max_page_num + 1; j++) {
      window.open(
        // Open window to link of item pages 1 to however many
        "https://www.amazon.ca/s?k=" +
          item +
          "&page=" +
          j +
          "&qid=1654220875&ref=sr_pg+" +
          j
      );
    }
    let products = [];
    const button = document.querySelector(
      ".s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator"
    );

    // Can use window inside of page.evaluate

    const itemCard = document.querySelectorAll(
      // Grab the card that contains all information about the item
      ".a-section.a-spacing-base"
    );

    const itemCardFiltered = Array.from(itemCard).filter(
      (card) => !card.className.includes("s-shopping-adviser")
      // Get rid of amazon suggestions b/c we don't trust Mr Bezos
    );
    // s-pagination-item s-pagination-disabled.innerText -> maximum number of pages for this item
    // TODO:

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

    const filtered_products = products.filter(function (items) {
      return (
        parseInt(
          items.Rating.substr(18, items.Rating.length).replace(/,/g, "")
        ) >= 200 && parseFloat(items.Rating.substr(0, 3)) >= 4
      );
    });

    return filtered_products;
  });

  console.dir(grabItemName, { maxArrayLength: null });
  await browser.close();
}
getItem();
