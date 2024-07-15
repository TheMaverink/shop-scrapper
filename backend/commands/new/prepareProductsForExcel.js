import scrapeDescription from "./scrapeDescription";

const prepareProductsForExcel = async (products) => {
  try {
    let preparedProducts = products
      .filter((p) => !!p)
      .flatMap((product, productIndex) => {
        const {
          itemId,
          legacyItemId,
          title,
          shortDescription,
          description,
          price,
          image,
          additionalImages,
          itemWebUrl,
        } = product;

        const imagesArr = additionalImages || [];

        return imagesArr.map((imgItem, imgItemIndex) => {
          const isFirstImage = imgItemIndex == 0;

          return {
            Title: isFirstImage ? title : "",
            "Body (HTML)": "",
            Vendor: "",
            "Product Category": "",
            Type: "",
            Tags: "",
            "Image Src": imgItem?.imageUrl,
            "Image Position": imgItemIndex + 1,
            Published: "false",
            "Variant SKU": isFirstImage ? legacyItemId : "",
            url: isFirstImage ? itemWebUrl : "",
            // scrapeNumber: isFirstImage ? productIndex : "",
            // url: isFirstImage ? itemWebUrl : "",
            // sku: isFirstImage ? legacyItemId : "",
            // title: isFirstImage ? title : "",
            price: isFirstImage ? price?.value : "",
            shortDescription: isFirstImage ? shortDescription : "",
            htmlDescription: isFirstImage ? description : "",
            filteredDescription: "",
            // images: imgItem?.imageUrl,
          };
        });
      });

    const scrapedDescriptionsPromises = [];
    const scrapedDescriptions = [];

    preparedProducts.forEach((product) => {
      scrapedDescriptionsPromises.push(
        scrapeDescription(product.htmlDescription)
      );
    });

    await Promise.all(scrapedDescriptionsPromises)
      .then((descriptions) => {
        descriptions.forEach((i) => scrapedDescriptions.push([i]));
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    scrapedDescriptions.forEach(
      (scrapedDescription, scrapedDescriptionIndex) => {
        preparedProducts[scrapedDescriptionIndex].filteredDescription =
          scrapedDescription[0];

        preparedProducts[scrapedDescriptionIndex]["Body (HTML)"] =
          scrapedDescription[0];
      }
    );

    return preparedProducts;
  } catch (error) {
    console.log("error from prepareProductsForExcel");
    console.log(error);
  }
};

export default prepareProductsForExcel;
