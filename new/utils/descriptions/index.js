import dotenv from "dotenv";
import descriptionsStrategies from "./strategies";
dotenv.config({ path: ".env" });

const { TARGET_SELLER_NAME } = process.env;

const getDescription = async (fullTextDescription) => {
  try {
    let description;

    switch (TARGET_SELLER_NAME) {
      case "autotrim88":
        description =
         await descriptionsStrategies.autoTrim88Strategy(fullTextDescription);

      default:
        description = "";
    }

    return description;
  } catch (error) {
    console.log("error from getDescription");
    console.log(error);

    return "";
  }


};

export default getDescription;
