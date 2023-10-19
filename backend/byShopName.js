import puppeteer from "puppeteer";

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ detached: true, headless: false });
  console.log(browser);
  const page = await browser.newPage();
  console.log(page);

  await page.setViewport({ width: 1080, height: 1024 });

  const PLATFORM_URL = "https://www.ebay.co.uk/";
  const STORE_NAME = "happymotoruk";

  // Navigate the page to a URL
  await page.goto(PLATFORM_URL);

  const [advancedSearchButtonElement] = await page.$x('//*[@id="gh-as-a"]');

  await advancedSearchButtonElement.click();

  await page.waitForNavigation();

  const findShopsButtonElement = await page.$("a::-p-text(Find Shops)");

  await findShopsButtonElement.click();

  await page.waitForNavigation();

  const [inputElement] = await page.$x('//*[@id="s0-1-17-9[0]-store_search"]');

  console.log("inputElement");
  console.log(inputElement);

  await inputElement.type(STORE_NAME);

  const [searchShopButton] = await page.$x(
    "/html/body/div[3]/div/main/form/div[2]/button"
  );

  await searchShopButton.click();

  await page.waitForNavigation();

  const shopButton = await page.$(`a::-p-text(${STORE_NAME})`);

  console.log("shopButton");
  console.log(shopButton);

  await shopButton.click();

  await page.waitForNavigation();

  // const thumbnailSelectors = await page.$$(".str-item-card__link");

  let currentPagination = await page.$$(".str-item-card__link");

 

  const [dropdown] = await page.$x('/html/body/div[10]/div/div[1]/div[2]/section/div[4]/div/nav/a');

  console.log("dropdown");
  console.log(dropdown);

  const test = await page.$$eval(".str-item-card__link", (elements) => {
    // In this function, you can process the elements
    return elements.map((element) => {
      return {
        href: element.href,
      };
    });
  });
  
  const productsLinksArr = await page.$$eval(".str-item-card__link", (elements) => {
    // In this function, you can process the elements
    return elements.map((element) => {
      return {
        href: element.href,
      };
    });
  });

  // console.log("productsLinksArr");
  // console.log(productsLinksArr);




  // let test = await page.$eval(".str-item-card__link", async(element) => {
  //   console.log("element");
  //   console.log(element);
  //   // return element.getAttribute("href");

  //   return element.map(option => option.textContent);
  // });

  // console.log("test");
  // console.log(test);

  // const test1  = thumbnailSelectors[0].getAttribute("href")

  // console.log("test1");
  // console.log(test1);

  // const clickThumbnailsOnPage = async () => {
  //   const thumbnailSelectors = await page.$$(".str-item-card__link"); // Replace with the actual selector for the thumbnails

  //   if (thumbnailSelectors) {
  //     const attributes = await page.evaluateHandle(element => {
  //       // You can access and retrieve attributes here
  //       const attribute1 = element.getAttribute('href');
  //       console.log("attribute1")
  //       console.log(attribute1)

  //       // Add more attributes as needed

  //       return {
  //         attribute1,

  //         // Add more attributes as needed
  //       };
  //     }, element);

  //     console.log('Element attributes:', attributes);
  //   } else {
  //     console.log('Element not found.');
  //   }

  // };

  //   for (let i = 0; i < thumbnailSelectors?.length; i++) {
  //     console.log("thumbnailSelectors[i]")
  //     console.log(thumbnailSelectors[i])
  //     // const url = thumbnailSelectors[i].getAttribute("href")
  //     // console.log("url");
  //     // console.log(url);

  //     // await page.goto(`${url}`);
  //     // await page.waitForNavigation({ waitUntil: 'networkidle2' });
  // }

  // if (thumbnailSelectors?.length > 0) {
  //   for (const thumbnail of thumbnailSelectors) {

  //     await thumbnail.click();
  //     const pages = await browser.pages();
  //     console.log(pages)
  //     // await page.waitForTimeout(1000);
  //   }
  // }

  //title
  //product name
  // id?
  //pictures
  //description
  //price

  //      // Use page.evaluate to find the element
  //      const test =  await page.$eval("a", element =>{

  //       console.log("element")
  //       console.log(element)

  //       return element.href
  //      }
  //       );
  //      console.log("test")
  //      console.log(test)

  //      const anchorWithSpan = await page.waitForSelector('span:contains("Find Shops")');

  // console.log("anchorWithSpan")
  // console.log(anchorWithSpan)

  //  if (anchorWithSpan) {
  //    // Perform actions on the found anchor element
  //    await anchorWithSpan.click(); // Click the anchor element
  //  } else {
  //    console.log('Element not found.');
  //  }

  // if (element) {
  //   // Perform actions on the found element
  //   await element.click(); // Click the anchor element
  // } else {
  //   console.log('Element not found.');
  // }

  // await page.waitForSelector([advancedSearchButtonElement]);

  // await advancedSearchButtonElement.click();

  // if (advancedSearchButtonElement) {
  //   // Click the selected element
  //   console.log("advancedSearchButtonElement")
  //   console.log(advancedSearchButtonElement)

  //   await advancedSearchButtonElement.click();

  // } else {
  //   console.log("advancedSearchButtonElement not found.");
  // }

  // '//*[@id="s0-1-15-3[1]-menu"]/li[2]/a'
  // #s0-1-15-3\[1\]-menu > li:nth-child(2) > a
  // const [findShopsButtonElement] = await page.$x(
  //    '#s0-1-15-3\[1\]-menu > li:nth-child(2) > a'
  // );

  // console.log("findShopsButtonElement")
  // console.log(findShopsButtonElement)

  // await page.waitForSelector(findShopsButtonElement);

  // if (findShopsButtonElement) {
  //   // Click the selected element
  //   console.log("findShopsButtonElement")
  //   console.log(findShopsButtonElement)

  //   await findShopsButtonElement.click();
  // } else {
  //   console.log("findShopsButtonElement not found.");
  // }

  // // Type into search box
  // await page.type(".search-box__input", "automate beyond recorder");

  // // Wait and click on first result
  // const searchResultSelector = ".search-box__link";
  // await page.waitForSelector(searchResultSelector);
  // await page.click(searchResultSelector);

  // // Locate the full title with a unique string
  // const textSelector = await page.waitForSelector(
  //   "text/Customize and automate"
  // );
  // const fullTitle = await textSelector?.evaluate((el) => el.textContent);

  // // Print the full title
  // console.log('The title of this blog post is "%s".', fullTitle);

  // await browser.close();
})();
