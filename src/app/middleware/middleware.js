"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function withAuth(Component) {
    return function AuthenticatedComponent(props) {
        const [loading, setLoading] = useState(true);
        const [darkMode, setDarkMode] = useState(false); // Inicialmente falso
        const router = useRouter();

        useEffect(() => {
            // Verifica la preferencia del navegador para el modo oscuro
            const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

            // Lee la preferencia del modo oscuro guardada en sessionStorage
            const storedDarkMode = sessionStorage.getItem('darkmode');

            // Define el estado de darkMode basado en el valor guardado o la preferencia del navegador
            const isDarkMode = storedDarkMode !== null ? JSON.parse(storedDarkMode) : prefersDarkMode;
            setDarkMode(isDarkMode);

            // Aplica la clase al body según el estado del modo oscuro
            if (isDarkMode) {
                document.body.classList.add("dark");
            } else {
                document.body.classList.remove("dark");
            }

            // Verifica si el usuario está logueado
            const isLoggedIn = sessionStorage.getItem('isLoggedIn');

            if (!isLoggedIn) {
                router.push('/');

                const timeout = setTimeout(() => {
                    setLoading(false);
                }, 2000);

                return () => clearTimeout(timeout);
            } else {
                const timeout = setTimeout(() => {
                    setLoading(false);
                }, 1000);

                return () => clearTimeout(timeout);
            }
        }, [router]);

        return loading ? (
            <div className={`loader-content ${darkMode ? 'bg-navy-900' : 'bg-white'}`}>
                <div className='inner_loader'>
                    <Image src={darkMode ? '/agrisoft_logo_b.webp' : '/agrisoft_logo.webp'} alt='loader' width={150} height={100} className='loader-logo animate-pulse'/>
                </div>
            </div>
        ) : (
            <Component {...props} />
        );
    };
}
