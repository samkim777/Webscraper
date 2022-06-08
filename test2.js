const open = require("open");

async function openwin() {
  await open("http://sindresorhus.com");
}
openwin();
