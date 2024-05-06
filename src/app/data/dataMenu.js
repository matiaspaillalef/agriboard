import { HomeModernIcon, Cog8ToothIcon, TableCellsIcon, UserGroupIcon, DocumentChartBarIcon, ArrowLeftStartOnRectangleIcon, ChevronDownIcon }  from '@heroicons/react/24/outline';


export const primaryMenu = [
    {
        id: 1,
        name: 'Inicio',
        url: '/dashboard',
        icon: HomeModernIcon,
        role: ['superadmin', 'admin', 'user']
    },
    {
        id: 2,
        name: 'Configuración',
        url: '/dashboard/enviroment',
        children: [
            {
                id: 1,
                name: 'Empresa',
                url: '/dashboard/enviroment/company'
            },
            {
                id: 2,
                name: 'Creación de roles',
                url: '/dashboard/enviroment/role-creation'
            },
            {
                id: 3,
                name: 'Creación de usuarios',
                url: '/dashboard/enviroment/user-creation'
            },
            {
                id: 4,
                name: 'Creación de menú',
                url: '/dashboard/enviroment/menu-creation'
            },
        ],
        icon: Cog8ToothIcon,
    },
    {
        id: 3,
        name: 'Producción',
        url: '/dashboard/production',
        children: [
            {
                id: 1,
                name: 'Campo',
                url: '/dashboard/production/ground'
            },
            {
                id: 2,
                name: 'Sectors / Cuarteles',
                url: '/dashboard/production/sectors-barracks'
            },
            {
                id: 3,
                name: 'Atributos de sector',
                url: '/dashboard/production/sector attributes'
            },
            {
                id: 4,
                name: 'Especies',
                url: '/dashboard/production/species'
            },
            {
                id: 5,
                name: 'Variedades',
                url: '/dashboard/production/varieties'
            },
            {
                id: 6,
                name: 'Ciclos',
                url: '/dashboard/production/cycles'
            },
            {
                id: 7,
                name: 'Lotes',
                url: '/dashboard/production/lots'
            },
            {
                id: 8,
                name: 'Plantaciones',
                url: '/dashboard/production/plantations'
            },
            {
                id: 9,
                name: 'Cosechas',
                url: '/dashboard/production/harvests'
            },
            {
                id: 10,
                name: 'Inventario',
                url: '/dashboard/production/inventory'
            }
        ],
        icon: TableCellsIcon,
    },
    {
        id: 4,
        name: 'Gestión de personas',
        url: '/dashboard/people-management',
        icon: UserGroupIcon,
    },
    {
        id: 5,
        name: 'Reportes',
        url: '/dashboard/reports',
        icon: DocumentChartBarIcon,
    },
]