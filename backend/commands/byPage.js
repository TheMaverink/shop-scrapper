import puppeteer from "puppeteer";
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

    await page.goto(url.href, { waitUntil: "networkidle2" });

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

    console.log(
      `Products left: ${allProductsUrls.length - currentProductNumber} `
    );

    currentProductNumber++;
  }

  const allRows = Object.values(allProducts).flatMap((item) => {
    const imagesArr = item.images || [];

    return imagesArr.map((imgItem, imgItemIndex) => {
      const isFirstItem = imgItemIndex === 0;
      return {
        url: isFirstItem ? item.url : null,
        ebayItemNumber: isFirstItem ? item.ebayItemNumber : null,
        title: isFirstItem ? item.title : null,
        price: isFirstItem ? item.price : null,
        descriptionText: isFirstItem ? item.descriptionText : null,
        descriptionHtml: isFirstItem ? item.descriptionHtml : null,
        descriptionStrategy: isFirstItem ? item.descriptionStrategy : null,
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
