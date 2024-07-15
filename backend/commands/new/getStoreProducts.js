import getEbay from "./getEbay";

const getStoreProducts = async (storeName, categoryId) => {
  try {
    const eBay = getEbay();

    let targetProducts = [];
    let currentPage = 1;

    let canFetchAgain = true;

    while (canFetchAgain) {
      console.log(`Fetching page nº ${currentPage}`);
      const searchParams = {
        storeName,
        sortOrder: "EndTimeNewest",
        paginationInput: {
          entriesPerPage: 240,
          pageNumber: currentPage,
        },
      };

      const findItemsIneBayStoresResponse =
        await eBay.finding.findItemsIneBayStores(searchParams);

      const item = findItemsIneBayStoresResponse?.searchResult?.item;

      if (!!item && item?.length > 0) {
        targetProducts = [...targetProducts, ...item];
        currentPage++;
        canFetchAgain = true;
      } else {
        canFetchAgain = false;
      }
    }

    console.log("targetProducts");
    console.log(targetProducts);

    const filteredTargetProducts = targetProducts.filter((product) => {
      return product?.primaryCategory?.categoryId === categoryId;
      // return product;
    });

    return filteredTargetProducts;

    //-------
  } catch (error) {
    console.log("error from getStoreProducts!");
    console.log(error);
    console.log(error.meta.errorMessage.error);
    console.log(error.meta.res);
    // console.log(error.meta.errorMessage);
  }
};

export default getStoreProducts;
