import * as XLSX from 'xlsx';

const ExportarExcel = ({ data, filename, sheetname, titlebutton }) => {
  const exportToExcel = () => {
    // Crear un nuevo libro de trabajo
    const wb = XLSX.utils.book_new();

    // Convertir los datos en una hoja de cálculo
    const ws = XLSX.utils.json_to_sheet(data);

    // Definir el estilo de la cabecera
    const headerStyle = {
      fill: {
        fgColor: { rgb: "00FF00" }, // Fondo verde
      },
      font: {
        bold: true,
        color: { rgb: "FFFFFF" }, // Texto blanco
        sz: 12, // Tamaño de fuente
        name: "Arial", // Fuente
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
        wrapText: true, // Ajusta el texto a la celda
      },
    };

    // Obtener las claves de las columnas (encabezados)
    const headers = Object.keys(data[0] || {});

    // Aplicar el estilo a las celdas de la cabecera
    headers.forEach((header, i) => {
      const cellAddress = { c: i, r: 0 };
      const cellRef = XLSX.utils.encode_cell(cellAddress);

      if (!ws[cellRef]) ws[cellRef] = {};
      ws[cellRef].s = headerStyle; // Aplicar estilo
    });

    // Añadir filtros a la primera fila
    ws['!autofilter'] = { ref: ws['!ref'] };

    // Ajustar el ancho de las columnas y altura de las filas si es necesario
    ws['!cols'] = headers.map(() => ({ width: 20 }));
    ws['!rows'] = [{ hpt: 25 }]; // Ajusta la altura de las filas

    // Definir el nombre del archivo con fecha y hora
    const currentDate = new Date();
    const dateString = currentDate.toISOString().split("T")[0];
    const timeString = currentDate
      .toTimeString()
      .split(" ")[0]
      .replace(/:/g, "");
    const filenameWithTimestamp = `export_${filename}_${dateString}_${timeString}.xlsx`;

    // Añadir la hoja de cálculo al libro de trabajo
    XLSX.utils.book_append_sheet(wb, ws, sheetname || "Sheet1");

    // Guardar el archivo
    XLSX.writeFile(wb, filenameWithTimestamp);
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
