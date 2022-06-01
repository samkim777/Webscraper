const { next } = require("cheerio/lib/api/traversing");
const pupeteer = require("puppeteer");

async function getItem() {
  const browser = await pupeteer.launch({
    // Launch the pupeteer browser without seeing what the script is doing
    headless: false,
  });
  const page = await browser.newPage();

  await page.goto("https://www.amazon.ca/s?k=gaming+mouse&ref=nb_sb_noss", {
    waitUntil: "domcontentloaded", // Wait until dom loaded
  });

  await page.waitForSelector(".a-section.a-spacing-base", {
    visible: true,
    // Wait for item cards to be loaded
  });
  // @@@TODO: Scrap all pages, Give images & links to user, Display information in a nice way [React? On a webpage?]
  // @@@ When scraping, gotta add delays
  // s-pagination-item s-pagination-next s-pagination-disabled  -> When the 'Next' button is disabled,
  // meaning no more items are avaliable
  //s-pagination-item s-pagination-next s-pagination-button s-pagination-separator -> When 'Next' button enabled

  const grabItemName = await page.evaluate(() => {
    let products = [];

    const itemCard = document.querySelectorAll(
      // Grab the card that contains all information about the item
      ".a-section.a-spacing-base"
    );
    // @@@ Works for clicking next button
    const button = document.querySelector(
      ".s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator"
    );

    const itemCardFiltered = Array.from(itemCard).filter(
      (card) => !card.className.includes("s-shopping-adviser")
      // Get rid of amazon suggestions b/c we don't trust Mr Bezos
    );
    while (button != null) {
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
      button.click({ delay: Math.random() * 10000 });
    }

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
