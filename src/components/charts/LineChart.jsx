'use client'

import React from "react";
import dynamic from "next/dynamic";

import { useState, useEffect } from "react";

const DynamicChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LineChart = (props) => {
  const { series, options, title } = props;

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
                  <span key={index} className={`bg-[${item.color}] py-1 px-3 rounded-[5px] text-${index === 0 ? 'navy-900' : 'white'} text-sm`}>
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
                series={series.map((item, index) => ({ ...item, name: undefined }))}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LineChart;
