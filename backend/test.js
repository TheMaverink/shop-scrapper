import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";

XLSX.set_fs(fs);

const test = async () => {
  try {
    // Your array
    const data = [
      { name: "john", age: 34, images: "src1" },
      { name: null, age: null, images: "src2" },
      { name: null, age: null, images: "src3" },
      { name: null, age: null, images: "src4" },
      { name: "tone", age: 32, images: "src1" },
      { name: null, age: null, images: "src2" },
      { name: "man", age: 42, images: "src1" },
      { name: null, age: null, images: "src2" },
      { name: "steve", age: 14, images: "src1" },
      { name: null, age: null, images: "src2" },
      { name: null, age: null, images: "src3" },
      { name: null, age: null, images: "src4" },
      { name: null, age: null, images: "src5" },
      { name: null, age: null, images: "src6" },

    ];


    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Create a worksheet and add the modified data
    const worksheet = XLSX.utils.json_to_sheet(data, {
      header: ["name", "age", "images"],

    });

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Save the workbook as an XLSX file
    XLSX.writeFile(workbook, "./output/test.xlsx");
  } catch (error) {
    console.log("error");
    console.log(error);
  }
};

test();
