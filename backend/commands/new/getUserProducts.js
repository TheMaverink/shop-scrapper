import getEbay from "./getEbay";

const getStoreProducts = async (sellerName, categoryId) => {
  try {
    const eBay = getEbay();

    const findItemsResponse = await eBay.finding.findItemsAdvanced({
      itemFilter: [
        {
          name: {
            Seller: sellerName,
          },
          sellerUserName: sellerName,
          categoryId: 72209,
        },
      ],
      keywords: "katze",
    });

    console.log("findItemsResponse");
    console.log(findItemsResponse);
  } catch (error) {
    console.log("error from getStoreProducts");
    console.log(error);

  }
};

export default getStoreProducts;
