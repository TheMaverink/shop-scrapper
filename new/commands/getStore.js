import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";
import dotenv from "dotenv";

import getProduct from "../utils/ebay/getProduct";
import prepareProductsForExcel from "../utils/excel/prepareProductsForExcel";
import saveToExcel from "../utils/excel/saveToExcel";

XLSX.set_fs(fs);

dotenv.config({ path: ".env" });

const {
  TARGET_SELLER_NAME,
  TARGET_SELLER_CATEGORY_ID,
  IS_STORE,
  FIRST_ITEM,
  LAST_ITEM,
} = process.env;

const MAX_PRODUCTS_PER_PAGE = 240;

import blockResources from "../utils/blockResources";
import { getBrowser } from "../utils/puppeteer";

(async () => {
  // let startTime = new Date();

  const browser = await getBrowser();

  const page = await browser.newPage();

  await blockResources(page);

  await page.setViewport({ width: 1080, height: 1024 });

  let currentPage = 1;

  let allProducts = [];

  while (true) {
    console.log(`current page is ${currentPage}`)
    const currentUrl = `https://www.ebay.co.uk/sch/${TARGET_SELLER_CATEGORY_ID}/i.html?_ssn=${TARGET_SELLER_NAME}&store_name=${TARGET_SELLER_NAME}&_oac=1&rt=nc&_ipg=${MAX_PRODUCTS_PER_PAGE}&_pgn=${currentPage}`;

    await page.goto(currentUrl, {
      waitUntil: ["load", "domcontentloaded", "networkidle2"],
    });

    const thisPageProductsUrls = await page.$$eval(
      ".s-item__link",
      (elements) => {
        return elements.map((element) => {
          return element.href;
        });
      }
    );

    // const paginationItems = await page.$$(".pagination__item");

    const thisPageProducts = thisPageProductsUrls.slice(1).map((productUrl) => {
      const regex = /\/(\d+)\?/;
      const idNumberMatch = productUrl.match(regex)[1];

      const thisPageProduct = {
        url: productUrl,
        ebayId: idNumberMatch,
      };

      return thisPageProduct;
    });

    if (thisPageProducts.length == MAX_PRODUCTS_PER_PAGE) {
      allProducts = [...allProducts, ...thisPageProducts];

      currentPage++;
    } else {
      break;
    }
  }

  console.log("allProducts.length")
  console.log(allProducts.length)

  const rangedAllProducts = allProducts.slice(FIRST_ITEM, LAST_ITEM);

  const promises = rangedAllProducts.map(async (product, index) => {
    await new Promise((resolve) => setTimeout(resolve, index * 500));

    console.log("product.ebayId")
    console.log(product.ebayId)

    const productData = await getProduct(Number(product.ebayId));

    if (!!productData) return productData;
  });

  const productsArray = await Promise.all(promises);

  const preparedProducts = await prepareProductsForExcel(productsArray);

  await saveToExcel(preparedProducts);

  //-------------

  //if (allProductsUrls.length !== totalProductsFromUi) {
  //   console.log(
  //     `Warning: products detected ${allProductsUrls.length} and UI says ${totalProductsFromUi}`
  //   );
  // }

  // let currentPageentProductNumber = 1;

  // for (const url of allProductsUrls.slice(
  //   0,
  //   NUMBER_PRODUCTS_LIMIT || allProductsUrls.length
  // )) {
  //   const initialProductScrapingTime = Date.now();

  //   allProducts[currentProductNumber] = {};

  //   allProducts[currentProductNumber].url = url.href;

  //   await page.goto(url.href, { timeout: 6000 });

  //   await getProductNumber(page, allProducts, currentProductNumber);

  //   await getTitle(page, allProducts, currentProductNumber);

  //   await getPrice(page, allProducts, currentProductNumber);

  //   await getDescription(page, allProducts, currentProductNumber);

  //   await getImages(page, allProducts, currentProductNumber);

  //   console.log(
  //     `Time estimated: ${
  //       ((Date.now() - initialProductScrapingTime) *
  //         (allProductsUrls.length - currentProductNumber)) /
  //       1000
  //     } seconds..`
  //   );

  //   console.log(`Total products displayed on the UI: ${totalProductsFromUi}`);
  //   console.log(`Total products calculated: ${allProductsUrls.length}`);

  //   console.log(
  //     `Products left: ${allProductsUrls.length - currentProductNumber} `
  //   );

  //   currentProductNumber++;
  // }

  // const allRows = Object.values(allProducts).flatMap((item, itemIndex) => {
  //   const imagesArr = item.images || [];

  //   return imagesArr.map((imgItem, imgItemIndex) => {
  //     const isFirstImage = imgItemIndex == 0;
  //     return {
  //       scrapeNumber: itemIndex + 1,
  //       url: isFirstImage ? item.url : "-",
  //       ebayItemNumber: isFirstImage ? item.ebayItemNumber : "-",
  //       title: isFirstImage ? item.title : "-",
  //       price: isFirstImage ? item.price : "-",
  //       descriptionText: isFirstImage ? item.descriptionText : "-",
  //       descriptionHtml: isFirstImage ? item.descriptionHtml : "-",
  //       descriptionStrategy: isFirstImage ? item.descriptionStrategy : "-",
  //       images: imgItem,
  //     };
  //   });
  // });

  // const filteredRows = allRows.reduce((accumulator, current) => {
  //   if (
  //     !accumulator.find(
  //       (item) => item.ebayItemNumber === current.ebayItemNumber
  //     ) ||
  //     !current?.ebayItemNumber
  //   ) {
  //     accumulator.push(current);
  //   }
  //   return accumulator;
  // }, []);

  // console.log("total rows before filtering");
  // console.log(allRows.length);
  // console.log("total rows after filtering");
  // console.log(filteredRows.length);

  // const workbook = await XLSX.utils.book_new();

  // const worksheet = await XLSX.utils.json_to_sheet(filteredRows);

  // await XLSX.utils.book_append_sheet(workbook, worksheet, SHOP_NAME);

  // // const now = new Date();
  // // const formattedTime = now.toLocaleTimeString("en-GB", {
  // //   hour12: false,
  // //   hour: "2-digit",
  // //   minute: "2-digit",
  // //   second: "2-digit",
  // // });
  // // await XLSX.writeFile(
  // //   workbook,
  // //   `./output/${SHOP_NAME}-${
  // //     now.toISOString().split("T")[0]
  // //   }-${formattedTime}.xlsx`
  // // );

  // await XLSX.writeFile(workbook, `./output/output.xlsx`);

  // console.log(
  //   `script took ${
  //     Math.ceil(Date.now() / 1000) - startTime / 1000
  //   } seconds to run.`
  // );

  // await browser.close();

  // return true;
})();
