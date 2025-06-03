"use client";

import { useState, useEffect, useRef } from "react";
import { formatNumber } from "@/functions/functions";
import ExportarExcel from "@/components/button/ButtonExportExcel";
import { get, set, useForm } from "react-hook-form";
import { Html5Qrcode } from "html5-qrcode";

import Select from 'react-select';
//import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import "@/assets/css/Table.css";
import {
  XMarkIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  QrCodeIcon
} from "@heroicons/react/24/outline";
import {
  getDataFilterBatch

} from "@/app/api/FilterDashboardApi";

import Switch from "@/components/switch";

import { array } from "zod";

const CardTableFilterBatch = ({
  thead,
  title,
  companyID,
  downloadBtn,
  filterTotal,
}) => {
  const columnLabels = thead
    ? thead.split(",").map((label) => label.trim())
    : "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [initialData, setInitialData] = useState();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [isScannerActive, setIsScannerActive] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const qrRef = useRef(null);
  const qrCodeScannerRef = useRef(null);

  const itemsPerPage = 20;

  const cosecheros = Array.isArray(initialData?.cosecheros) ? initialData.cosecheros : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cosecheros.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(cosecheros.length / itemsPerPage);
  const pagination = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    setLoading(true);
    const lote = e.target[0].value.trim();
    if (lote) {
      try {
        const response = await getDataFilterBatch(companyID, lote);

        if (response.code == 'OK') {
          setInitialData(response.data);
          setNotFound(false);
        } else {
          console.error("Error al buscar el lote:", lote);
        }
      } catch (error) {
        console.error("Error al buscar el lote:", error);
        //Mensje de error
        setInitialData(null);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    } else {
      setInitialData([]);
      setLoading(false);
      console.error("Por favor, ingrese un número de lote válido.");
    }
  };

  console.log("initialData", initialData);


  const startScanner = () => {
    setShowScanner(true);
    setIsScannerActive(true);

    setTimeout(() => {
      const qrElement = document.getElementById("qr-reader");
      if (!qrElement) {
        console.error("El elemento 'qr-reader' aún no está disponible.");
        return;
      }

      const html5QrCode = new Html5Qrcode("qr-reader");
      qrCodeScannerRef.current = html5QrCode;

      Html5Qrcode.getCameras().then((devices) => {
        if (devices && devices.length) {
          const cameraId = devices[0].id;
          html5QrCode
            .start(
              cameraId,
              { fps: 10, qrbox: 250 },
              async (decodedText) => {
                await html5QrCode.stop();
                setShowScanner(false);
                setIsScannerActive(false);
                handleQRSearch(decodedText); // Tu lógica de búsqueda
              },
              () => { } // manejar errores si quieres
            )
            .catch((err) => {
              console.error("Error iniciando el escáner:", err);
              setShowScanner(false);
              setIsScannerActive(false);
            });
        }
      }).catch((err) => {
        console.error("No se pudo acceder a la cámara:", err);
        setShowScanner(false);
        setIsScannerActive(false);
      });
    }, 300);
  };

  const stopScanner = async () => {
    if (qrCodeScannerRef.current) {
      try {
        await qrCodeScannerRef.current.stop();
        qrCodeScannerRef.current.clear();
      } catch (err) {
        console.error("Error deteniendo el escáner:", err);
      }
    }
    setShowScanner(false);
    setIsScannerActive(false);
  };


  const handleQRSearch = async (loteQR) => {
    setLoading(true);
    try {
      const response = await getDataFilterBatch(companyID, loteQR.trim());

      if (response.code === "OK") {
        setInitialData(response.data);
        setNotFound(false);
      } else {
        setInitialData(null);
        setNotFound(true);
      }
    } catch (error) {
      console.error("Error en búsqueda por QR:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

const handlerDownloadExcel = async (filenamme, namesheet) => {
  if (
    initialData &&
    typeof initialData === "object" &&
    Array.isArray(initialData.cosecheros) &&
    initialData.cosecheros.length > 0
  ) {
    const cosecheros = initialData.cosecheros;

    const splitRut = (rut) => {
      if (typeof rut !== 'string') return { rutNumber: '', dv: '' };
      const cleanedRut = rut.replace(/[.\-]/g, '');
      return {
        rutNumber: cleanedRut.slice(0, -1),
        dv: cleanedRut.slice(-1),
      };
    };

    const formattedData = cosecheros.map((item) => {
      const rutData = splitRut(item.rut);
      return {
        "Nombre": item.nombre || '',
        "Apellido Paterno": item.apellido || '',
        "Apellido Materno": item.apellido2 || '',
        "RUT": rutData.rutNumber,
        "DV": rutData.dv,
        "Kilos cosechados": item.kilos || 0,
      };
    });

    const headers = Object.keys(formattedData[0]);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(namesheet || 'Reporte');

    // === Agregar datos generales arriba ===
    worksheet.addRow(["General"]);
    worksheet.addRow(["Campo", initialData.campo || ""]);
    worksheet.addRow(["Variedad", initialData.variedad || ""]);
    worksheet.addRow(["Apertura", initialData.apertura?.split("T")[0]?.split("-").reverse().join("-") || ""]);
    worksheet.addRow(["Cierre", initialData.cierre?.split("T")[0]?.split("-").reverse().join("-") || ""]);
    worksheet.addRow(["Kilos", `${initialData.total_kilos_lote || 0} kg`]);
    worksheet.addRow([]); // fila vacía

    // === Tabla de cosecheros ===
    const headerRow = worksheet.addRow(headers);

    // Aplicar estilo a cabecera de cosecheros
    headerRow.eachCell((cell) => {
      cell.style = {
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '132C6D' } },
        font: { bold: true, color: { argb: 'FFFFFF' } },
        alignment: { horizontal: 'left', vertical: 'middle' },
      };
    });

    // Agregar los datos
    formattedData.forEach((row) => {
      worksheet.addRow(Object.values(row));
    });

    // Activar autofiltro en la cabecera
    const headerRowIndex = headerRow.number;
    worksheet.autoFilter = {
      from: `A${headerRowIndex}`,
      to: `${String.fromCharCode(65 + headers.length - 1)}${headerRowIndex}`,
    };

    // Nombre del archivo con fecha/hora
    const now = new Date().toLocaleString("es-CL", {
      timeZone: "America/Santiago",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).replace(/\//g, "-").replace(/:/g, "-").replace(",", "").replace(" ", "_");

    const filename = `${filenamme || "reporte"}_${now}.xlsx`;

    // Descargar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  }
};

  return (
    <>
      <div className="mb-3 filters">


        <div className="mb-3 flex gap-5 w-full items-start sm:flex-col md:flex-row justify-between">

          <form className="flex items-center gap-2" onSubmit={handleSearch}>
            <input type="number" placeholder="Buscar por lote" className="h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white" />
            <span error={errors.lote} className="text-red-500 text-sm">
              {errors.lote && errors.lote.message}
            </span>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-medium text-white transition duration-200 hover:bg-blue-900 dark:text-white w-[250px] h-[48px]"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
              Buscar
            </button>
          </form>

          {initialData && initialData.cosecheros && initialData.cosecheros.length > 0 && (
            <div className="buttonsActions mb-3 flex gap-2 w-full flex-col md:w-auto md:flex-row md:gap-5">
              <button
                type="button"
                onClick={() => handlerDownloadExcel("reporte_trazavilidad_lote", "Reporte Trazabilidad Lote")}
                className="w-full md:max-w-[300px] max-w-full linear md:w-fit px-5 rounded-xl bg-green-600 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-green-900 dark:text-white items-center justify-center flex gap-2 normal-case !flex-1"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                Exportar a Excel
              </button>
            </div>
          )}


          <div className="flex items-start gap-3 flex-col flex-1">
            <button
              type="button"
              onClick={isScannerActive ? stopScanner : startScanner}
              className="flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition duration-200 hover:bg-indigo-900 w-full h-[48px] md:max-w-[300px]"
            >
              {isScannerActive ? (
                <>
                  <XMarkIcon className="w-5 h-5" />
                  Cerrar QR
                </>
              ) : (
                <>
                  <QrCodeIcon className="w-5 h-5" />
                  Escanear QR
                </>
              )}
            </button>

            {showScanner && (
              <div className="mt-4 sm:mt-0 w-full">
                <div id="qr-reader" className="sm:w-full"></div>
              </div>
            )}
          </div>
        </div>


      </div>

      {loading ? (
        <div role="status" className="w-full p-4 animate-pulse">
          {/* Contenedor de ítems */}
          <div className="flex items-center justify-between gap-5 mb-5 flex-wrap">
            <div className="flex items-center gap-5 w-full justify-between">
              <div className="h-[100px] w-1/3 rounded-md bg-gray-300 dark:bg-gray-700 transition-all duration-700"></div>
              <div className="h-[100px] w-1/3 rounded-md bg-gray-300 dark:bg-gray-700 transition-all duration-700 delay-100"></div>
              <div className="h-[100px] w-1/3 rounded-md bg-gray-300 dark:bg-gray-700 transition-all duration-700 delay-200"></div>
            </div>
            <div className="h-[100px] w-full rounded-md bg-gray-300 dark:bg-gray-700 transition-all duration-700 delay-300"></div>
          </div>
        </div>
      ) : (

        initialData && initialData.cosecheros && initialData.cosecheros.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 w-full mb-3">

              <div className="!z-5 relative rounded-[20px] dark:bg-white bg-navy-800 bg-clip-border shadow-3xl shadow-shadow-500 text-white dark:shadow-none dark:text- px-5 py-5">
                <div className="flex items-start gap-2 flex-col">
                  <h4 className="text-lg font-bold dark:text-navy-700 text-white">General</h4>

                  <div className="h-50 flex w-auto gap-1 justify-center">
                    <div className="h-50 flex w-auto flex-col justify-center">
                      <p className="font-dm text-[12px] font-medium text-gray-600">Campo</p>
                      <h4 className="text-sm font-bold dark:text-navy-700 text-white">
                        {initialData && initialData.campo ? initialData.campo : "N/A"}
                      </h4>
                    </div>
                    <div className="h-50 ml-4 flex w-auto flex-col justify-center">
                      <p className="font-dm text-[12px] font-medium text-gray-600">Variedad</p>
                      <h4 className="text-sm font-bold dark:text-navy-700 text-white">
                        {initialData && initialData.variedad ? initialData.variedad : "N/A"}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              <div className="!z-5 relative rounded-[20px] dark:bg-white bg-navy-800 bg-clip-border shadow-3xl shadow-shadow-500 text-white dark:shadow-none dark:text- px-5 py-5">

                <div className="flex items-start gap-2 flex-col">
                  <h4 className="text-lg font-bold dark:text-navy-700 text-white">Fechas</h4>

                  <div className="h-50 flex w-auto gap-1 justify-center">
                    <div className="h-50 flex w-auto flex-col justify-center">
                      <p className="font-dm text-[12px] font-medium text-gray-600">Apertura</p>
                      <h4 className="text-sm font-bold dark:text-navy-700 text-white">
                        {initialData && initialData.apertura
                          ? new Date(initialData.apertura).toLocaleDateString('es-CL')
                          : "N/A"}
                      </h4>
                    </div>
                    <div className="h-50 ml-4 flex w-auto flex-col justify-center">
                      <p className="font-dm text-[12px] font-medium text-gray-600">Cierre</p>
                      <h4 className="text-sm font-bold dark:text-navy-700 text-white">
                        {initialData && initialData.cierre
                          ? new Date(initialData.cierre).toLocaleDateString('es-CL')
                          : "N/A"}
                      </h4>
                    </div>
                  </div>
                </div>

              </div>

              <div className="!z-5 relative rounded-[20px] dark:bg-white bg-navy-800 bg-clip-border shadow-3xl shadow-shadow-500 dark:text-white dark:shadow-none px-5 py-5">

                <div className="flex items-start gap-2 flex-col">
                  <h4 className="text-lg font-bold dark:text-navy-700 text-white">Totalizador</h4>

                  <div className="h-50 flex w-auto gap-1 justify-center">
                    <div className="h-50 flex w-auto flex-col justify-center">
                      <p className="font-dm text-[12px] font-medium text-gray-600">Kilos</p>
                      <h4 className="text-sm font-bold dark:text-navy-700 text-white">
                        {initialData && initialData.total_kilos_lote ? initialData.total_kilos_lote + 'kg' : "N/A"}
                      </h4>
                    </div>

                  </div>
                </div>

              </div>

            </div>


            <div
              className={`relative flex items-center mt-5 ${title ? "justify-between md:flex-col md:items-start" : "justify-between flex-col md:items-start md:flex-row"
                } `}
            >
              {title && (
                <h4 className="text-xl font-bold text-navy-700 dark:text-white md:hidden">
                  {title}
                </h4>
              )}

              <div className="buttonsActions mb-3 flex gap-2 w-full flex-col md:w-auto md:flex-row md:gap-5">
                {Array.isArray(initialData) &&
                  initialData.length > 0 &&
                  downloadBtn && (
                    <button
                      type="button"
                      onClick={() => handlerDownloadExcel(filterTotal ? "reporte_produccion_total" : "reporte_produccion", "Reporte Producción")}
                      className="w-full md:max-w-[300px] max-w-full linear mt-2 md:w-fit px-5 rounded-xl bg-green-600 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-green-900 dark:text-white items-center justify-center flex gap-2 normal-case !flex-1"
                    >
                      <ArrowDownTrayIcon className="w-5 h-5" />
                      Exportar a Excel
                    </button>
                  )}
              </div>
            </div>
            <div className="h-full overflow-x-scroll max-h-dvh">
              <table
                role="table"
                className="mt-8 h-max w-full"
                variant="simple"
                color="gray-500"
                mb="24px"
                id="reporteProduccion"
              >
                {initialData?.cosecheros && Array.isArray(initialData.cosecheros) && (
                  <thead>
                    <tr role="row">
                      <th className="border-b border-gray-200 px-5 pb-[10px] text-start dark:!border-navy-700">
                        <p className="text-xs tracking-wide text-gray-600">RUT</p>
                      </th>
                      <th className="border-b border-gray-200 px-5 pb-[10px] text-start dark:!border-navy-700">
                        <p className="text-xs tracking-wide text-gray-600">Nombre</p>
                      </th>
                      <th className="border-b border-gray-200 px-5 pb-[10px] text-start dark:!border-navy-700">
                        <p className="text-xs tracking-wide text-gray-600">Kilos</p>
                      </th>
                    </tr>
                  </thead>
                )}

                <tbody role="rowgroup">
                  {initialData?.cosecheros && Array.isArray(initialData.cosecheros) && initialData.cosecheros.length > 0 ? (
                    currentItems.map((row, index) => (
                      <tr key={index} role="row">
                        <td
                          role="cell"
                          className={`pt-[14px] pb-3 text-[14px] px-5 min-w-[150px] ${index % 2 !== 0 ? "bg-lightPrimary dark:bg-navy-900" : ""
                            }`}
                        >
                          <div className="text-base font-medium text-navy-700 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis">
                            {row.rut}
                          </div>
                        </td>
                        <td
                          role="cell"
                          className={`pt-[14px] pb-3 text-[14px] px-5 min-w-[150px] ${index % 2 !== 0 ? "bg-lightPrimary dark:bg-navy-900" : ""
                            }`}
                        >
                          <div className="text-base font-medium text-navy-700 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis">
                            {[row.nombre, row.apellido, row.apellido2].filter(Boolean).join(' ')}
                          </div>
                        </td>
                        <td
                          role="cell"
                          className={`pt-[14px] pb-3 text-[14px] px-5 min-w-[150px] ${index % 2 !== 0 ? "bg-lightPrimary dark:bg-navy-900" : ""
                            }`}
                        >
                          <div className="text-base font-medium text-navy-700 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis">
                            {row.kilos}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-4 text-center text-gray-500" colSpan={3}>
                        {initialData?.cosecheros === undefined
                          ? "Cargando datos..."
                          : "No hay cosecheros registrados."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {cosecheros.length > itemsPerPage && (
              <div className="flex flex-col md:flex-row items-center justify-between mt-5">
                <div className="flex items-center gap-2 mt-5 md:gap-5 md:mt-0">
                  <p className="text-sm text-gray-800 dark:text-white">
                    Mostrando {indexOfFirstItem + 1} a{" "}
                    {indexOfLastItem > cosecheros.length
                      ? cosecheros.length
                      : indexOfLastItem}{" "}
                    de {cosecheros.length} registros
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-5 md:gap-5 md:mt-0">
                  {/* Botón de página anterior */}
                  <button
                    type="button"
                    className={`p-1 bg-gray-200 dark:bg-navy-900 rounded-md ${currentPage === 1 && "hidden"
                      }`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>

                  {/* Números de página resumidos */}
                  {pagination.map((page) => {
                    const pagesToShow = 5; // Número de páginas a mostrar alrededor de la página actual
                    const isStart = page <= pagesToShow;
                    const isEnd = page > totalPages - pagesToShow;
                    const isAroundCurrent = Math.abs(page - currentPage) <= 2;

                    if (isStart || isEnd || isAroundCurrent) {
                      return (
                        <button
                          key={page}
                          type="button"
                          className={`${currentPage === page
                            ? "font-semibold text-navy-500 dark:text-navy-300"
                            : ""
                            }`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      (page === currentPage - 3 && currentPage > pagesToShow) ||
                      (page === currentPage + 3 && currentPage < totalPages - pagesToShow)
                    ) {
                      return <span key={page}>...</span>; // Mostrar puntos suspensivos
                    }
                    return null;
                  })}

                  {/* Botón de página siguiente */}
                  <button
                    type="button"
                    className="p-1 bg-gray-200 dark:bg-navy-900 rounded-md"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : notFound ? (
          <p className="text-center text-gray-500 mt-5">No se encontró ningún lote con ese código.</p>
        ) : null
      )}
    </>
  );
};

export default CardTableFilterBatch;
