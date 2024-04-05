import { CalendarDaysIcon, ChartBarIcon, UserIcon, UsersIcon  } from '@heroicons/react/24/outline';

export const dataMiniCardDashboard = [
    {
        id: 1,
        name: 'Período',
        data: [
            {
                id: 1,
                name: 'Fecha',
                value: '27-02-2014'
            },
            {
                id: 2,
                name: 'Semana',
                value: 20
            }
        ],
        icon: CalendarDaysIcon,
        featured: true
    },
    {
        id: 2,
        name: 'Total kilos día',
        data: [
            {
                id: 1,
                name: 'Fresco',
                value: 8080.2
            },
            {
                id: 2,
                name: 'IQF',
                value: 8080.2
            }
        ],
        icon: ChartBarIcon,
        featured: false
    },
    {
        id: 3,
        name: 'Kilos temporada',
        data: [
            {
                id: 1,
                name: 'Fresco',
                value: 137356.4
            },
            {
                id: 2,
                name: 'IQF',
                value: 137356.4
            }
        ],
        icon: ChartBarIcon,
        featured: false
    },
    {
        id: 4,
        name: 'N° Cosecheros',
        data: [
            {
                id: 1,
                name: 'Total',
                value: 184
            },
            {
                id: 2,
                name: 'Semana',
                value: 20
            }
        ],
        icon: UsersIcon,
        featured: false
    }
]