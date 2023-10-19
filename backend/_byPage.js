import puppeteer from "puppeteer";

//title
//product name
// id?
//pictures
//description
//price

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ detached: true, headless: false });
  console.log(browser);
  const page = await browser.newPage();
  console.log(page);

  await page.setViewport({ width: 1080, height: 1024 });

  const PLATFORM_URL =
    "https://www.ebay.co.uk/sch/72209/i.html?_ssn=happymotoruk&store_name=happymotoruk&_oac=1&_ipg=240";

  let canLookForNextPage = true;

  let currentPage = 1;

  let allProductsUrls = [];

  //   let totalPages;

  while (canLookForNextPage) {
    await page.goto(`${PLATFORM_URL}&_pgn=${currentPage}`);

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

  //   const productPagePromises = [];

  const productPagePromisesMaxConcurrency = 20;

  //this example 352 iterations..
  const productPagePromisesIterations =
    allProductsUrls.length / productPagePromisesMaxConcurrency;

  let currentProductPagePromisesIteration = 0;

  console.log("allProductsUrls.length");
  console.log(allProductsUrls.length);

  let testIndex = 0;

  for (let i = 1; i <= productPagePromisesIterations; i++) {
    const productPagePromises = [];

    allProductsUrls
      .toSpliced(
        productPagePromisesIterations * i,
        productPagePromisesIterations * i * 2
      )
      .forEach((product) => {
        console.log("product");
        console.log(product);

        //   productPagePromises.push(

        //     (async () => {
        //       const page = await browser.newPage();
        //       await page.goto(product.href);
        //       const data = await page.evaluate(() => {
        //         return "data";
        //       });
        //       await page.close();
        //       return data;
        //     })()
        //   );
      });
  }

  //   const pageData = await Promise.all(productPagePromises);

  //   for (const data of pageData) {
  //     // Process data here
  //     console.log("data")
  //     console.log(data)
  //   }

  //   for (let i = 0; i < 100; i++) {
  //     pagePromises.push((async () => {
  //       const page = await browser.newPage();
  //       await page.goto('https://example.com/page' + i);
  //       // Extract data from the page
  //       const data = await page.evaluate(() => {
  //         // Extract data logic here
  //         return extractedData;
  //       });
  //       await page.close();
  //       return data;
  //     })());
  //   }

  //    await page.goto(allProductsUrls[0].href);

  //    const page = await browser.newPage();
  //    await page.goto('https://example.com/page' + i);

  //    x-item-title__mainTitle

  // Navigate the page to a URL

  //await page.waitForNavigation();

  //   const [advancedSearchButtonElement] = await page.$x('//*[@id="gh-as-a"]');

  //   await advancedSearchButtonElement.click();

  //   await page.waitForNavigation();

  //   const findShopsButtonElement = await page.$("a::-p-text(Find Shops)");

  //   await findShopsButtonElement.click();

  //   await page.waitForNavigation();

  //   const [inputElement] = await page.$x('//*[@id="s0-1-17-9[0]-store_search"]');

  //   console.log("inputElement");
  //   console.log(inputElement);

  //   await inputElement.type(STORE_NAME);

  //   const [searchShopButton] = await page.$x(
  //     "/html/body/div[3]/div/main/form/div[2]/button"
  //   );

  //   await searchShopButton.click();

  //   await page.waitForNavigation();

  //   const shopButton = await page.$(`a::-p-text(${STORE_NAME})`);

  //   console.log("shopButton");
  //   console.log(shopButton);

  //   await shopButton.click();

  //   await page.waitForNavigation();

  //   // const thumbnailSelectors = await page.$$(".str-item-card__link");

  //   let currentPagination = await page.$$(".str-item-card__link");

  //   const [dropdown] = await page.$x('/html/body/div[10]/div/div[1]/div[2]/section/div[4]/div/nav/a');

  //   console.log("dropdown");
  //   console.log(dropdown);

  //   const test = await page.$$eval(".str-item-card__link", (elements) => {
  //     // In this function, you can process the elements
  //     return elements.map((element) => {
  //       return {
  //         href: element.href,
  //       };
  //     });
  //   });

  //   const productsLinksArr = await page.$$eval(".str-item-card__link", (elements) => {
  //     // In this function, you can process the elements
  //     return elements.map((element) => {
  //       return {
  //         href: element.href,
  //       };
  //     });
  //   });
})();
