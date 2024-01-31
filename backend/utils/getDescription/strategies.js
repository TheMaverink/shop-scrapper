import {
  DESCRIPTION_TITLE_KEY_WORDS,
  MINIMUM_DESCRIPTION_LENGTH,
  TEXT_TO_REMOVE,
} from "./consts";


function removeBeforeSubstring(inputString, substring) {
    const index = inputString.indexOf(substring);
  
    if (index !== -1) {
      // If the substring is found, extract the portion after the substring
      return inputString.substring(index + substring.length);
    } else {
      // If the substring is not found, return the original string
      return inputString;
    }
  }


export const strategyA = async ($) => {
  try {
    // const targetElement = $(`p:contains(${DESCRIPTION_TITLE_KEY_WORDS[0]})`).text();

    // console.log("targetElement")
    //  console.log(targetElement)

    // const titleKeyWordIndex =
    //   ($(`p:contains(${DESCRIPTION_TITLE_KEY_WORDS[0]})`).text().length >
    //     MINIMUM_DESCRIPTION_LENGTH &&
    //     0) ||
    //   ($(`p:contains(${DESCRIPTION_TITLE_KEY_WORDS[1]})`).text().length >
    //     MINIMUM_DESCRIPTION_LENGTH &&
    //     1) ||
    //   ($(`p:contains(${DESCRIPTION_TITLE_KEY_WORDS[2]})`).text().length >
    //     MINIMUM_DESCRIPTION_LENGTH &&
    //     2) ||
    //   ($(`p:contains(${DESCRIPTION_TITLE_KEY_WORDS[3]})`).text().length >
    //     MINIMUM_DESCRIPTION_LENGTH &&
    //     3) ||
    //   ($(`p:contains(${DESCRIPTION_TITLE_KEY_WORDS[4]})`).text().length >
    //     MINIMUM_DESCRIPTION_LENGTH &&
    //     4) ||
    //   ($(`p:contains(${DESCRIPTION_TITLE_KEY_WORDS[5]})`).text().length >
    //     MINIMUM_DESCRIPTION_LENGTH &&
    //     5) ||
    //   ($(`p:contains(${DESCRIPTION_TITLE_KEY_WORDS[6]})`).text().length >
    //     MINIMUM_DESCRIPTION_LENGTH &&
    //     6) ||
    //   ($(`p:contains(${DESCRIPTION_TITLE_KEY_WORDS[7]})`).text().length >
    //     MINIMUM_DESCRIPTION_LENGTH &&
    //     7) ||
    //   $(`p:contains(${DESCRIPTION_TITLE_KEY_WORDS[7]})`).text();

    let descriptionHtml = $(
      `p:contains(${DESCRIPTION_TITLE_KEY_WORDS[0]})`
    );

    let descriptionText = descriptionHtml.text();

    // TEXT_TO_REMOVE.forEach((keyWord) => {
    //   descriptionText.replace(keyWord, "");
    // });

    descriptionText = removeBeforeSubstring(descriptionText,DESCRIPTION_TITLE_KEY_WORDS[0])

    return {
      descriptionText,
      descriptionHtml:
        descriptionHtml?.html()?.length < 30000
          ? descriptionHtml?.html()
          : "n/a",
      descriptionStrategy: "A",
    };
  } catch (error) {
    console.log("error");

    console.log(error);
  }
};

export const strategyB = async ($) => {
    try {

  
      let descriptionHtml = $(
        `p:contains(${DESCRIPTION_TITLE_KEY_WORDS[1]})`
      );
  
      let descriptionText = descriptionHtml.text();
  
      // TEXT_TO_REMOVE.forEach((keyWord) => {
      //   descriptionText.replace(keyWord, "");
      // });
  
      descriptionText = removeBeforeSubstring(descriptionText,DESCRIPTION_TITLE_KEY_WORDS[1])
  
      return {
        descriptionText,
        descriptionHtml:
          descriptionHtml?.html()?.length < 30000
            ? descriptionHtml?.html()
            : "n/a",
        descriptionStrategy: "A",
      };
    } catch (error) {
      console.log("error");
  
      console.log(error);
    }
  };
