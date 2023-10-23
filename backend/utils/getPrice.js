const getPrice = async (page, allProducts, currentProductNumber) => {
  try {
    const priceParent = await page.$(".x-price-primary");

    if (priceParent) {
      const priceElement = await priceParent.$("span");

      if (priceElement) {
        const price = await page.evaluate(
          (element) => element.textContent,
          priceElement
        );

        allProducts[currentProductNumber].price = price;
        console.log("price");
        console.log(price);
      } else {
        console.log("Price Span element not found.");
        allProducts[currentProductNumber].price = "N/A";
      }
    } else {
      console.log("Price Parent div element not found.");
      allProducts[currentProductNumber].price = "N/A";
    }
  } catch (error) {
    console.log("error from getPrice");
    console.log(error);
    allProducts[currentProductNumber].price = "N/A";
  }
};

export default getPrice;
