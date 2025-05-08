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

async function getItem(itemNames) {
  const searchItem = itemNames.trim().replace(/ /g, "+");
  const urls = [
    `https://www.amazon.ca/s?k=${searchItem}&page=1`
  ];

  const browser = await puppeteer.launch({ headless: true });
  const products = [];

  for (const url of urls) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    try {
      await page.waitForSelector(".s-result-item", { timeout: 50000 });
      const pageProducts = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll(".s-result-item"));
        return cards
          .filter(card => !card.innerHTML.includes("Sponsored"))
          .map(card => {
            const nameEl = card.querySelector("h2 a span") || card.querySelector("h2 span");
            const urlEl = card.querySelector("a.a-link-normal");
            const imgEl = card.querySelector(".s-image");

            // Rating and review logic
            const ratingRow = card.querySelector(".a-row.a-size-small");
            const ratingSpan = ratingRow?.querySelector("span");
            const rating = ratingSpan?.innerText.match(/[\d.]+/)
              ? parseFloat(ratingSpan.innerText.match(/[\d.]+/)[0])
              : 0;

            const reviewAnchor = ratingRow?.querySelector("a[aria-label$='ratings']");
            const reviews = reviewAnchor?.getAttribute("aria-label")?.match(/\d+/)
              ? parseInt(reviewAnchor.getAttribute("aria-label").replace(/,/g, ""), 10)
              : 0;

            // Price logic
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

      products.push(...pageProducts);
    } catch (err) {
      console.error(`Error scraping ${url}:`, err);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  // Filter products with Rating >= 4 and Reviews >= 200
  const filteredProducts = products.filter(p => p.Rating >= 4 && p.Reviews >= 200);

  // Sort by rating (descending)
  filteredProducts.sort((a, b) => b.Rating - a.Rating);

  // Limit to first 10 results
  const aResult = filteredProducts.slice(0, 10);

  // For testing purposes
  fs.writeFileSync("test.json", JSON.stringify(aResult, null, 2), "utf-8");

  return aResult;
}

module.exports = { getItem };
