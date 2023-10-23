const getImages = async (page, allProducts, currentProductNumber) => {
  try {
    const ImagesParent = await page.$(".ux-image-filmstrip-carousel");

    if (ImagesParent) {
      const imgSrcs = await ImagesParent.$$eval("button img", (images) =>
        images.map((img) => img.getAttribute("src"))
      );

      if (imgSrcs.length > 0) {
        imgSrcs.forEach((imgSrc, index) => {
          let largeImg = imgSrc.replaceAll("s-l64.jpg", "s-l1600.jpg");

          allProducts[currentProductNumber][`image-${index + 1}`] = largeImg;
        });
      } else {
        console.error("Image sources not found.");
      }
    } else {
      console.error("Images parent element not found.");
    }
  } catch (error) {
    console.log("error from getImages");
    console.log(error);
  }
};

export default getImages;
