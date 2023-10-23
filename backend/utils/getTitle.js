const getTitle = async (page, allProducts, currentProductNumber) => {
  try {
    const titleParent = await page.$(".x-item-title__mainTitle");

    if (titleParent) {
      const titleElement = await titleParent.$("span");

      if (titleElement) {
        const title = await page.evaluate(
          (element) => element?.textContent,
          titleElement
        );

        allProducts[currentProductNumber].title = title;
      } else {
        console.log("Title Span element not found.");
        allProducts[currentProductNumber].title = "N/A";
      }
    } else {
      console.log("Title Parent div element not found.");
      allProducts[currentProductNumber].title = "N/A";
    }
  } catch (error) {
    console.log("error from getTitle");
    console.log(error);
    allProducts[currentProductNumber].title = "N/A";
  }
};

export default getTitle;
