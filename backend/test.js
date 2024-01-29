import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";
import axios from "axios";
import cheerio from "cheerio";


const DESCRIPTION_KEY_WORDS = [
  "Please kindly check your car model and make sure the model fits in case of buying the wrong product",
  "No installation instruction included,easy to install.",
  "Any damage and improper installation during the installation will not allow to get money refund.",
  "Please leave us positive feedback if you are satisfied with our product and service, if not please contact us,we will solve your problem asap, many thanks.",
];

XLSX.set_fs(fs);

// const test = async () => {
//   try {
//     // Your array
//     const data = [
//       { name: "john", age: 34, images: "src1" },
//       { name: null, age: null, images: "src2" },
//       { name: null, age: null, images: "src3" },
//       { name: null, age: null, images: "src4" },
//       { name: "tone", age: 32, images: "src1" },
//       { name: null, age: null, images: "src2" },
//       { name: "man", age: 42, images: "src1" },
//       { name: null, age: null, images: "src2" },
//       { name: "steve", age: 14, images: "src1" },
//       { name: null, age: null, images: "src2" },
//       { name: null, age: null, images: "src3" },
//       { name: null, age: null, images: "src4" },
//       { name: null, age: null, images: "src5" },
//       { name: null, age: null, images: "src6" },

//     ];

//     // Create a new workbook
//     const workbook = XLSX.utils.book_new();

//     // Create a worksheet and add the modified data
//     const worksheet = XLSX.utils.json_to_sheet(data, {
//       header: ["name", "age", "images"],

//     });

//     // Add the worksheet to the workbook
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

//     // Save the workbook as an XLSX file
//     XLSX.writeFile(workbook, "./output/test.xlsx");
//   } catch (error) {
//     console.log("error");
//     console.log(error);
//   }
// };

const test = async () => {
  try {
    const iframeUrl = `https://vi.vipr.ebaydesc.com/ws/eBayISAPI.dll?ViewItemDescV4&item=374436174444&t=0&category=72209&seller=happylifeuk&excSoj=1&excTrk=1&lsite=3&ittenable=false&domain=ebay.com&descgauge=1&cspheader=1&oneClk=2&secureDesc=1`;

    const response = await axios.get(iframeUrl);

    const html = response.data;
    const $ = cheerio.load(html);

    // const specificationsTitle = $(
    //   'b:contains("Specifications :")'
    // );

    var descriptionParagraph =
      $(`p:contains(${DESCRIPTION_KEY_WORDS[0]})`).text() ||
      $(`p:contains(${DESCRIPTION_KEY_WORDS[1]})`).text() ||
      $(`p:contains(${DESCRIPTION_KEY_WORDS[2]})`).text() ||
      $(`p:contains(${DESCRIPTION_KEY_WORDS[3]})`).text();


    console.log("descriptionParagraph");
    console.log(descriptionParagraph);
  } catch (error) {
    console.log("error");
    console.log(error);
  }
};

test();

