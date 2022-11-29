const { filter } = require("domutils");
const pupeteer = require("puppeteer");
const app = require('express')();
const PORT = process.env.PORT || 3000;
let products = [];

app.get('/api', function(req,res) {
  res.send('Hello!');
})

app.listen(PORT, () => {
  console.log('Hello ${PORT}!')
})



