import axios from "axios";
import cheerio from "cheerio";

import { strategyA ,strategyB} from "./strategies";

const getDescription = async (page, allProducts, currentProductNumber) => {
  try {
    const { ebayItemNumber } = allProducts[currentProductNumber];

    const iframeUrl = `https://vi.vipr.ebaydesc.com/ws/eBayISAPI.dll?ViewItemDescV4&item=${ebayItemNumber}&t=0&category=72209&seller=happylifeuk&excSoj=1&excTrk=1&lsite=3&ittenable=false&domain=ebay.com&descgauge=1&cspheader=1&oneClk=2&secureDesc=1`;

    const htmlResponse = await axios.get(iframeUrl);

    const html = htmlResponse.data;

    const $ = cheerio.load(html);

    let description = await strategyA($) || await strategyB($);
    

    console.log("description!");
    console.log(description);

    allProducts[currentProductNumber].descriptionText = description?.descriptionText
    allProducts[currentProductNumber].descriptionHtml = description?.descriptionHtml
    allProducts[currentProductNumber].descriptionStrategy = description?.descriptionStrategy

  } catch (error) {
    console.log("error from getDescription");
    console.log(error);
    allProducts[currentProductNumber].description = "N/A";
  }
};

export default getDescription;

// https://vi.vipr.ebaydesc.com/ws/eBayISAPI.dll?ViewItemDescV4&item=223697288722&t=0&category=72209&seller=happylifeuk&excSoj=1&excTrk=1&lsite=3&ittenable=false&domain=ebay.com&descgauge=1&cspheader=1&oneClk=2&secureDesc=1
