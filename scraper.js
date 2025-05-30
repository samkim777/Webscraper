const puppeteer = require("puppeteer");
const express = require("express");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

async function getItem(aItemNames) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-gpu",
      "--hide-scrollbars",
      "--mute-audio",
      "--disable-background-video-track"
    ]
  });
  const oResults = {};
  const aBatchPages = [];
  for (let i = 0; i < 3; i++) {
    aBatchPages.push(await browser.newPage());
  }

  for (let i = 0; i < aItemNames.length; i += 3) {
    const aItemNameBatch = aItemNames.slice(i, i + 3);

    await Promise.all(aItemNameBatch.map(async (oItem, iIndex) => {
      const page = aBatchPages[iIndex];
      const searchItem = oItem.trim().replace(/ /g, "+");
      const url = `https://www.amazon.ca/s?k=${searchItem}&page=1`;

      try {
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await page.waitForSelector(".s-result-item", { timeout: 50000 });

        const aPageProducts = await page.evaluate(() => {
          const cards = Array.from(document.querySelectorAll(".s-result-item"));
          return cards
            .filter(card => !card.innerHTML.includes("Sponsored"))
            .map(card => {
              const nameEl = card.querySelector("h2 a span") || card.querySelector("h2 span");
              const urlEl = card.querySelector("a.a-link-normal");
              const imgEl = card.querySelector(".s-image");

              const ratingRow = card.querySelector(".a-row.a-size-small");
              const ratingSpan = ratingRow?.querySelector("span");
              const rating = ratingSpan?.innerText.match(/[\d.]+/)
                ? parseFloat(ratingSpan.innerText.match(/[\d.]+/)[0])
                : 0;

              const reviewAnchor = ratingRow?.querySelector("a[aria-label$='ratings']");
              const reviews = reviewAnchor?.getAttribute("aria-label")?.match(/\d+/)
                ? parseInt(reviewAnchor.getAttribute("aria-label").replace(/,/g, ""), 10)
                : 0;

              const priceWholeEl = card.querySelector(".a-price .a-price-whole");
              const priceFractionEl = card.querySelector(".a-price .a-price-fraction");
              let price = "No price for this item";
              if (priceWholeEl) {
                const whole = priceWholeEl.innerText.replace(/\n/g, '').trim();
                const fraction = priceFractionEl ? priceFractionEl.innerText.replace(/\n/g, '').trim() : '';
                price = `$${fraction ? whole + fraction : whole}`;
              }

              return {
                Name: nameEl?.innerText || "No name for this item",
                Image: imgEl?.src || "No image available",
                Link: urlEl?.href ? `https://www.amazon.ca${urlEl.getAttribute("href")}` : "No url available",
                Rating: rating,
                Reviews: reviews,
                Price: price
              };
            });
        });

        const aFilteredProducts = aPageProducts
          .filter(p => p.Rating >= 4 && p.Reviews >= 200)
          .sort((a, b) => b.Rating - a.Rating)
          .slice(0, 10);

        oResults[oItem] = aFilteredProducts;
      } catch (err) {
        console.error(`Error scraping ${url}:`, err);
        oResults[oItem] = [];
      }
    }));
  }

  await browser.close();
  //fs.writeFileSync("test.json", JSON.stringify(oResults, null, 2), "utf-8");
  return oResults;
}
// getItem([
//   "Soccer Ball",
//   "Soccer Backpack",
//   "Soccer Cleats",
//   "Agility Ladder",
//   "Soccer Trainer",
//   "Soccer Rebounder Net",
//   "Soccer Goal Set",
//   "Soccer Shin Guards",
//   "Soccer Jersey",
//   "Sports Water Bottle"
// ]
// );
module.exports = { getItem };