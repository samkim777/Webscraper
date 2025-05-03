const OpenAI = require("openai");
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const completion = openai.chat.completions.create({
  model: "gpt-4o-mini",
  store: true,
  messages: [
    {"role": "system", "content": "Given the user prompt, make 10 suggestions on items and gifts that can be purchased from amazon.ca. These must not include online services, such as online yoga or online cooking classes because they are not purchasable on amazon"},
    {"role": "user", "content": "Give me suggestions on what gift to get for my mother in her sixties"},
  ],
});

completion.then((result) => console.log(result.choices[0].message));
