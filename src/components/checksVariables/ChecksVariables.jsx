'use cient'

import React, { useState, useEffect } from 'react';

import { formatNumber } from '@/functions/functions';

import { dataCheck } from '@/app/data/dataCheck';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

function CheckVariables() {
    const [opciones, setOpciones] = useState(dataCheck);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setLoading(false);
        };

        fetchData();
    }, []);

    const opcionesVisibles = opciones.filter(opcion => opcion.visible);
    const numColumnas = opcionesVisibles.length <= 5 ? opcionesVisibles.length : 5;

    const toggleVisibilidad = (id) => {
        setOpciones(opciones.map(opcion => {
            if (opcion.id === id) {
                return { ...opcion, visible: !opcion.visible };
            }
            return opcion;
        }));
    };

    const toggleMenu = () => {
        setVisible(!visible);
    };

    return (
        <div>
            <div className="flex items-center cursor-pointer mb-4 linea justify-center rounded-xl bg-brand-500 px-5 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 gap-2 w-fit" onClick={toggleMenu}>
                {visible ? (
                    <div className="flex items-center cursor-pointer gap-2" onClick={toggleMenu}>
                        <AdjustmentsHorizontalIcon className='w-6 h-6 dark:text-white' />
                        Ocultar filtro
                    </div>
                ) : (
                    <div className="flex items-center cursor-pointer gap-2" onClick={toggleMenu}>
                        <AdjustmentsHorizontalIcon className='w-6 h-6 dark:text-white' />
                        Mostrar filtro
                    </div>
                )}
            </div>

            {loading ? (
                <div role="status" className="max-w-full animate-pulse my-5 mt-8">
                    <div
                        className={`h-[50px] dark:bg-gray-200 bg-gray-400 w-full rounded-sm pb-[10px]`}
                    >
                    </div>
                </div>
            ) : (
                <>
                    {visible && (
                        <ul className='!z-5 absolute flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-900 dark:text-white dark:shadow-none w-auto h-auto p-4 z-10'>
                            {opciones.map(opcion => (
                                <li key={opcion.id}>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={opcion.visible}
                                            onChange={() => toggleVisibilidad(opcion.id)}
                                            className="form-checkbox h-5 w-5 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                                        />
                                        <span className="ml-2 dark:text-white">{opcion.nombre}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-4 px-2`}>
                        {opciones.map(opcion => (
                            opcion.visible && (
                                <h3 key={opcion.id} className="px-2 text-[16px] font-bold text-navy-700 dark:text-white">
                                    {opcion.nombre}
                                    <span className="block font-normal">{formatNumber(opcion.valor)}</span>
                                </h3>
                            )
                        ))}
                    </div>
                </>


            )}
        </div>
    );

}

export default CheckVariables;
