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
                name: 'Control de acceso',
                url: '/dashboard/enviroment/access-control'
            },
            {
                id: 3,
                name: 'Ubicación geográfica',
                url: '/dashboard/enviroment/geographic-location'
            },
            {
                id: 4,
                name: 'Instituciones provisionales',
                url: '/dashboard/enviroment/provisional-institutions'
            },
            {
                id: 5,
                name: 'Creación de roles',
                url: '/dashboard/enviroment/role-creation'
            },
            {
                id: 6,
                name: 'Creación de usuarios',
                url: '/dashboard/enviroment/user-creation'
            },
            {
                id: 7,
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