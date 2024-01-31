import axios from "axios";
import cheerio from "cheerio";

import {
  DESCRIPTION_REMOVABLE_TEXT_1,
  DESCRIPTION_REMOVABLE_TEXT_2,
  DESCRIPTION_REMOVABLE_TEXT_3,
  DESCRIPTION_REMOVABLE_TEXT_4,
} from "../config/consts";

const DESCRIPTION_KEY_WORDS = [
  "*Important Notice*",
  "Please kindly check your car model and make sure the model fits in case of buying the wrong product.",
  "No installation instruction included,easy to install.",
  "Any damage and improper installation during the installation will not allow to get money refund.",
  "Please leave us positive feedback if you are satisfied with our product and service, if not please contact us,we will solve your problem asap, many thanks.",
  "Installation Notice :1. No installation instruction included, professional installation is highly recommended!!!2. 3. Please allow 0.5-1 inch difference due to manual measurement. (1inch=2.54cm)*",
];

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

    // let descriptionText = "";

    const html = await fetchHtml(iframeUrl);

    // Now you can use Cheerio to parse and manipulate the HTML

    // Remove the contents of the div with class "tt-header"

    const $ = cheerio.load(html);

    const targetElement = $('p:contains("Specifications :")').text();

    console.log("targetElement")
    console.log(targetElement)

    const descriptionText = targetElement || ""



   

    // Select the main container with class '.box'
    // const mainContainer = $(".box");

    // // Iterate over each child div with class '.content'
    // mainContainer.find(".content").each((index, contentDiv) => {
    //   // Iterate over divs with no classes inside '.content'
    //   $(contentDiv)
    //     .find("div")
    //     .each((innerIndex, innerDiv) => {
    //       console.log("innerDiv.children");
    //       console.log(innerDiv.children);

    //       //  console.log("innerDiv.children.find('span, p')")
    //       //  console.log(innerDiv.children.find('span, p'))
    //       //  const innerDivText = $(innerDiv).find('span, p').text().trim();
    //       //  console.log("innerDivText")
    //       //  console.log(innerDivText)
    //       //       test= $(innerDiv).find('span, p').text().trim();
    //       test = "test";
    //     });
    // });

    // console.log("Ttest");
    // console.log(test);
    // var descriptionParagraph =
    // $(`p:contains(${DESCRIPTION_KEY_WORDS.join('), p:contains(')})`).text();

    // DESCRIPTION_KEY_WORDS.forEach(keyword => {
    //   descriptionParagraph = descriptionParagraph.replace(keyword, '');
    // });

    // console.log("descriptionParagraph")

    // console.log(descriptionParagraph)
    // Select the element with a specific class name
    // var descriptionText =
    //   $(`p:contains(${DESCRIPTION_KEY_WORDS[0]})`).text() ||
    //   $(`p:contains(${DESCRIPTION_KEY_WORDS[1]})`).text() ||
    //   $(`p:contains(${DESCRIPTION_KEY_WORDS[2]})`).text() ||
    //   $(`p:contains(${DESCRIPTION_KEY_WORDS[3]})`).text();

    //   DESCRIPTION_KEY_WORDS.forEach((keyWord)=>{
    //     descriptionText.replace(keyWord,"")
    //   })

    // console.log("descriptionContainer");
    // console.log(descriptionContainer.children);

    // if (descriptionContainer) {
    //   descriptionContainer.children().each((index, element) => {
    //     const childText = $(element).text();
    //     // console.log("childText");
    //     // console.log(childText);

    //     descriptionText += `${childText}\n`;

    //     // const isTitle = DESCRIPTION_TITLE_KEY_WORDS.includes(childText)
    //     // console.log("isTitle")
    //     // console.log(isTitle)
    //     console.log("---");
    //     const specificationsTitle = $(
    //       'b:contains("' + "Specifications :" + '")'
    //     );

    //     // Extract information or perform actions with the found element
    //     console.log("ebayItemNumber");
    //     console.log(ebayItemNumber);
    //     console.log("specificationsTitle.text()");
    //     console.log(specificationsTitle.text());
    //     console.log("---");

    //     // Use the extracted information as needed
    //   });
    // }

    // [
    //   DESCRIPTION_REMOVABLE_TEXT_1,
    //   DESCRIPTION_REMOVABLE_TEXT_2,
    //   DESCRIPTION_REMOVABLE_TEXT_3,
    //   DESCRIPTION_REMOVABLE_TEXT_4,
    // ].forEach((removableText) => {
    //   descriptionText.replaceAll(removableText, "");
    // });

    // Remove the contents of the div with class "tt-header"

    // Remove specific classes from the body element
    // $("body").removeClass("tt-header tt-banner tt-md-l");

    // let textString = "";
    // let htmlString = "";

    // Print the text content of the selected elements
    // selectedElements.each(function () {
    //   console.log($(this).text());
    // });

    //     ["p", "h1", "b", "span"].forEach((elementName) => {
    //       $(elementName).each((index, element) => {
    //         const textContent = $(element).text();
    //         const htmlContent = $(element).html();

    //         // Append text content to the text string (separated by a new line)
    //         textString += `${textContent}\n`;

    //         // Append HTML content to the HTML string
    //         htmlString += htmlContent;
    //       });
    //     });
    //     console.log("textStringlength");
    //     console.log(textString.length);
    //     console.log("htmlStringlength");
    //     console.log(htmlString.length);

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

    allProducts[currentProductNumber].descriptionText = descriptionText;
    // allProducts[currentProductNumber].descriptionHtml = htmlString.length < 32767 ? htmlString : "N/A";
  } catch (error) {
    console.log("error from getDescription");
    console.log(error);
    allProducts[currentProductNumber].description = "N/A";
  }
};

export default getDescription;

// https://vi.vipr.ebaydesc.com/ws/eBayISAPI.dll?ViewItemDescV4&item=223697288722&t=0&category=72209&seller=happylifeuk&excSoj=1&excTrk=1&lsite=3&ittenable=false&domain=ebay.com&descgauge=1&cspheader=1&oneClk=2&secureDesc=1
