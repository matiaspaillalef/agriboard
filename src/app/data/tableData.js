const tableDataVariedad = [
    {
        id: 1,
        variedad: 'Arandano - Bright',
        kilos_dia: 25,
        proyeccion: 1500,
        variable: 0.5,
        fecha: '2021-10-01'
    },
    {
        id: 2,
        variedad: 'Arandano - Star',
        kilos_dia: 30,
        proyeccion: 1800,
        variable: 0.5,
        fecha: '2021-10-01'
    },
    {
        id: 3,
        variedad: 'Arandano - Jewel',
        kilos_dia: 20,
        proyeccion: 1200,
        variable: 0.5,
        fecha: '2021-10-01'
    },
    {
        id: 4,
        variedad: 'Arandano - Bright',
        kilos_dia: 25,
        proyeccion: 1500,
        variable: 0.5,
        fecha: '2021-10-02'
    },
    {
        id: 5,
        variedad: 'Arandano - Star',
        kilos_dia: 30,
        proyeccion: 1800,
        variable: 0.5,
        fecha: '2021-10-02'
    },
    {
        id: 6,
        variedad: 'Arandano - Jewel',
        kilos_dia: 20,
        proyeccion: 1200,
        variable: 0.5,
        fecha: '2021-10-02'
    },
    {
        id: 7,
        variedad: 'Arandano - Bright',
        kilos_dia: 25,
        proyeccion: 1500,
        variable: 0.5,
        fecha: '2021-10-03'
    },
    {
        id: 8,
        variedad: 'Arandano - Star',
        kilos_dia: 30,
        proyeccion: 1800,
        variable: 0.5,
        fecha: '2021-10-03'
    },
    {
        id: 9,
        variedad: 'Arandano - Jewel',
        kilos_dia: 20,
        proyeccion: 1200,
        variable: 0.5,
        fecha: '2021-10-03'
    },
    {
        id: 10,
        variedad: 'Arandano - Bright',
        kilos_dia: 25,
        proyeccion: 150,
        variable: 0.5,
        fecha: '2021-10-04'
    },
];


// Agrupa los datos por variedad y suma los valores correspondientes
export const groupedTableDataVariedad = tableDataVariedad.reduce((acc, item) => {
    const existingItem = acc.find((group) => group.variedad === item.variedad);

    if (existingItem) {
        // Si la variedad ya existe, suma los valores
        //existingItem.kilos_dia += item.kilos_dia;
        existingItem.acumulado += item.kilos_dia;
        existingItem.proyeccion += item.proyeccion;
        existingItem.variable += item.variable;
    } else {
        // Si la variedad no existe, agrega un nuevo grupo con las propiedades necesarias
        acc.push({
            variedad: item.variedad,
            acumulado: item.kilos_dia,
            kilos_dia: item.kilos_dia,
            proyeccion: item.proyeccion,
            variable: item.variable,
        });
    }

    return acc;
}, []);

export const tableDataRegularizacion = [
    {
        id: 1,
        tipo: 'Registro de personal a regularizar',
        total: 2,
    },
    {
        id: 2,
        tipo: 'Sectores variedades no finalizadas',
        total: 1,
    },
    {
        id: 3,
        tipo: 'Menos de 7 días para rotación',
        total: 1,
    },
];

export const tableDataTemporada = [
    {
        id: 1,
        tipo: 'Semana temporada',
        total: 50,
    },
    {
        id: 2,
        tipo: 'Días temporada',
        total: 348,
    },
];


export const tableDataDespachos =[
    {
        id: 1,
        guia: 90001,
        exportadora: 'Exportadora 1',
        cajas: 500,
        kilos: 10000,
        condicion: 'Exp M',
    },
    {
        id: 2,
        guia: 90002,
        exportadora: 'Exportadora 2',
        cajas: 600,
        kilos: 12000,
        condicion: 'Exp M',
    },
    {
        id: 3,
        guia: 90003,
        exportadora: 'Exportadora 3',
        cajas: 700,
        kilos: 14000,
        condicion: 'Exp M',
    },
    {
        id: 4,
        guia: 90004,
        exportadora: 'Exportadora 4',
        cajas: 800,
        kilos: 16000,
        condicion: 'Exp M',
    }
]

