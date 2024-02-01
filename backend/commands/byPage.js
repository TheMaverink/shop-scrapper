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

  let canLookForNextPage = true;

  let currentPage = 1;

  let allProducts = {};

  let allProductsUrls = [];

  while (
    canLookForNextPage &&
    (!NUMBER_PAGES_LIMIT ? true : currentPage <= NUMBER_PAGES_LIMIT)
  ) {
    await page.goto(`${SHOP_URL}&_pgn=${currentPage}`, { timeout: 6000 });

    let items = await page.$$(".s-item");

    const thisPageHasProducts = items?.length > 0;

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

      const itemsToExclude =
        MAX_PRODUCTS_PER_PAGE && MAX_PRODUCTS_PER_PAGE < thisPageProducts.length
          ? thisPageProducts.length - MAX_PRODUCTS_PER_PAGE + 1
          : 1;

      allProductsUrls = [
        ...allProductsUrls,
        ...thisPageProducts.slice(itemsToExclude),
      ];
    } else {
      canLookForNextPage = false;
    }
  }

  let currentProductNumber = 1;

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
        url: isFirstImage ? item.url : null,
        ebayItemNumber: isFirstImage ? item.ebayItemNumber : null,
        title: isFirstImage ? item.title : null,
        price: isFirstImage ? item.price : null,
        descriptionText: isFirstImage ? item.descriptionText : null,
        descriptionHtml: isFirstImage ? item.descriptionHtml : null,
        descriptionStrategy: isFirstImage ? item.descriptionStrategy : null,
        images: imgItem,
      };
    });
  });

  const filteredRows = allRows.reduce((accumulator, current) => {
    if (
      !accumulator.find(
        (item) => item.ebayItemNumber === current.ebayItemNumber
      ) ||
      !current.ebayItemNumber
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
