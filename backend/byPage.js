import puppeteer from "puppeteer";
import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";

XLSX.set_fs(fs);

import {
  SHOP_URL,
  SHOP_NAME,
  NUMBER_PAGES_LIMIT,
  NUMBER_PRODUCTS_LIMIT,
} from "./config/consts";

import blockResources from "./utils/blockResources";
import getProductNumber from "./utils/getProductNumber";
import getTitle from "./utils/getTitle";
import getPrice from "./utils/getPrice";
import getDescription from "./utils/getDescription";
import getImages from "./utils/getImages";

(async () => {
  let startTime = new Date();

  const browser = await puppeteer.launch({
    detached: false,
    headless: false,
    // args: ["--disable-features=site-per-process"],
    args: [
      '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
  ]

    // args: [
    //   "--disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure",
    //   "--disable-background-timer-throttling",
    //   "--disable-backgrounding-occluded-windows",
    //   "--disable-renderer-backgrounding",
    // ],
  });

  const page = await browser.newPage();

  await blockResources(page);

  await page.setViewport({ width: 1080, height: 1024 });

  let canLookForNextPage = true;

  let currentPage = 1;

  let allProducts = {};

  let allProductsUrls = [];

  while (
    canLookForNextPage &&
    (!NUMBER_PAGES_LIMIT ? true : currentPage <= NUMBER_PAGES_LIMIT)
  ) {
    await page.goto(`${SHOP_URL}&_pgn=${currentPage}`, {
      waitUntil: "networkidle2",
    });

    let items = await page.$$(".s-item");

    const thisPageHasProducts = items?.length > 0;

    console.log(
      `Page ${currentPage} ${
        thisPageHasProducts ? `DOES` : `DOESNT`
      } have products.`
    );

    currentPage++;

    if (thisPageHasProducts) {
      const thisPageProducts = await page.$$eval(
        ".s-item__link",
        (elements) => {
          return elements.map((element) => {
            return {
              href: element.href,
            };
          });
        }
      );
      allProductsUrls = [...allProductsUrls, ...thisPageProducts.slice(1)];
      console.log(
        `Currently ${allProductsUrls.length} products added to the queue...`
      );
    } else {
      canLookForNextPage = false;
    }
  }

  console.log("allProductsUrls.length");
  console.log(allProductsUrls.length);

  let currentProductNumber = 1;

  for (const url of allProductsUrls.slice(
    0,
    NUMBER_PRODUCTS_LIMIT ? NUMBER_PRODUCTS_LIMIT : allProductsUrls.length
  )) {
    const initialProductScrapingTime = Date.now();

    // const page = await browser.newPage();

    // await page.setViewport({ width: 1080, height: 1024 });

    allProducts[currentProductNumber] = {};

    allProducts[currentProductNumber].url = url.href;

    // await blockResources(page);

    console.log(
      `Scrapping product ${currentProductNumber} of ${allProductsUrls.length}...`
    );

    await page.goto(url.href, { timeout: 60000 });

    console.log(`Attempting to scrape on ${url.href}`);

    await getProductNumber(page, allProducts, currentProductNumber);

    await getTitle(page, allProducts, currentProductNumber);

    await getPrice(page, allProducts, currentProductNumber);

    await getDescription(page, allProducts, currentProductNumber);

    await getImages(page, allProducts, currentProductNumber);

    console.log(
      `Time estimated: ${
        ((Date.now() - initialProductScrapingTime) *
          (allProductsUrls.length - currentProductNumber)) /
        1000
      } seconds..`
    );

    currentProductNumber++;

    // await page.close();
  }


  const allProductsArr = [];

  console.log("allProducts");
  console.log(allProducts);

  console.log("Object.keys(allProducts).length");
  console.log(Object.keys(allProducts).length);

  for (const key in allProducts) {
    if (allProducts.hasOwnProperty(key)) {
      allProductsArr.push(allProducts[key]);
    }
  }

  console.log("allProductsArr");
  console.log(allProductsArr);

  console.log("allProductsArr.length");
  console.log(allProductsArr.length);

  // Create a new workbook
  const workbook = await XLSX.utils.book_new();

  // Create a worksheet and add the data
  const worksheet = await XLSX.utils.json_to_sheet(allProductsArr);

  // Add the worksheet to the workbook
  await XLSX.utils.book_append_sheet(workbook, worksheet, SHOP_NAME);

  // Save the workbook as an XLSX file
  await XLSX.writeFile(workbook, `${Date.now()}.xlsx`);

  // const csv = new ObjectsToCsv(allProductsArr);

  // await csv.toDisk(`${Date.now()}.csv`);

  console.log("Saved to xlsx");

  console.log(
    `script took ${
      Math.ceil(Date.now() / 1000) - startTime / 1000
    } seconds to run.`
  );
})();
