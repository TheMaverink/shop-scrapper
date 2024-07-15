import dotenv from "dotenv";
import eBayApi from "ebay-api";

dotenv.config({ path: ".env" });

const {
  IS_DEV,
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

export default getEbay;
