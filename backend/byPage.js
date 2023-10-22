import puppeteer from "puppeteer";
import ObjectsToCsv from "objects-to-csv";
import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";

XLSX.set_fs(fs);

//title
//product name
// id?
//pictures
//description
//price

import {
  SHOP_URL,
  SHOP_NAME,
  DESCRIPTION_REMOVABLE_TEXT_1,
  DESCRIPTION_REMOVABLE_TEXT_2,
} from "./config/consts";
import getAllTextFromElement from "./utils/getAllTextFromElement";

(async () => {
  let startTime = new Date();

  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    detached: true,
    headless: false,
    // args: [
    //   "--disable-web-security",
    //   "--user-data-dir",
    //   "--enable-usermedia-screen-capturing",
    //   "--allow-http-screen-capture",
    //   "--start-fullscreen",
    //   "--kiosk",
    //   "--disable-infobars",
    // ],
    args: [
      "--disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure",
    ],
  });

  console.log("SHOP_URL")
  console.log(SHOP_URL)

  const page = await browser.newPage();
  // Enable request interception
  await page.setRequestInterception(true);

  // Listen to all network requests
  page.on("request", (request) => {
    const requestUrl = request.url();
    const resourceType = request.resourceType();

    // Block requests for stylesheets (CSS)
    if (resourceType === "image" || request.resourceType() === "stylesheet") {
      request.abort();
    } else {
      request.continue();
    }
  });

  await page.setViewport({ width: 1080, height: 1024 });

  let canLookForNextPage = true;

  let currentPage = 1;

  let currentProductIndex = 1;

  let allProducts = {};

  let allProductsUrls = [];

  //   let totalPages;

  while (canLookForNextPage) {
    // await page.goto(`${SHOP_URL}&_pgn=${currentPage}`, {
    //   waitUntil: "domcontentloaded", // Wait for the page to load completely
    // });

    await page.goto(`${SHOP_URL}&_pgn=${currentPage}`);

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
      //adding thisPageProducts to the array without the first item (is not a link to product)
      allProductsUrls = [...allProductsUrls, ...thisPageProducts.slice(1)];
      console.log(`Currently ${allProductsUrls.length} added to the queue...`)
    } else {
      canLookForNextPage = false;
    }
  }

  // for (const url of allProductsUrls.slice(2, 20)) {
  for (const url of allProductsUrls) {
    const page = await browser.newPage();

    await page.setRequestInterception(true);

    // Listen to all network requests
    page.on("request", (request) => {
      const resourceType = request.resourceType();

      // Block requests for stylesheets (CSS)
      if (resourceType === "image" || request.resourceType() === "stylesheet") {
        request.abort();
      } else {
        request.continue();
      }
    });

    const initialProductScrapingTime = Date.now();

    console.log(
      `Scrapping product ${currentProductIndex} of ${allProductsUrls.length}...`
    );

    // await page.goto(url.href, {
    //   waitUntil: "domcontentloaded", // Wait for the page to load completely
    // });

    await page.goto(url.href);
    console.log(`Attempting to scrape on ${url.href}`);

    let currentProductId;

    // Find the ebayItemNumber div element
    const ebayItemNumberParent = await page.$(
      ".ux-layout-section__textual-display--itemId"
    );

    if (ebayItemNumberParent) {
      const ebayItemNumberElement = await ebayItemNumberParent.$(
        ".ux-textspans--BOLD"
      );

      if (ebayItemNumberElement) {
        const ebayItemNumber = await page.evaluate(
          (element) => element.textContent,
          ebayItemNumberElement
        );

        currentProductId = ebayItemNumber;

        allProducts[currentProductId] = {};

        allProducts[currentProductId].ebayItemNumber = ebayItemNumber;
        allProducts[currentProductId].url = page.url();
      } else {
        console.log("ebayItemNumber element not found.");
      }
    } else {
      console.log("ebayItemNumber Parent div element not found.");
      allProducts["n/a" + Math.random()].ebayItemNumber = "N/A";
      allProducts[currentProductId].url = page.url();
    }

    // Find the parent div element
    const titleParent = await page.$(".x-item-title__mainTitle");

    if (titleParent) {
      const titleElement = await titleParent.$("span");

      if (titleElement) {
        const title = await page.evaluate(
          (element) => element.textContent,
          titleElement
        );

        allProducts[currentProductId].title = title;
      } else {
        console.log("Title Span element not found.");
      }
    } else {
      allProducts["n/a" + Math.random()].title = "N/A";
      console.log("Title Parent div element not found.");
    }

    const priceParent = await page.$(".x-price-primary");

    if (priceParent) {
      const priceElement = await priceParent.$("span");

      if (priceElement) {
        const price = await page.evaluate(
          (element) => element.textContent,
          priceElement
        );

        allProducts[currentProductId].price = price;
      } else {
        console.log("Price Span element not found.");
      }
    } else {
      console.log("Price Parent div element not found.");
      allProducts["n/a" + Math.random()].price = "N/A";
      allProducts[currentProductId].url = page.url();
    }

    //-------

    try {
      const iframeElement = await page.waitForSelector(
        ".d-item-description  > iframe"
      );

      const iframeContent = await iframeElement.contentFrame();
      const iframeDescriptionElement = await iframeContent.waitForSelector(
        ".box"
      );

      const allIframeDescriptionText = await getAllTextFromElement(
        iframeDescriptionElement
      );

      let description = allIframeDescriptionText.replaceAll(
        DESCRIPTION_REMOVABLE_TEXT_1,
        ""
      );

      description = description.replaceAll(DESCRIPTION_REMOVABLE_TEXT_2, "");

      allProducts[currentProductId].description = description;
    } catch (error) {
      console.log(error);


      allProducts["n/a" + Math.random()].description = "N/A";
      allProducts[currentProductId].url = page.url();
    }

    const ImagesParent = await page.$(".ux-image-filmstrip-carousel");

    if (ImagesParent) {
      // Use the $$eval function to retrieve the src attributes of all <img> elements
      const imgSrcs = await ImagesParent.$$eval("button img", (images) =>
        images.map((img) => img.getAttribute("src"))
      );

      imgSrcs.forEach((imgSrc, index) => {
        let largeImg = imgSrc.replaceAll("s-l64.jpg", "s-l1600.jpg");

        allProducts[currentProductId][`image-${index + 1}`] = largeImg;
      });

      if (imgSrcs.length > 0) {
        console.log("Image sources:", imgSrcs);
      } else {
        console.error("Image sources not found.");
      }
    } else {
      console.error("Images parent element not found.");
      allProducts[currentProductId].url = page.url();
    }

    currentProductIndex++;

    console.log(
      `Time estimated: ${
        ((Date.now() - initialProductScrapingTime) *
          (allProductsUrls.length - currentProductIndex)) /
        1000
      } seconds..`
    );

    await page.close();
  }

  const allProductsArr = [];

  console.log("allProducts");
  console.log(allProducts);

  console.log("Object.keys(allProducts).length")
  console.log(Object.keys(allProducts).length)

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

  console.log("workbook");
  console.log(workbook);

  // Create a worksheet and add the data
  const worksheet = await XLSX.utils.json_to_sheet(allProductsArr);

  console.log("worksheet");
  console.log(worksheet);

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
