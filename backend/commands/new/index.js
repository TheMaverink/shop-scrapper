import dotenv from "dotenv";

import getStoreProducts from "./getStoreProducts.js";
import getUserProducts from "./getUserProducts.js";
import getProduct from "./getProduct.js";
import prepareProductsForExcel from "./prepareProductsForExcel";
import saveToExcel from "./saveToExcel";

dotenv.config({ path: ".env" });

const {
  IS_STORE,
  TARGET_SELLER_NAME,
  TARGET_SELLER_CATEGORY_ID,
  FIRST_ITEM,
  LAST_ITEM,
} = process.env;

const isStore = IS_STORE == "true";

const newCommand = async () => {
  try {
    let products = [];

    if (isStore) {
      console.log("store");
      products = await getStoreProducts(
        TARGET_SELLER_NAME,
        Number(TARGET_SELLER_CATEGORY_ID)
      );
    } else {
      console.log("not store");
      products = await getUserProducts(
        TARGET_SELLER_NAME,
        Number(TARGET_SELLER_CATEGORY_ID)
      );
    }


    console.log("products!!!!")
    console.log(products)

    const rangedArray = products.slice(FIRST_ITEM, LAST_ITEM);

    console.log("rangedArray!!!!")
    console.log(rangedArray)

    //ISSUE IS WAY LONGER THAN ARRAY; THE RANGE
    // console.log(rangedArray)
    // console.log(products.length)
    // console.log(FIRST_ITEM)
    // console.log(LAST_ITEM)

    // console.log(rangedArray.length)

    const promises = rangedArray.map(async (product, index) => {
      console.log("product!!!")
      console.log(product)

      await new Promise((resolve) => setTimeout(resolve, index * 500));



      const productData = await getProduct(product.itemId);
      //  console.log("Product data for", product.itemId, ":", productData);

      return productData?.categoryIdPath?.includes(TARGET_SELLER_CATEGORY_ID)
        ? productData
        : null;
    });

    const productsArray = await Promise.all(promises);
    console.log("1");
    console.log(1);
    const preparedProducts = await prepareProductsForExcel(productsArray);
    console.log("2");
    console.log(2);
    await saveToExcel(preparedProducts);

    return true;
  } catch (error) {
    console.log("error");
    console.log(error);
  }
};

newCommand();
