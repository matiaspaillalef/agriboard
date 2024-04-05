'use client'

import { useState, useEffect } from "react";
import { NextResponse } from "next/server";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import Link from "next/link";
import LineChart from "@/components/charts/LineChart";
import PieChart from "@/components/charts/PieChart";
import CardTable from "@/components/card/cardTableResume";
import MiniCard from "@/components/card/MiniCard";

//Datas
import { groupedTableDataVariedad, tableDataDespachos, tableDataRegularizacion, tableDataTemporada } from "./data/tableData";
import { pieChartData, pieChartOptions, lineChartDataTotalSpent, lineChartOptionsTotalSpent } from "./data/dataGraphics";
import { dataMiniCardDashboard } from "./data/dataMiniCard";

// Obtén la fecha actual
const fechaActual = new Date();

// Configura las opciones de formato para la fecha
const opcionesDeFormato = {
    weekday: 'long', // día de la semana en formato largo (por ejemplo, "lunes")
    day: 'numeric', // día del mes (por ejemplo, 12)
    month: 'long', // mes en formato largo (por ejemplo, "febrero")
    year: 'numeric' // año (por ejemplo, 2024)
};

// Formatea la fecha actual según las opciones de formato
const fechaFormateada = fechaActual.toLocaleDateString('es-ES', opcionesDeFormato);

const dashboard = () => {

    const [data, setData] = useState([]);

    const [open, setOpen] = useState(true);
    const onClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        window.addEventListener("resize", () =>
            window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
        );
    }, [open]);


    return (

        <div className="flex h-full w-full">
            <div className="sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 translate-x-0">
                <Sidebar open={open} onClose={() => setOpen(false)} />
            </div>
            <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
                <main className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[333px]`}>
                    <div className="h-full min-h-dvh">
                        <Navbar onOpenSidenav={() => setOpen(true)} />
                        {/* Body dashboard */}
                        <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
                            <div className="flex w-full flex-col gap-5 mt-3">

                                <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-4">

                                    {dataMiniCardDashboard.map(item => (
                                        <MiniCard
                                            key={item.id}
                                            name={item.name}
                                            icon={item.icon}
                                            data={item.data}
                                            featured={item.featured}
                                        />
                                    ))}

                                </div>

                                <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-2">

                                    <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full h-full p-6">
                                        <CardTable
                                            data={groupedTableDataVariedad}
                                            thead="Variedad, Día, Acumulado, Proyectado, Variable"
                                            columnsClasses={['text-left', 'text-right', 'text-right', 'text-right', 'text-right']}
                                            title="Kilos variedad día"
                                        />
                                    </div>

                                    <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full h-full p-6">
                                        <CardTable
                                            data={tableDataDespachos}
                                            thead="Guía, Exportadora, Cajas, Kilos, Condición"
                                            omitirColumns={['id']}
                                            title="Despachos del día"
                                        />
                                    </div>
                                </div>


                                <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-3">

                                    <div className="lg:col-span-1">
                                        <PieChart
                                            options={pieChartOptions}
                                            series={pieChartData}
                                            data={pieChartData}
                                            title="Variedad temporada"
                                        />
                                    </div>

                                    <div className="lg:col-span-2">

                                        <LineChart
                                            options={lineChartOptionsTotalSpent}
                                            series={lineChartDataTotalSpent}
                                            title="Humedad y temperatura"
                                        />

                                    </div>
                                </div>



                            </div>
                        </div>

                    </div>
                </main>
            </div >
        </div >

    )
}

export default dashboard;