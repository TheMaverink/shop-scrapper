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
    waitUntil: ["load", "domcontentloaded", "networkidle2"],
  });

  let canLookForNextPage = true;

  let currentPage = 1;

  let totalPagesScrapped = 0;

  let allProducts = {};

  let allProductsUrls = [];

  // console.log("SHOP_URL");
  // console.log(SHOP_URL);

  //EXTRACTING PRODUCTS FROM PAGES

  // let productsObj = {};

  while (canLookForNextPage) {
    const currentUrl = `${SHOP_URL}&_ipg=${MAX_PRODUCTS_PER_PAGE}&_pgn=${currentPage}`;
  

    await page.goto(currentUrl, {
      waitUntil: ["load", "domcontentloaded", "networkidle2"],
    });


     console.log(`Page nº ${currentPage} has ${items?.length} products`);

    // 240 + 36 - 2 =274

    const thisPageProductsUrls = await page.$$eval(
      ".s-item__link",
      (elements) => {
        return elements.map((element) => {
          return element.href;
        });
      }
    );

    const paginationItems = await page.$$('.pagination__item');

    // Process the pagination items as needed
    for (const item of paginationItems) {
      // Do something with each pagination item
      const textContent = await item.evaluate(node => node.textContent);
      console.log(textContent);
    }

    

    console.log("paginationItems")
    console.log(paginationItems)


    
    // console.log("thisPageProductsUrls.length")
    // console.log(thisPageProductsUrls.length)

    // thisPageProductsUrls.forEach((productUrl) => {
    //   productsObj[productUrl] = {
    //     url: productUrl,
    //     timesFound: productsObj[productUrl]?.timesFound
    //       ? productsObj[productUrl]?.timesFound + 1
    //       : 1,
    //   };
    // });

    // const itemsToExclude =
    //   MAX_PRODUCTS_PER_PAGE && MAX_PRODUCTS_PER_PAGE < thisPageProducts.length
    //     ? thisPageProducts.length - MAX_PRODUCTS_PER_PAGE
    //     : 1;

    // console.log("thisPageProductsUrls");
    // console.log(thisPageProductsUrls);

  allProductsUrls = [
    ...allProductsUrls,
    ...thisPageProductsUrls,
  // ...thisPageProducts.slice(itemsToExclude),
     ];

    // thisPageProductsUrls.forEach((url, index) => {
    //   // return index != 0 && allProductsUrls.indexOf(url) != url && allProductsUrls.push(url);

    //   productsObj[]
    // });

    // console.log("thisPageProductsUrls.length");
    // console.log(thisPageProductsUrls.length);

    // console.log("allProductsUrls.length");
    // console.log(allProductsUrls.length);

    // console.log("productsObj");
    // console.log(productsObj);

    // console.log("currentUrl");
    // console.log(currentUrl);

    // console.log("currentPage");
    // console.log(currentUrl);

    // const duplicates = allProductsUrls.filter(
    //   (item, index) => allProductsUrls.indexOf(item) != index
    // );

    const withoutDuplicates = [...new Set(allProductsUrls)];

    // console.log("allProductsUrls.length")
    // console.log(allProductsUrls.length)
    // // console.log("duplicates.length")
    // // console.log(duplicates.length)
    // console.log("withoutDuplicates.length")
    // console.log(withoutDuplicates.length)

    const elementCounts = {};

    allProductsUrls.forEach(element => {
  elementCounts[element] = (elementCounts[element] || 0) + 1;
});

// console.log("elementCounts");
// console.log(elementCounts);


    currentPage++;

    // if (duplicates.length > Math.floor(MAX_PRODUCTS_PER_PAGE / 2)) {
    //   canLookForNextPage = false;
    //   totalPagesScrapped = currentPage;
    //   // allProductsUrls = [...new Set(allProductsUrls)];

    //   console.log("totalPagesScrapped");
    //   console.log(totalPagesScrapped);

    //   console.log("allProductsUrls.length");
    //   console.log(allProductsUrls.length);

    //   console.log("duplicates");
    //   console.log(duplicates.length);
    //   console.log("withoutDuplicates.length");
    //   console.log(withoutDuplicates.length);
    // }
  }

  //-------------

  // if (allProductsUrls.length !== totalProductsFromUi) {
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
