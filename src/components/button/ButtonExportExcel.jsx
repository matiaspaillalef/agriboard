import * as XLSX from "xlsx";

const ExportarExcel = ({ data, filename, sheetname, titlebutton }) => {
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    //const logo = process.env.NEXT_PUBLIC_CURRENT_URL + '/agrisoft_logo.png';

    /*if (logo) {
      const logoImage = XLSX.utils.base64_to_sheet(logo, { type: 'png' });
      XLSX.utils.book_append_sheet(wb, logoImage, 'Logo');
    }*/

    const currentDate = new Date();
    const dateString = currentDate.toISOString().split("T")[0];
    const timeString = currentDate
      .toTimeString()
      .split(" ")[0]
      .replace(/:/g, "");

    // Nombre del archivo con fecha y hora
    const filenameWithTimestamp = `export_${filename}_${dateString}_${timeString}`;

    XLSX.utils.book_append_sheet(wb, ws, sheetname || "Sheet1");
    XLSX.writeFile(wb, filenameWithTimestamp + ".xlsx" || "export.xlsx");
  };

  return (
    <button
      onClick={exportToExcel}
      className="max-w-[300px] linear mt-2 w-fit px-5 rounded-xl bg-green-600 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-green-900 dark:text-white items-center justify-center flex gap-2 normal-case"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
        />
      </svg>

      {titlebutton ? titlebutton : "Exportar a Excel"}
    </button>
  );
};

export default ExportarExcel;
