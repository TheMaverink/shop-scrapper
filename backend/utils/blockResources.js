const blockResources = async (page) => {
  try {

    await page.setRequestInterception(true);
    
    page.on("request", (request) => {
      const resourceType = request.resourceType();

      if (resourceType === "image" || request.resourceType() === "stylesheet") {
        request.abort();
      } else {
        request.continue();
      }
    });
  } catch (error) {
    console.log("error");
    console.log(error);
  }
};

export default blockResources;
