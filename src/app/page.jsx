'use client'

import { useRouter } from "next/navigation"

export default function Dashboard() {
    const router = useRouter();

    return router.push('/auth/login');

    //Si esta logeado lo mandamos a router.push('/dashboard')
}