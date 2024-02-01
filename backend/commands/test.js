import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";
import axios from "axios";
import cheerio from "cheerio";

export const TEXT_TO_REMOVE = [
  "Note :",
  "* Check our other listing at our store and save us as your favorite sellers.* Please leave us positive feedback if you are satisfied with our product and service, if not please contact us,we will solve your problem asap, many thanks.",
  "Important Notice : all of our products are required to be installed in professional Modification car shop , NOT every car shop can make it ! Our products are modified car parts , NOT original products ,Small install gap is Allowed ! Please contact us first and DON'T leave bad feedback / DON'T open dispute ,thanks .",
  "SHIPPINGPAYMENTWARRANTYFEEDBACKCONTACT US",
  "SHIPPING",
  "PAYMENT",
  "WARRANTY",
  "FEEDBACK",
  "CONTACT US",
  "Friend, please check the listing location , if the location in USA/AU/UK,then the estimated shipping time is:3-5 business daysAnd most orders will be shipped within handling time .NOTE : Import duties, taxes and charges are not included in the item price or shipping charges. These charges are the buyer's responsibility.We accept payment via various payment wayIf there is any problem, please feel free to contact us ,thanks !We will offer the best quality product to our customer .If there is an problem, you can feel free to contact us , we can offer the best service to you .And if you need the installation instruction , please let us know ,we will try to send it to you .If you have any question or concern, please do not hesitate to contact our customer support team.Please do contact us first before opening a return request, leaving low ratings or negative/neutral feedback.E-mails will be replied in working day . Please allow up to 48 hours for a response to your message.",
  "Friend, please check the listing location , if the location in USA/AU/UK,then the estimated shipping time is:3-5 business daysAnd most orders will be shipped within handling time .NOTE : Import duties, taxes and charges are not included in the item price or shipping charges. These charges are the buyer's responsibility.",
  "We accept payment via various payment wayIf there is any problem, please feel free to contact us ,thanks !",
  "We will offer the best quality product to our customer .If there is an problem, you can feel free to contact us , we can offer the best service to you .And if you need the installation instruction , please let us know ,we will try to send it to you .",
  "If you have any question or concern, please do not hesitate to contact our customer support team.Please do contact us first before opening a return request, leaving low ratings or negative/neutral feedback.",
  "E-mails will be replied in working day . Please allow up to 48 hours for a response to your message.",
  "SHIPPINGFriend, please check the listing location , if the location in USA/AU/UK,then the estimated shipping time is:3-5 business daysAnd most orders will be shipped within handling time .NOTE : Import duties, taxes and charges are not included in the item price or shipping charges. These charges are the buyer's responsibility.PAYMENTWe accept payment via various payment wayIf there is any problem, please feel free to contact us ,thanks !WARRANTYWe will offer the best quality product to our customer .If there is an problem, you can feel free to contact us , we can offer the best service to you .And if you need the installation instruction , please let us know ,we will try to send it to you .FEEDBACKIf you have any question or concern, please do not hesitate to contact our customer support team.Please do contact us first before opening a return request, leaving low ratings or negative/neutral feedback.CONTACT USE-mails will be replied in working day . Please allow up to 48 hours for a response to your message.",
  "Please contact us first and DON'T leave bad feedback / DON'T open dispute ,thanks .",
];

const DESCRIPTION_KEY_WORDS = [
  "Please kindly check your car model and make sure the model fits in case of buying the wrong product",
  "No installation instruction included,easy to install.",
  "Any damage and improper installation during the installation will not allow to get money refund.",
  "Please leave us positive feedback if you are satisfied with our product and service, if not please contact us,we will solve your problem asap, many thanks.",
];

XLSX.set_fs(fs);

const iframeUrl =
  "https://vi.vipr.ebaydesc.com/ws/eBayISAPI.dll?ViewItemDescV4&item=375107711171&t=1704984880000&category=72209&seller=happymotoruk&excSoj=1&excTrk=1&lsite=3&ittenable=false&domain=ebay.com&descgauge=1&cspheader=1&oneClk=2&secureDesc=1";

