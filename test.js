const pupeteer = require("puppeteer");
let products = [];

async function getItem() {
  let urls = [
    "https://www.amazon.ca/s?k=gaming+mouse&page=1&qid=1654765502&ref=sr_pg_1",
    "https://www.amazon.ca/s?k=gaming+mouse&page=2&qid=1654765502&ref=sr_pg_2",
  ];
  const browser = await pupeteer.launch({
    // Launch the pupeteer browser without seeing what the script is doing
    headless: false,
  });
  let search_item = "gaming mouse".replace(/ /g, "+"); // Replace blank space with a '+' sign
  let page_number = 1;
  for (let j = 0; j < urls.length; j++) {
    const page = await browser.newPage();
    let url =
      "https://www.amazon.ca/s?k=" +
      search_item +
      "&page=" +
      page_number +
      "&qid=1654220875&ref=sr_pg+" +
      page_number;

    await page.goto(urls[j], { waitUntil: "domcontentloaded" });

    await page.waitForSelector(".a-section.a-spacing-base", {
      visible: true,
      // Wait for item cards to be loaded
    });

    const grabItemName = await page.evaluate((products) => {
      const itemCard = document.querySelectorAll(".a-section.a-spacing-base");
      // Grab the card that contains all information about the item

      const itemCardFiltered = Array.from(itemCard).filter(
        (card) => !card.className.includes("s-shopping-adviser")
        // Get rid of amazon suggestions
      );
      //@@@ TODO: WHY ISN'T THE PRODUCTS LIST DISPLAYING PROPERLY

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
      return products;
    }, products);

    const filtered_products = grabItemName.filter(function (items) {
      return (
        parseInt(
          items.Rating.substr(18, items.Rating.length).replace(/,/g, "")
        ) >= 200 && parseFloat(items.Rating.substr(0, 3)) >= 4
      );
    });
    console.dir(filtered_products, { maxArrayLength: null });
  }

  await browser.close();
}
getItem();
