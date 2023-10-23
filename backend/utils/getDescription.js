import {
  DESCRIPTION_REMOVABLE_TEXT_1,
  DESCRIPTION_REMOVABLE_TEXT_2,
} from "../config/consts";

import getAllTextFromElement from "../utils/getAllTextFromElement";


const getDescription = async (page, allProducts, currentProductNumber) => {
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

    allProducts[currentProductNumber].description = description;
  } catch (error) {
    console.log("error from getDescription");
    console.log(error);
    allProducts[currentProductNumber].description = "N/A";
  }
};

export default getDescription;
