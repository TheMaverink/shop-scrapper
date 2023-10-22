// const getAllTextFromElement = async (elementHandle) => {
//   let text = [];

//   const elementText = await elementHandle.evaluate(
//     (element) => element.textContent
//   );

//   if (elementText && elementText.trim() !== "") {
//     text.push(elementText.trim());
//   }

//   const childElements = await elementHandle.$$("*");

//   for (const childElement of childElements) {
//     const currentChildText  = await getAllTextFromElement(childElement)

//     console.log("xono")
//     console.log(text.includes(currentChildText))
//     text = text.concat(currentChildText);
//   }

//   return text;
// };

const getAllTextFromElement = async (elementHandle) => {
  const elementText = await elementHandle.evaluate(
    (element) => element.textContent
  );

  return elementText.trim();
};

export default getAllTextFromElement;
