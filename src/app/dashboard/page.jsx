'use client'

import { useState, useEffect } from "react";
import { NextResponse } from "next/server";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import Link from "next/link";

import CardTable from "@/components/card/cardTableResume";
import Title from "@/components/title/Title";
import Button from "@/components/button/Button";
import CheckVariables  from "@/components/checksVariables/ChecksVariables";




// Icons
import { DocumentIcon, ArrowPathIcon, SunIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

//Datas
import { groupedTableDataVariedad, tableDataRegularizacion, tableDataTemporada } from "../data/tableData";


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

const HomePage = () => {

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
                <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full h-full p-3">
                  <div className="mt-2 mb-8 w-full">
                    <h2 className="px-2 text-[25px] font-bold text-navy-700 dark:text-white">Reporte Diario / {fechaFormateada}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 mt-10">
                      <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full h-full p-4">
                        <div className="h-full overflow-x-scroll xl:overflow-x-hidden">
                          {/* Data temporada resumen */}
                          <CardTable
                            data={tableDataTemporada}
                            omitirColumns={['id']}
                          />
                        </div>
                        <div className="mt-[25px] mb-7 h-px bg-gray-300 dark:bg-white/30 w-full"></div>

                        <div className="grid grid-cols-2 gap-4 px-2">
                          <Button
                            children="Descargar reporte"
                            icon={<DocumentIcon className="h-6 w-6" />}
                            onClick={() => console.log("Descargar reporte")}
                          />

                          <Button
                            children="Actualizar valores"
                            icon={<ArrowPathIcon className="h-6 w-6" />}
                            onClick={() => console.log("Actualizar valores")}
                          />

                          <Button
                            children="Checkeo diario"
                            icon={<CheckCircleIcon className="h-6 w-6" />}
                            onClick={() => console.log("Checkeo diario")}
                          />

                          <Button
                            children="Checkeo diario"
                            icon={<SunIcon className="h-6 w-6" />}
                            onClick={() => console.log("Checkeo diario")}
                          />

                        </div>

                      </div>

                      <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full h-full p-4">

                        <div className="relative flex items-center justify-between">
                          <h4 className="text-xl font-bold text-navy-700 dark:text-white">Regularización</h4>
                        </div>
                        <div className="h-full overflow-x-scroll xl:overflow-x-hidden">
                          {/* Data regularización */}
                          <CardTable
                            data={tableDataRegularizacion}
                            omitirColumns={['id']}
                          />

                        </div>

                      </div>


                    </div>
                  </div>
                </div>


                <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full h-full p-3">
                <CheckVariables />

                  <div className="mt-[25px] mb-7 h-px bg-gray-300 dark:bg-white/30 w-full"></div>

                  <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full h-full p-4">

                    <div className="relative flex items-center justify-between">
                      <Title type="h4" classes="text-navy-700 dark:text-white font-bold" text="Kilos variedad día" />
                    </div>

                    {/* Data resumen */}
                    <CardTable
                      data={groupedTableDataVariedad}
                      thead="Variedad, Día, Acumulado, Proyectado, Variable"
                      columnsClasses={['text-left', 'text-right', 'text-right', 'text-right', 'text-right']}
                    />
                    {/* Data resumen */}

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

export default HomePage