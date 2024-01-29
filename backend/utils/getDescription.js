import axios from "axios";
import cheerio from "cheerio";

import {
  DESCRIPTION_REMOVABLE_TEXT_1,
  DESCRIPTION_REMOVABLE_TEXT_2,
} from "../config/consts";

import getAllTextFromElement from "../utils/getAllTextFromElement";

async function fetchHtml(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching HTML:", error.message);
    throw error;
  }
}

const getDescription = async (page, allProducts, currentProductNumber) => {
  try {
    const { ebayItemNumber } = allProducts[currentProductNumber];

    const iframeUrl = `https://vi.vipr.ebaydesc.com/ws/eBayISAPI.dll?ViewItemDescV4&item=${ebayItemNumber}&t=0&category=72209&seller=happylifeuk&excSoj=1&excTrk=1&lsite=3&ittenable=false&domain=ebay.com&descgauge=1&cspheader=1&oneClk=2&secureDesc=1`;

    const html = await fetchHtml(iframeUrl);

    // Now you can use Cheerio to parse and manipulate the HTML

    // Remove the contents of the div with class "tt-header"

    const $ = cheerio.load(html);

    // Remove the contents of the div with class "tt-header"

    // Remove specific classes from the body element
    // $("body").removeClass("tt-header tt-banner tt-md-l");

    let textString = "";
    let htmlString = "";

    ["p", "h1", "b", "span"].forEach((elementName) => {
      $(elementName).each((index, element) => {
        const textContent = $(element).text();
        const htmlContent = $(element).html();

        // Append text content to the text string (separated by a new line)
        textString += `${textContent}\n`;

        // Append HTML content to the HTML string
        htmlString += htmlContent;
      });
    });
    console.log("textStringlength");
    console.log(textString.length);
    console.log("htmlStringlength");
    console.log(htmlString.length);

    // Get the modified HTML content
    // const modifiedHtml = $.html();

    // // Save the modified HTML content or continue with other processing
    // const bodyString = $("body").html();

    // const cleanedBodyString = bodyString.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

    // console.log("modifiedHtmllength");
    // console.log(modifiedHtml.length);
    // console.log("bodyStringlength");
    // console.log(bodyString.length);
    // console.log("cleanedBodyStringlength");
    // console.log(cleanedBodyString.length);
    // Example: Extracting the text of all paragraphs
    // $("p").each((index, element) => {
    //   console.log($(element).text());
    // });

    // await page.open(iframeUrl, {
    //   waitUntil: "networkidle2",
    // });
    // const iframeElement = await page.waitForSelector(
    //   ".d-item-description  > iframe"
    // );

    // const iframeContent = await iframeElement.contentFrame();
    // const iframeDescriptionElement = await iframeContent.waitForSelector(
    //   ".box",
    //   { timeout: 2000 }
    // );

    // const allIframeDescriptionText = await getAllTextFromElement(
    //   iframeDescriptionElement
    // );

    // let description = allIframeDescriptionText.replaceAll(
    //   DESCRIPTION_REMOVABLE_TEXT_1,
    //   ""
    // );

    // description = description.replaceAll(DESCRIPTION_REMOVABLE_TEXT_2, "");

    allProducts[currentProductNumber].descriptionText = textString;
    allProducts[currentProductNumber].descriptionHtml = htmlString.length < 32767 ? htmlString : "N/A";
  } catch (error) {
    console.log("error from getDescription");
    console.log(error);
    allProducts[currentProductNumber].description = "N/A";
  }
};

export default getDescription;

// https://vi.vipr.ebaydesc.com/ws/eBayISAPI.dll?ViewItemDescV4&item=223697288722&t=0&category=72209&seller=happylifeuk&excSoj=1&excTrk=1&lsite=3&ittenable=false&domain=ebay.com&descgauge=1&cspheader=1&oneClk=2&secureDesc=1


