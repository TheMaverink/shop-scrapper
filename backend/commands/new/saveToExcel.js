import dotenv from "dotenv";

import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";

dotenv.config({ path: ".env" });

const { TARGET_SELLER_NAME, FIRST_ITEM, LAST_ITEM } = process.env;

XLSX.set_fs(fs);

const saveToExcel = async (data) => {
  try {
    const workbook = await XLSX.utils.book_new();

    const worksheet = await XLSX.utils.json_to_sheet(data);

    const totalRows = data?.length;
    const totalColumns = data[0]?.length;

    worksheet["!rows"] = worksheet["!rows"] || [];
    worksheet["!cols"] = worksheet["!cols"] || [];

    for (let rowIndex = 1; rowIndex <= totalRows; rowIndex++) {
      worksheet["!rows"][rowIndex] = { hpx: 30 };
    }

    for (let colIndex = 0; colIndex < totalColumns; colIndex++) {
      worksheet["!cols"][colIndex] = { wch: 260 };
    }

    await XLSX.utils.book_append_sheet(workbook, worksheet, TARGET_SELLER_NAME);

    const filePath = `./output/${TARGET_SELLER_NAME}-${FIRST_ITEM}-${LAST_ITEM}.xlsx`;

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "");
    }

    await XLSX.writeFile(workbook, filePath);
    console.log(`saved on ${filePath}`)

    // await XLSX.writeFile(workbook, `./output/output.xlsx`);
  } catch (error) {
    console.log("error from saveToExcel");
    console.log(error);
  }
};

export default saveToExcel;
