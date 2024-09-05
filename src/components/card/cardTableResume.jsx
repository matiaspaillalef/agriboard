"use client";

import { useState, useEffect } from "react";
import { formatNumber } from "@/functions/functions";

const CardTable = ({
  data,
  thead,
  columnsClasses = [],
  omitirColumns = [],
  title,
}) => {
  const [loading, setLoading] = useState(true);

  // Extraer etiquetas de columna de thead
  const columnLabels = thead
    ? thead.split(",").map((label) => label.trim())
    : [];

  // Simulación de carga de datos
  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
    };

    fetchData();
  }, []);

  // Función para determinar si los datos son válidos
  const isDataValid = Array.isArray(data) && data.length > 0;

  return (
    <div>
      {loading ? (
        <div role="status" className="max-w-full animate-pulse p-0">
          {/* Titulo de carga */}
          <div
            className={`h-[22px] dark:bg-gray-200 bg-gray-400 w-1/2 rounded-sm pb-[10px] mb-5`}
          ></div>

          {/* Mapeamos la props del thead */}
          {columnLabels.length > 0 && (
            <div className="flex gap-3 mb-2">
              {columnLabels.map((label, index) => {
                if (omitirColumns.includes(label)) {
                  return null; // Omitir la columna si está en omitirColumns
                }

                const widthClass =
                  columnLabels.length > 6
                    ? `w-${columnLabels.length}/12`
                    : `w-1/2`;

                return (
                  <div
                    className={`h-[17px] dark:bg-gray-200 bg-gray-400 ${widthClass} rounded-sm pb-[10px]`}
                    key={index}
                  ></div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <>
          {title && (
            <div className="relative flex items-center justify-between">
              <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                {title}
              </h4>
            </div>
          )}
          <div className="h-full overflow-x-scroll">
            <table
              role="table"
              className="mt-8 h-max w-full"
              variant="simple"
              color="gray-500"
              mb="24px"
            >
              {/* Renderizar encabezados */}
              {columnLabels.length > 0 && (
                <thead>
                  <tr role="row">
                    {columnLabels.map((label, index) => {
                      if (omitirColumns.includes(label)) {
                        return null; // Omitir la columna si está en omitirColumns
                      }
                      return (
                        <th
                          key={index}
                          colSpan={1}
                          role="columnheader"
                          className="border-b border-gray-200 px-5 pb-[10px] text-start dark:!border-navy-700"
                        >
                          <p
                            className={`text-xs tracking-wide text-gray-600 ${
                              columnsClasses[index] || "text-start"
                            }`}
                          >
                            {label}
                          </p>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
              )}
              <tbody role="rowgroup">
                {!isDataValid ? (
                  <tr>
                    <td
                      colSpan={columnLabels.length}
                      className="text-center py-4"
                    >
                      <p className="text-gray-500">
                        No hay datos disponibles para hoy.
                      </p>
                    </td>
                  </tr>
                ) : (
                  data.map((row, index) => (
                    <tr key={index} role="row">
                      {Object.keys(row).map((key, rowIndex) => {
                        if (omitirColumns.includes(key)) {
                          return null; // Omitir la columna si está en omitirColumns
                        }
                        return (
                          <td
                            key={rowIndex}
                            role="cell"
                            className={`pt-[14px] pb-3 text-[14px] px-5 ${
                              index % 2 !== 0
                                ? "bg-lightPrimary dark:bg-navy-900"
                                : ""
                            } ${columnsClasses[rowIndex] || "text-left"}`}
                          >
                            <p className="text-base font-medium text-navy-700 dark:text-white">
                              {formatNumber(row[key])}
                            </p>
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default CardTable;
