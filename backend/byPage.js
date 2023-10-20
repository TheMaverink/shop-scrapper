import puppeteer from "puppeteer";
import ObjectsToCsv from "objects-to-csv";



//title
//product name
// id?
//pictures
//description
//price

import SHOP_URL  from "./config/consts";
import getAllTextFromElement from "./utils/getAllTextFromElement.js";

(async () => {
  let timeElapsed = new Date();

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

  const page = await browser.newPage();

  await page.setViewport({ width: 1080, height: 1024 });

  let canLookForNextPage = true;

  let currentPage = 42;

  let allProducts = {};

  let allProductsUrls = [];

  //   let totalPages;

  while (canLookForNextPage) {
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
    } else {
      canLookForNextPage = false;
    }
  }

  for (const url of allProductsUrls.slice(2, 4)) {
    const page = await browser.newPage();

    await page.goto(url.href, {
      waitUntil: "load", // Wait for the page to load completely
    });

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
    }

    //-------

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
    // class="ux-image-filmstrip-carousel"

    allProducts[currentProductId].description = allIframeDescriptionText;

    console.log("allProducts");
    console.log(allProducts);

    await page.close();
  }

  const allProductsArr = [];

  for (const key in allProducts) {
    if (allProducts.hasOwnProperty(key)) {
      allProductsArr.push(allProducts[key]);
    }
  }

  console.log("allProductsArr");
  console.log(allProductsArr);

  console.log("allProductsArr.length");
  console.log(allProductsArr.length);

  const csv = new ObjectsToCsv(allProductsArr);
  await csv.toDisk("./test.csv", { append: true });

  console.log("Saved to CSV");
})();
