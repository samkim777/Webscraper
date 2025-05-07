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

  const browser = await puppeteer.launch({ headless: false });
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
            const urlEl = card.querySelector("a.a-link-normal.s-line-clamp-4.s-link-style.a-text-normal");
            const imgEl = card.querySelector(".s-image");
            const ratingEl = card.querySelector(".a-icon-alt");
            const priceWholeEl = card.querySelector(".a-price .a-price-whole");
            const priceFractionEl = card.querySelector(".a-price .a-price-fraction");
            let price = "No price for this item";
            if (priceWholeEl) {
              const whole = priceWholeEl.innerText.replace(/\n/g, '').trim();
              const fraction = priceFractionEl ? priceFractionEl.innerText.replace(/\n/g, '').trim() : '';
              price = `$${fraction ? whole + fraction : whole}`;
            }

            return {
              Image: imgEl?.src || "No image available",
              Link: urlEl?.href ? `https://www.amazon.ca${urlEl.getAttribute("href")}` : "No url available",
              Name: nameEl?.innerText || "No name for this item",
              Rating: ratingEl?.innerText || "No rating for this item",
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

  browser.close();

  const filteredProducts = products.filter(p => {
    const starMatch = p.Rating.match(/\d+(\.\d+)?/);
    const stars = starMatch ? parseFloat(starMatch[0]) : 0;
    return stars >= 4;
  });

  filteredProducts.sort((a, b) => {
    const aStars = parseFloat(a.Rating.match(/\d+(\.\d+)?/)?.[0] || 0);
    const bStars = parseFloat(b.Rating.match(/\d+(\.\d+)?/)?.[0] || 0);
    return bStars - aStars;
  });

  // We only want first 6 items for each suggested gift
  let aResult = filteredProducts.slice(0, 5);

  fs.writeFileSync("test.json", JSON.stringify(aResult, null, 2), "utf-8");

  // console.dir(filteredProducts, { maxArrayLength: null });
  return aResult;
}
module.exports = { getItem };

// Directly call getItem with "Pen" on startup
// getItem("Pen");

