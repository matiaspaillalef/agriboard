'use client'

import React from "react";
import dynamic from "next/dynamic";

import { useState, useEffect } from "react";

const DynamicChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const PieChart = (props) => {
  const { series, options, data, title } = props;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <div role="status" className="max-w-full animate-pulse p-0">
          <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none p-6">
            <div className={`h-[22px] dark:bg-gray-200 bg-gray-400 w-1/2 rounded-sm pb-[10px] mb-5`}></div>
            <div className="mb-auto flex h-[220px] w-full items-center justify-center">
              <div className={`h-[180px] dark:bg-gray-200 bg-gray-400 w-[180px] rounded-full pb-[10px] mb-5`}></div>
            </div>
            {data && (
              <div className="flex flex-row !justify-between flex-wrap gap-1 rounded-2xl px-6 py-3 shadow-2xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
                {data.map((item, index) => (
                  <div key={index} className={`h-[50px] dark:bg-gray-200 bg-gray-400 w-1/5 rounded-sm pb-[10px] mb-5`}></div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none p-6">
          {title && <h4 className="text-xl font-bold text-navy-700 dark:text-white text-left mb-5">{title}</h4>}
          <div className="mb-auto flex h-[220px] w-full items-center justify-center">
            <DynamicChart
              options={options}
              type="pie"
              width="100%"
              height="100%"
              series={series}
            />
          </div>
          {data && (
            <div className="flex flex-row !justify-between flex-wrap gap-2 rounded-2xl px-6 py-3 shadow-2xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
              {data.map((item, index) => (
                <React.Fragment key={index}>
                  <div className="flex flex-col items-center justify-center">
                    <div className={`h-2 w-2 rounded-full bg-[${options.colors[index]}]`} />
                    <p className="ml-1 text-sm font-normal text-gray-600">{options.labels[index]}</p>
                    <p className="mt-px text-xl font-bold text-navy-700 dark:text-white">{item}%</p>
                  </div>
                  {index !== data.length - 1 && <div className="h-11 w-px bg-gray-300 dark:bg-white/10" />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PieChart;
