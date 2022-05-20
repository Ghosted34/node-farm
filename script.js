import { readFileSync } from "fs";
import { createServer } from "http";
import { parse } from "url";
import slugify from "slugify";

import replaceTemplate from "./modules/replaceTemplate.js";

/////////////////////////////////////////////////////////////////
///Server

const tempOverview = readFileSync(
  `./templates/template-overview.html`,
  `utf-8`
);
const tempCard = readFileSync(`./templates/template-card.html`, `utf-8`);
const tempProduct = readFileSync(`./templates/template-product.html`, `utf-8`);
const data = readFileSync(`./dev-data/data.json`, `utf-8`);
const productData = JSON.parse(data);

const slugs = productData.map((el) =>
  slugify(el.productName, { lower: true }, "_")
);

const server = createServer((req, res) => {
  const { query, pathname } = parse(req.url, true);

  // Overview
  if (pathname === "/" || pathname === "/overview" || pathname === "/home") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = productData.map((el) => replaceTemplate(tempCard, el));
    const output = tempOverview.replace(/{%product-card%}/g, cardsHtml);

    res.end(output);

    // Api
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    // Product
  } else if (pathname === "/product") {
    const product = productData[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // End
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end(`<h1>Please select valid page!</h1>`);
  }
});

server.listen(`8000`, () => {
  console.log("Listening to request on port 8000!");
});