async function fetchHtml(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching HTML:", error.message);
    throw error;
  }
}

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
    // const iframeUrl = `https://vi.vipr.ebaydesc.com/ws/eBayISAPI.dll?ViewItemDescV4&item=374436174444&t=0&category=72209&seller=happylifeuk&excSoj=1&excTrk=1&lsite=3&ittenable=false&domain=ebay.com&descgauge=1&cspheader=1&oneClk=2&secureDesc=1`;

    // const response = await axios.get(iframeUrl);

    // const html = response.data;
    // const $ = cheerio.load(html);

    // // const specificationsTitle = $(
    // //   'b:contains("Specifications :")'
    // // );

    // var descriptionParagraph =
    //   $(`p:contains(${DESCRIPTION_KEY_WORDS[0]})`).text() ||
    //   $(`p:contains(${DESCRIPTION_KEY_WORDS[1]})`).text() ||
    //   $(`p:contains(${DESCRIPTION_KEY_WORDS[2]})`).text() ||
    //   $(`p:contains(${DESCRIPTION_KEY_WORDS[3]})`).text();

    // console.log("descriptionParagraph");
    // console.log(descriptionParagraph);

    const html = await fetchHtml(iframeUrl);

    // Now you can use Cheerio to parse and manipulate the HTML

    // Remove the contents of the div with class "tt-header"

    let descriptionText;

    let phrasesArray = [];

  

    function iterateChildren(element) {
      element.children().each((index, child) => {
        const childElement = cheerio(child);

        const currentTextPhrase = childElement?.text();

        if (currentTextPhrase?.trim() !== "") {
          // console.log('Element with inner text:', );
          // descriptionText  = descriptionText +childElement.text()+'\n'

          let cleanedCurrentTextPhrase = currentTextPhrase.replace(
            /\t|\n/g,
            ""
          );

          // console.log("cleanedCurrentTextPhrase");
          // console.log(cleanedCurrentTextPhrase);
          // console.log("~-----");

          phrasesArray.push(cleanedCurrentTextPhrase);
        }

        // Recursively call the function for each child's children
        iterateChildren(childElement);
      });
    }

    const $ = cheerio.load(html);

     const targetElement = $('p:contains("Specifications :")');



    console.log("targetElement")
    console.log(targetElement.text())


    const mainContainer = $(".box");

    iterateChildren(mainContainer);

    const filteredArray = [...new Set(phrasesArray)].filter(
      (item) => !TEXT_TO_REMOVE.includes(item)
    );

    let finalText = "";

    filteredArray.forEach((text) => {
      finalText = finalText + text + "\n";
    });

    const concatenatedString = filteredArray.join("\n");

    fs.writeFileSync("output.txt", finalText);

    // mainContainer.find(".content").each((index, contentDiv) => {
    //   // Iterate over divs with no classes inside '.content'
    //   $(contentDiv)
    //     .find("div")
    //     .each((innerIndex, innerDiv) => {

    //       console.log("contentDiv")
    //       console.log(Object.keys(contentDiv))

    //     //   if(!!innerDiv?.children?.length >0){
    //     //     console.log("innerDiv.children");
    //     //     console.log(innerDiv.children.length);

    //     //     const test = innerDiv.children.find('span, p')

    //     //     console.log("innerDiv.children.find('span, p')")
    //     // console.log(test)
    //     //   }

    //       //  console.log("innerDiv.children.find('span, p')")
    //       //  console.log(innerDiv.children.find('span, p'))
    //       //  const innerDivText = $(innerDiv).find('span, p').text().trim();
    //       //  console.log("innerDivText")
    //       //  console.log(innerDivText)
    //       //       test= $(innerDiv).find('span, p').text().trim();

    //     });
    // });
  } catch (error) {
    console.log("error");
    console.log(error);
  }
};

test();
