import jsPDF from "jspdf";
import "jspdf-autotable";


const ExportarPDF = ({ data, filename, titlebutton, orientation }) => {
  const exportToPDF = () => {
 // Crear un nuevo documento PDF
 const doc = new jsPDF(orientation);

 const logo = new Image();
 logo.src = process.env.NEXT_PUBLIC_CURRENT_URL + '/agrisoft_logo.png';

 logo.onload = () => {
   // Agregar la imagen del logo al PDF
   doc.addImage(logo, 'PNG', 10, 10, 20, 20);

   // Calcular la altura de la imagen del logo
   const logoHeight = 20;
   const tableVerticalPosition = logoHeight + 20;

 // Definir las columnas y filas para el contenido del PDF
 const columns = Object.keys(data[0]);
 const rows = data.map((obj) => {
   return Object.values(obj).map((value) => {
     // Verificar si el valor es una URL de imagen
     if (typeof value === 'string' && (value.endsWith('.png') || value.endsWith('.jpg') || value.endsWith('.jpeg'))) {
       // Devolver el texto HTML que contiene la etiqueta <img>
       return value;
     } else {
       // Convertir el valor a una cadena de texto
       return value.toString();
     }
   });
 });

  console.log(rows);

   // Calcular la posición vertical para la tabla
// Ajusta este valor según sea necesario

   // Agregar el contenido al PDF
   doc.autoTable({
    head: [columns],
    body: rows,
    startY: tableVerticalPosition,
    didDrawCell: function(data) {
      const value = data.cell.raw;
      if (typeof value === 'string' && (value.endsWith('.png') || value.endsWith('.jpg') || value.endsWith('.jpeg'))) {
       
        const img = new Image();
        img.src = value;
        img.onload = function() {

          doc.addImage(img, 'PNG', 10, 10, 20, 20);
        };
      }
    }
  });

   // Obtener la fecha y hora actual para incluir en el nombre del archivo
   const currentDate = new Date();
   const dateString = currentDate.toISOString().split("T")[0];
   const timeString = currentDate
     .toTimeString()
     .split(" ")[0]
     .replace(/:/g, "");

   // Nombre del archivo con fecha y hora
   const filenameWithTimestamp = `export_${filename}_${dateString}_${timeString}`;

   // Guardar el archivo PDF
   doc.save(`${filenameWithTimestamp}.pdf`);
 };
  };

  return (
    <button
      onClick={exportToPDF}
      className="max-w-[300px] linear mt-2 w-fit px-5 rounded-xl bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-red-900 active:bg-brand-900  dark:text-white items-center justify-center flex gap-2 normal-case"
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
          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
        />
      </svg>

      {titlebutton ? titlebutton : "Exportar a PDF"}
    </button>
  );
};

export default ExportarPDF;
