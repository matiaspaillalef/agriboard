import { HomeModernIcon, Cog8ToothIcon, TableCellsIcon, UserGroupIcon, DocumentChartBarIcon, ArrowLeftStartOnRectangleIcon, ChevronDownIcon }  from '@heroicons/react/24/outline';


export const primaryMenu = [
    {
        id: 1,
        name: 'Inicio',
        url: '/',
        icon: HomeModernIcon,
    },
    {
        id: 2,
        name: 'Configuración',
        url: '/settings',
        children: [
            {
                id: 1,
                name: 'Empresa',
                url: '/settings/company'
            },
            {
                id: 2,
                name: 'Control de acceso',
                url: '/settings/access-control'
            },
            {
                id: 3,
                name: 'Ubicación geográfica',
                url: '/settings/geographic-location'
            },
            {
                id: 4,
                name: 'Instituciones provisionales',
                url: '/settings/provisional-institutions'
            }
        ],
        icon: Cog8ToothIcon,
    },
    {
        id: 3,
        name: 'Producción',
        url: '/production',
        icon: TableCellsIcon,
    },
    {
        id: 4,
        name: 'Gestión de personas',
        url: '/people-management',
        icon: UserGroupIcon,
    },
    {
        id: 5,
        name: 'Reportes',
        url: '/reports',
        icon: DocumentChartBarIcon,
    },
    {
        id: 6,
        name: 'Salir',
        url: '/logout',
        icon: ArrowLeftStartOnRectangleIcon,
    },
]