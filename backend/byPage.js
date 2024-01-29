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
      "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
    ],

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

  for (const key in allProducts) {
    if (allProducts.hasOwnProperty(key)) {
      allProductsArr.push(allProducts[key]);
    }
  }

 // ... (your existing code)

const  finalArray = [];

allProductsArr.forEach((item) => {

  debugger;
  
  const imagesArr = item.images || [];

  if (imagesArr.length > 0) {
    // If there are images, create a separate object for each image
    imagesArr.forEach((imgItem, imgItemIndex) => {

      const currentObj = {
        url: imgItemIndex === 0 ? item.url : null,
        ebayItemNumber: imgItemIndex === 0 ? item.ebayItemNumber : null,
        title: imgItemIndex === 0 ? item.title : null,
        price: imgItemIndex === 0 ? item.price : null,
        descriptionText: imgItemIndex === 0 ? item.descriptionText : null,
        // descriptionHtml: imgItemIndex === 0 ? item.descriptionHtml : null,
        images: imgItem,
      };

      finalArray.push(currentObj);
    });
  } else {
    // If there are no images, create a single object
    const currentObj = {
      url: item.url,
      ebayItemNumber: item.ebayItemNumber,
      title: item.title,
      price: item.price,
      descriptionText: item.descriptionText,
      // descriptionHtml: item.descriptionHtml,
      images: null, // You can adjust this based on your requirements
    };

    finalArray.push(currentObj);
  }
});



// ... (rest of your code)


  //   // Modify the array to include an "images" property for each item
  // const modifiedProductsArr = allProductsArr.map(product => {
  //   // Extract all image properties
  //   const images = Object.keys(product)
  //     .filter(key => key.startsWith('image-'))
  //     .map(key => product[key]);

  //     console.log(images)

  //   // Create a new object with the original properties and the "images" property
  //   return {
  //     ...product,
  //     images: images
  //   };
  // });

  // const maxLengths = {};
  // allProductsArr.forEach((product) => {
  //   for (const key in product) {
  //     if (product.hasOwnProperty(key)) {
  //       const length = String(product[key]).length;
  //       maxLengths[key] = Math.max(maxLengths[key] || 0, length);
  //     }
  //   }
  // });

  // // Create an array of column objects with calculated widths
  // const columns = Object.keys(maxLengths).map((key) => ({
  //   wch: maxLengths[key] + 2, // Adding a small buffer
  // }));

  // Create a new workbook
  const workbook = await XLSX.utils.book_new();

console.log("finalArray")
console.log(finalArray)

  const worksheet = await XLSX.utils.json_to_sheet(finalArray, {
    header: [
      "url",
      "ebayItemNumber",
      "price",
      "descriptionText",
      // "descriptionHtml",
      "title",
      "images",
    ],
    // cols: columns,
  });

  // allProductsArr.forEach((product, rowIndex) => {
  //   const images = product.images || [];
  //   images.forEach((image, imageIndex) => {
  //     XLSX.utils.sheet_add_aoa(worksheet, [[image]], {
  //       origin: { r: rowIndex + imageIndex + 1, c: columns.length },
  //     });
  //   });
  // });

  // const max_width = allProductsArr.reduce((w, r) => Math.max(w, r.length), 10);
  // worksheet["!cols"] = [{ wch: max_width }];

  // // Create a new workbook
  // const workbook = await XLSX.utils.book_new();

  // // Create a worksheet and add the data
  // const worksheet = await XLSX.utils.json_to_sheet(allProductsArr);

  // Add the worksheet to the workbook
  await XLSX.utils.book_append_sheet(workbook, worksheet, SHOP_NAME);

  const now = new Date();

  const formattedTime = now.toLocaleTimeString("en-GB", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // await XLSX.writeFile(
  //   workbook,
  //   `./output/${SHOP_NAME}-${
  //     now.toISOString().split("T")[0]
  //   }-${formattedTime}.xlsx`
  // );

  await XLSX.writeFile(workbook, `./output/output.xlsx`);

  console.log("Saved to xlsx");

  console.log(
    `script took ${
      Math.ceil(Date.now() / 1000) - startTime / 1000
    } seconds to run.`
  );

  await browser.close();
  console.log("Browser closed.");

  return true;
})();
