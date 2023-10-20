const getAllTextFromElement = async (elementHandle) => {
  let text = [];

  const elementText = await elementHandle.evaluate(
    (element) => element.textContent
  );

  if (elementText && elementText.trim() !== "") {
    text.push(elementText.trim());
  }

  const childElements = await elementHandle.$$("*");

  for (const childElement of childElements) {
    text = text.concat(await getAllTextFromElement(childElement));
  }

  return text;
};

export default getAllTextFromElement;
