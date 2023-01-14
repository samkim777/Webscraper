const { filter } = require("domutils");
const pupeteer = require("puppeteer");
const app = require('express')();
const PORT = process.env.PORT || 3000;
let product = [{
  Name: 'Logitech G715 Wireless Mechanical Gaming Keyboard with LIGHTSYNC RGB Lighting, Lightspeed, Tactile Switches (GX Brown), and Keyboard Palm Rest, PC and Mac Compatible, White Mist ',
  Rating: '4.7 out of 5 stars 234  ',
  Price: '$229.99'
},
{
  Name: 'Perixx PERIBOARD-422 Wired USB-C Mini Keyboard, USB Type C Connector, Black, US English Layout ',
  Rating: '4.2 out of 5 stars 207  ',
  Price: '$19.99'
}];
let products = [];


function DataLoaded(product) {
  for (const [key, value] of Object.entries(product)) {
    console.log(value);
  }
}

DataLoaded(products);

