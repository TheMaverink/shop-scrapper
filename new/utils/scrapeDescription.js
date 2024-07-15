import cheerio from "cheerio";

function removeTextBeforeSubstring(inputString, substringToRemove) {
  const index = inputString.indexOf(substringToRemove);

  if (index !== -1) {
    // If the substring is found, extract the part of the string after it
    return inputString.substring(index + substringToRemove.length).trim();
  } else {
    // If the substring is not found, return the original string
    return inputString;
  }
}

function removeTextAfterSubstring(inputString, substringToRemove) {
  const index = inputString.indexOf(substringToRemove);

  if (index !== -1) {
    // If the substring is found, extract the part of the string before it
    return inputString.substring(0, index).trim();
  } else {
    // If the substring is not found, return the original string
    return inputString;
  }
}

const scrapeDescription = async (html) => {
  try {
    const $ = cheerio.load(html);

    // const targetElement = $('p:contains("Description :")').text();

    const contentElement = $(".content");

    if (contentElement.length > 0) {
      const textContent = contentElement.text().trim();
      // console.log("contentElement.text()");
      // console.log(contentElement.text());
      // console.log("textContent");
      // console.log(textContent);

      const substringToRemoveBeggining = "Specifications :";
      const substringToRemoveAfter = "Please leave us positive feedback";

      let outputString = removeTextBeforeSubstring(
        textContent,
        substringToRemoveBeggining
      );

       outputString = removeTextAfterSubstring(
        textContent,
        substringToRemoveAfter
      );


      return outputString;
    } else {
      return "";
    }
  } catch (error) {
    console.log("error from scrapeDescription");
    console.log(error);
  }
};

export default scrapeDescription;
