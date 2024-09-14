'use client'

import React from "react";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const DynamicChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LineChart = ({ data, title }) => {
  const { humedad = [], temperatura = [], fechas = [] } = data || {};

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula un retraso para la carga
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false);
    };

    fetchData();
  }, [data]); // Dependencia en data para refrescar el componente cuando cambia

  // Configuración de opciones para el gráfico
  const options = {
    legend: { show: false },
    theme: { mode: "light" },
    chart: { type: "line", height: 800, toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    tooltip: {
      style: { fontSize: "12px", backgroundColor: "#000000" },
      theme: 'dark',
      x: { format: "dd/MM/yy" },
    },
    grid: { show: true },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#A3AED0", fontSize: "12px", fontWeight: "500" },
      },
      categories: fechas || [],
    },
    yaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#A3AED0", fontSize: "12px", fontWeight: "500" },
        offsetY: 0,
        formatter: (value) => {
          //return value.toFixed(2);
          return `${value.toFixed(1)}°`;
        },
      },
      type: "numeric",
    },
  };

  const series = [
    {
      name: "Humedad",
      data: humedad || [],
      color: "#4fd273",
    },
    {
      name: "Temperatura",
      data: temperatura || [],
      color: "#0d489b",
    }
  ];

  return (
    <>
      {loading ? (
        <div role="status" className="max-w-full animate-pulse p-0">
          <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none !p-[20px] text-center h-full">
            <div className={`h-[22px] dark:bg-gray-200 bg-gray-400 w-1/2 rounded-sm pb-[10px] mb-5`}></div>
            <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden gap-5">
              <div className="flex flex-col">
                <div className="flex items-start justify-start flex-col gap-2">
                  {series.map((item, index) => (
                    <div key={index} className={`h-[22px] dark:bg-gray-200 bg-gray-400 w-[100px] rounded-sm pb-[10px] mb-1`}></div>
                  ))}
                </div>
              </div>
              <div className="h-full w-full">
                <div className={`h-[320px] dark:bg-gray-200 bg-gray-400 w-full rounded-sm pb-[10px] mb-1`}></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none !p-[20px] text-center h-full">
          {title && <h4 className="text-xl font-bold text-navy-700 dark:text-white text-left mb-5">{title}</h4>}
          <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
            <div className="flex flex-col">
              <div className="flex items-start justify-start flex-col gap-2">
                {series.map((item, index) => (
                  <span
                  key={index}
                  style={{ backgroundColor: item.color, color: index === 0 ? '#navy-900' : '#ffffff' }}
                  className="py-1 px-3 rounded-[5px] text-sm"
                >
                  {item.name}
                </span>
                ))}
              </div>
            </div>
            <div className="h-full w-full">
              <DynamicChart
                options={options}
                type="line"
                width="100%"
                height="250px"
                series={series}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LineChart;
