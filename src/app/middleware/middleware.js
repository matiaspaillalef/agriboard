'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function withAuth(Component) {
    return function AuthenticatedComponent(props) {
        const [loading, setLoading] = useState(true);
        const router = useRouter();

        useEffect(() => {
            const isLoggedIn = sessionStorage.getItem('isLoggedIn');

            if (!isLoggedIn) {
                router.push('/');

                const timeout = setTimeout(() => {
                    setLoading(false);
                }, 2000);

                return () => clearTimeout(timeout);
            } else {
                // Si está logeado y trata de acceder a la ruta principal, redirigir a la página actual
                    router.push('/dashboard');

                const timeout = setTimeout(() => {
                    setLoading(false);
                }, 1000);

                return () => clearTimeout(timeout);
            }
        }, []);


        return loading ? (
            <div className='loader-content'>
                <div className='inner_loader'>
                    <Image src='/agrisoft_logo.webp' alt='loader' width={150} height={100} className='loader-logo'/>
                    <div className="loader mt-3"></div>
                </div>
            </div>
        ) : (
            <Component {...props} />
        );
    };
}
