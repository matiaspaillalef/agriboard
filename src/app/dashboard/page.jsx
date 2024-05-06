'use client'

// Importa el componente SpeedInsights Vercel
import { SpeedInsights } from "@vercel/speed-insights/next"

import { useState, useEffect } from "react";
import { NextResponse } from "next/server";
import { useRouter } from "next/navigation";


import Link from "next/link";
import LineChart from "@/components/charts/LineChart";
import PieChart from "@/components/charts/PieChart";
import CardTable from "@/components/card/cardTableResume";
import MiniCard from "@/components/card/MiniCard";

//Datas
import { groupedTableDataVariedad, tableDataDespachos, tableDataRegularizacion, tableDataTemporada } from "../data/tableData";
import { pieChartData, pieChartOptions, lineChartDataTotalSpent, lineChartOptionsTotalSpent } from "../data/dataGraphics";
import { dataMiniCardDashboard } from "../data/dataMiniCard";

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

const dashboard = ({ isLoggedIn }) => {

    const [data, setData] = useState([]);

    return (
        <>
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

                <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
                    <CardTable
                        data={groupedTableDataVariedad}
                        thead="Variedad, Día, Acumulado, Proyectado, Variable"
                        columnsClasses={['text-left', 'text-right', 'text-right', 'text-right', 'text-right']}
                        title="Kilos variedad día"
                    />
                </div>

                <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
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
        </>
    )
}

export default dashboard;