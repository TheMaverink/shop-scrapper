import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";

XLSX.set_fs(fs);

import {
  SHOP_URL,
  SHOP_NAME,
  NUMBER_PAGES_LIMIT,
  NUMBER_PRODUCTS_LIMIT,
  MAX_PRODUCTS_PER_PAGE,
} from "../config/consts";

import blockResources from "../utils/blockResources";
import getProductNumber from "../utils/getProductNumber";
import getTitle from "../utils/getTitle";
import getPrice from "../utils/getPrice";
import getDescription from "../utils/getDescription";
import getImages from "../utils/getImages";
import { getBrowser } from "../utils/puppeteer";

(async () => {
  let startTime = new Date();

  const browser = await getBrowser();

  const page = await browser.newPage();

  await blockResources(page);

  await page.setViewport({ width: 1080, height: 1024 });

  await page.goto(SHOP_URL, {
    waitUntil: "networkidle2",
  });

  const searchInput = await page.$(".str-search__input");
  const inputPlaceholder = await page.evaluate(
    (element) => element.getAttribute("placeholder"),
    searchInput
  );
  const digits = inputPlaceholder.match(/\d{1,3}(?:,\d{3})*/);
  const totalProductsFromUi = parseInt(digits[0].replace(/,/g, ""), 10);

  const totalPagesTobeScraped =
    NUMBER_PAGES_LIMIT ||
    Math.ceil(totalProductsFromUi / MAX_PRODUCTS_PER_PAGE);

  console.log(`Total products displayed on the UI: ${totalProductsFromUi}`);
  console.log(`Total pages to be scraped: ${totalPagesTobeScraped}`);

  let canLookForNextPage = true;

  let currentPage = 1;

  let allProducts = {};

  let allProductsUrls = [];

  while (canLookForNextPage) {
    await page.goto(`${SHOP_URL}&_pgn=${currentPage}`, { timeout: 6000 });

    let items = await page.$$(".s-item");

    console.log(`Page nº ${currentPage} has ${items?.length} products`)

    const thisPageHasProducts = items?.length > 1;

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
// 241+241+241+241+241+41 1246
      // console.log("thisPageProducts[0]");
      // console.log(thisPageProducts[0]);
      // console.log("thisPageProducts[1]");
      // console.log(thisPageProducts[1]);

      // console.log("thisPageProductslength");
      // console.log(thisPageProducts.length);

      const itemsToExclude =
        MAX_PRODUCTS_PER_PAGE && MAX_PRODUCTS_PER_PAGE < thisPageProducts.length
          ? thisPageProducts.length - MAX_PRODUCTS_PER_PAGE 
          : 1;

      // console.log("itemsToExclude");
      // console.log(itemsToExclude);
      allProductsUrls = [
        ...allProductsUrls,
        ...thisPageProducts,
        // ...thisPageProducts.slice(itemsToExclude),
      ];

      canLookForNextPage = currentPage  <= totalPagesTobeScraped;
    } else {
      canLookForNextPage = false;
    }
  }


  console.log("allProductsUrls.length");
  console.log(allProductsUrls.length);

  if( allProductsUrls.length !== totalProductsFromUi){
    console.log(`Warning: products detected ${allProductsUrls.length} and UI says ${totalProductsFromUi}`)
  }

  let currentPageentProductNumber = 1;

  for (const url of allProductsUrls.slice(
    0,
    NUMBER_PRODUCTS_LIMIT || allProductsUrls.length
  )) {
    const initialProductScrapingTime = Date.now();

    allProducts[currentProductNumber] = {};

    allProducts[currentProductNumber].url = url.href;

    await page.goto(url.href, { timeout: 6000 });

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

    console.log(`Total products displayed on the UI: ${totalProductsFromUi}`);
    console.log(`Total products calculated: ${allProductsUrls.length}`);

    console.log(
      `Products left: ${allProductsUrls.length - currentProductNumber} `
    );

    currentProductNumber++;
  }

  const allRows = Object.values(allProducts).flatMap((item, itemIndex) => {
    const imagesArr = item.images || [];

    return imagesArr.map((imgItem, imgItemIndex) => {
      const isFirstImage = imgItemIndex == 0;
      return {
        scrapeNumber: itemIndex + 1,
        url: isFirstImage ? item.url : "-",
        ebayItemNumber: isFirstImage ? item.ebayItemNumber : "-",
        title: isFirstImage ? item.title : "-",
        price: isFirstImage ? item.price : "-",
        descriptionText: isFirstImage ? item.descriptionText : "-",
        descriptionHtml: isFirstImage ? item.descriptionHtml : "-",
        descriptionStrategy: isFirstImage ? item.descriptionStrategy : "-",
        images: imgItem,
      };
    });
  });

  const filteredRows = allRows.reduce((accumulator, current) => {
    if (
      !accumulator.find(
        (item) => item.ebayItemNumber === current.ebayItemNumber
      ) ||
      !current?.ebayItemNumber
    ) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);

  console.log("total rows before filtering");
  console.log(allRows.length);
  console.log("total rows after filtering");
  console.log(filteredRows.length);

  const workbook = await XLSX.utils.book_new();

  const worksheet = await XLSX.utils.json_to_sheet(filteredRows);

  await XLSX.utils.book_append_sheet(workbook, worksheet, SHOP_NAME);

  // const now = new Date();
  // const formattedTime = now.toLocaleTimeString("en-GB", {
  //   hour12: false,
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   second: "2-digit",
  // });
  // await XLSX.writeFile(
  //   workbook,
  //   `./output/${SHOP_NAME}-${
  //     now.toISOString().split("T")[0]
  //   }-${formattedTime}.xlsx`
  // );

  await XLSX.writeFile(workbook, `./output/output.xlsx`);

  console.log(
    `script took ${
      Math.ceil(Date.now() / 1000) - startTime / 1000
    } seconds to run.`
  );

  await browser.close();

  return true;
})();
