const OpenAI = require("openai");
const { getItem } = require("./index");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getSuggestions() {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [
      {
        role: "system",
        content: `You are a shopping assistant that helps users find items to purchase from amazon.ca.
Your job is to suggest 10 gift or item ideas based on the user's prompt.

Only respond to messages that are related to shopping or buying products.
If the user asks something unrelated (e.g., technical help, weather, life advice), politely remind them that you can only assist with gift or product suggestions.

All suggestions must be physically purchasable items available on amazon.ca.
Do not include online services such as subscriptions, classes, or anything not directly purchasable on Amazon.ca.

Return the result as a valid JSON object, where each key is the name of an item and each value is a short description.
Example format:
{
  "Item Name 1": "Description of item 1",
  "Item Name 2": "Description of item 2"
}
Do not include any explanation, commentary, or text outside the JSON object.`,
      },
      {
        role: "user",
        content: "Give me suggestions on what gift to get for my mother for Mother's Day",
      },
    ],
  });

  let responseText = completion.choices[0].message.content;
  let response;

  try {
    response = JSON.parse(responseText);
  } catch (err) {
    console.error("❌ Failed to parse GPT response as JSON:", err);
    console.log("🔍 Raw response:", responseText);
    return;
  }

  const sItemNames = Object.keys(response);

  for (const itemName of sItemNames.slice(0, 5)) { // Limit to 5 to test
    console.log(`🔎 Searching for: ${itemName}`);
    try {
      const products = await getItem(itemName);
      console.log(`🛍️ Found ${products.length} products for "${itemName}":`);
      console.log(products.slice(0, 2)); // print first 2 products
    } catch (scrapeErr) {
      console.error(`❌ Error scraping for "${itemName}":`, scrapeErr.message);
    }
  }
}
getSuggestions();
