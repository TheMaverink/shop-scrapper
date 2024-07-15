import getEbay from "./getEbay";

const getProduct = async (itemId) => {
  try {
    const eBay = getEbay();

    const product = await eBay.buy.browse.getItem(`v1|${itemId}|0`);

    return product || false;
  } catch (error) {
    console.log("error from getProduct");
    console.log(error);
    return false;
  }
};

export default getProduct;
