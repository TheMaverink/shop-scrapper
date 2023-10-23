const getProductNumber = async (page, allProducts, currentProductNumber) => {
  try {

    const ebayItemNumberParent = await page.$(
      ".ux-layout-section__textual-display--itemId"
    );

    if (ebayItemNumberParent) {
      const ebayItemNumberElement = await ebayItemNumberParent.$(
        ".ux-textspans--BOLD"
      );

      if (ebayItemNumberElement) {
        const ebayItemNumber = await page.evaluate(
          (element) => element?.textContent,
          ebayItemNumberElement
        );

        allProducts[currentProductNumber].ebayItemNumber = ebayItemNumber;
        console.log("ebayItemNumber");
        console.log(ebayItemNumber);
      } else {
        console.log("ebayItemNumber element not found.");
        allProducts[currentProductNumber].ebayItemNumber = "N/A";
      }
    } else {
      console.log("ebayItemNumber Parent div element not found.");
      allProducts[currentProductNumber].ebayItemNumber = "N/A";
    }
  } catch (error) {
    console.log("error from getProductNumber");
    console.log(error);
    allProducts[currentProductNumber].ebayItemNumber = "N/A";
  }
};


export default getProductNumber