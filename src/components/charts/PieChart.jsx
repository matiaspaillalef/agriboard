'use client';

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import SimpleSlider from "@/components/slide"; // Asegúrate de que el path sea correcto

const DynamicChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const PieChart = ({ data, title }) => {
  const [loading, setLoading] = useState(true);
  const [chartsData, setChartsData] = useState([]);

  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({
    labels: [],
    colors: [
      "#4fd272", "#1b3bbb", "#4318ff", "#6ad2ff",
      "#9be59f", "#2a2a8b", "#6c2ae5", "#8dd5ff",
      "#b9f1c7", "#4a2a6f"
    ],
    chart: {
      width: "50px",
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    hover: { mode: null },
    plotOptions: {
      donut: {
        expandOnClick: false,
        donut: {
          labels: {
            show: true,
          },
        },
      },
    },
    fill: {
      colors: [
        "#4fd272", "#1b3bbb", "#4318ff", "#6ad2ff",
        "#9be59f", "#2a2a8b", "#6c2ae5", "#8dd5ff",
        "#b9f1c7", "#4a2a6f"
      ],
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      style: {
        fontSize: "12px",
        backgroundColor: "#000000"
      },
    },
  });

  useEffect(() => {
    if (data && data.length > 0) {

      const newSeries = data.map(item => item.percentage);
      const newLabels = data.map(item => item.variety);
      // Agrupar los datos por especie
      const groupedData = data.reduce((acc, item) => {
        if (!acc[item.especie]) {
          acc[item.especie] = [];
        }
        acc[item.especie].push(item);
        return acc;
      }, {});

      // Transformar los datos agrupados para los gráficos
      const charts = Object.keys(groupedData).map((especie) => {
        const especiesData = groupedData[especie];
        const series = especiesData.map(item => item.cantidad);
        const labels = especiesData.map(item => item.variety);

        return {
          title: title + ' | ' + especie,
          series,
          labels,
        };
      });

      // Actualizar estado con los datos agrupados
      setChartsData(charts);
      setLoading(false);

      // Update state with new data
      setSeries(newSeries);
      setOptions(prevOptions => ({
        ...prevOptions,
        labels: newLabels,
      }));


    } else {
      setChartsData([]);
      setLoading(false);

      setSeries([]);
      setOptions(prevOptions => ({
        ...prevOptions,
        labels: [],
      }));
    }
  }, [data]);

  // Crear un arreglo de slides con los gráficos
  const slides = chartsData.map((chart, index) => (
    <div key={index} className="mb-6">
      <h4 className="text-xl font-bold text-navy-700 dark:text-white text-left mb-5">
        {chart.title}
      </h4>
      <div className="mb-auto flex h-[220px] w-full items-center justify-center">
        <DynamicChart
          options={options}
          type="pie"
          width="100%"
          height="100%"
          series={chart.series}
        />
      </div>
      <div className="flex flex-row !justify-between flex-wrap gap-2 rounded-2xl px-6 py-3 dark:!bg-navy-700 dark:shadow-none">
        {chart.series.map((item, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center justify-center">
              <div className={`h-2 w-2 rounded-full bg-[${options.colors[index]}]`} />
              <p className="ml-1 text-sm font-normal text-gray-600">{options.labels[index]}</p>
              <p className="mt-px text-xl font-bold text-navy-700 dark:text-white">{Math.round(item)}%</p>
            </div>
            {index !== chart.series.length - 1 && <div className="h-11 w-px bg-gray-300 dark:bg-white/10" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  ));

  return (
    <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none p-6">
      {loading ? (
        <div role="status" className="max-w-full animate-pulse p-0">
          <div className={`h-[22px] dark:bg-gray-200 bg-gray-400 w-1/2 rounded-sm pb-[10px] mb-5`}></div>
          <div className="mb-auto flex h-[220px] w-full items-center justify-center">
            <div className={`h-[180px] dark:bg-gray-200 bg-gray-400 w-[180px] rounded-full pb-[10px] mb-5`}></div>
          </div>
        </div>
      ) : (
        <>
          {chartsData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[220px] w-full text-center text-gray-600 dark:text-white">
              <p className="text-xl font-semibold">No hay datos disponibles</p>
            </div>
          ) : (
            <SimpleSlider
              slides={slides}  // Pasamos los gráficos de pastel como slides
              slidesToShow={1}
              dots={true}
              infinite={true}
              autoplay={true}
              speed={500}
              fade={true}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PieChart;
