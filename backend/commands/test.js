import dotenv from "dotenv";
import axios from "axios";
import eBayApi from "ebay-api";

dotenv.config({ path: ".env" });

const {
  IS_DEV,
  EBAY_APPLICATION_NAME,
  EBAY_APP_ID_SANDBOX,
  EBAY_DEV_ID_SANDBOX,
  EBAY_CLIENT_SECRET_SANDBOX,
  EBAY_APP_ID_PRODUCTION,
  EBAY_DEV_ID_PRODUCTION,
  EBAY_CLIENT_SECRET_PRODUCTION,
} = process.env;

const isDev = IS_DEV == "true";

const ebayAppId = isDev ? EBAY_APP_ID_SANDBOX : EBAY_APP_ID_PRODUCTION;
const ebayCertId = isDev
  ? EBAY_CLIENT_SECRET_SANDBOX
  : EBAY_CLIENT_SECRET_PRODUCTION;

const ebayDevId = isDev ? EBAY_DEV_ID_SANDBOX : EBAY_DEV_ID_PRODUCTION;

// export const SHOP_NAME = "happymotoruk";
// export const SHOP_NAME = "partsshack";
export const SHOP_NAME = "thebodykitshop-uk"

const getEbay = () => {
  const eBay = new eBayApi({
    appId: ebayAppId,
    certId: ebayCertId,
    sandbox: isDev,
    devId: ebayDevId,
    siteId: eBayApi.SiteId.EBAY_GB,
    marketplaceId: eBayApi.MarketplaceId.EBAY_GB,
  });

  return eBay;
};

const getStoreProducts = async () => {
  try {
    const eBay = getEbay();

    let targetProducts = [];
    let currentPage = 1;

    let canFetchAgain = true;

    //GETTING SHOP PRODUCTS
    while (canFetchAgain) {
      const storeName = SHOP_NAME; // Replace with the eBay shop name or user ID

      const searchParams = {
        storeName,
        sortOrder: "EndTimeNewest",
        paginationInput: {
          entriesPerPage: 240, // Adjust the number of items per page as needed
          pageNumber: currentPage,
        },
      };

      console.log("currentPage");
      console.log(currentPage);

      const findItemsIneBayStoresResponse =
        await eBay.finding.findItemsIneBayStores(searchParams);

      const { searchResult, paginationOutput } = findItemsIneBayStoresResponse;
      const { item } = searchResult;
      const { pageNumber, entriesPerPage, totalPages, totalEntries } =
        paginationOutput;

      if (!!item) {
        targetProducts = [...targetProducts, ...item];
        canFetchAgain = false;
        currentPage++;
      } else {
        canFetchAgain = false;
      }
    }

    //-------

    const filteredTargetProducts = targetProducts.filter((product) => {
      return product?.primaryCategory?.categoryId === 72209;
    });

  
  } catch (error) {
    console.log("error from getStoreProducts");
    console.log(error);
  }
};




const getProduct = async (itemId) => {
  try {
    const eBay = getEbay();
    const item = await eBay.buy.browse.getItem(`v1|${itemId}|0`);

    console.log("item!!!!");

    console.log(item);
    console.log(item.title);
  } catch (error) {
    console.log("error from getProduct");
    console.log(error);
  }
};

// getProduct();

 getStoreProducts();

// const products = await eBay.finding.findItemsByProduct({
//   productId: {
//     "@_type": "ReferenceID",
//     "#value": "53039031",
//   },
// });

// const time = await eBay.trading.GeteBayOfficialTime();

// console.log("time!!!");
// console.log(time);

// const item = await eBay.buy.browse.getItem('v1|254188828753|0');
// console.log(JSON.stringify(item, null, 2));

// eBay.finding.findItemsIneBayStores({
//   storeName: 'HENDT'
// }, {raw: true}).then(result => {
//   // Return raw XML
//   console.log(result);
// });
// ```
