'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { api } from '@/app/api/Conection';
import Image from 'next/image';
import { useAuth } from '@/app/AuthContext';
import { z } from 'zod';
import styles from './LoginForm.module.css';

const loginSchema = z.object({
    username: z.string().email({ message: 'Ingrese un correo electrónico válido' }),
    password: z.string().min(5, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

const LoginForm = () => {

    const [formData, setFormData] = useState({ username: '', password: '' });
    const [formError, setFormError] = useState({});
    const router = useRouter();
    //const { isAuthenticated, login } = useAuth();

    /*if (isAuthenticated) {
        // Si el usuario está autenticado, redirigir a la página de dashboard
        router.replace('/dashboard');
        return null; // Evitar que se renderice el formulario si ya se redirigió
    }*/


    const handleBlur = (field) => {
        try {
            const value = formData[field];
            loginSchema.pick({ [field]: true }).parse({ [field]: value });
            setFormError((prevErrors) => ({ ...prevErrors, [field]: null }));
        } catch (error) {
            if (error instanceof z.ZodError) {
                setFormError((prevErrors) => ({ ...prevErrors, [field]: error.errors[0]?.message }));
            }
        }
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            loginSchema.parse(formData); // Validar datos con Zod

            const data = await api.login(formData.username, formData.password);
            //console.log(data);
            login();
            router.push('/dashboard');
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Errores de validación de Zod
                setFormError(error.errors.reduce((errors, err) => {
                    errors[err.path[0]] = err.message;
                    return errors;
                }, {}));
            } else {
                console.error('Error al conectar con el backend:', error.message);
                setFormError({ message: 'Error desconocido' });
            }
        }
    };
    return (
        <div className={` ${styles.cardForm} flex justify-center items-center bg-white rounded-md shadow-md relative z-50`}>
            <form onSubmit={handleLogin} className="w-full">

                <Image src={'/agrisoft_logo.svg'} alt="Agrisoft" width={200} height={100} className='mx-auto mb-8' />

                <div className="space-y-12">
                    <div className="pb-6">
                        <h2 className="font-bold text-4xl text-center text-slate-900">Acceso al sistema</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">Accede al sistema con tu correo electronico y contraseña.</p>

                        {/** Mostrar errores del formulario */}
                        <p className="bg-red-500 text-sm text-white p-1 rounded my-2">Error</p>

                        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                            <div className="col-span-full">
                                <label htmlFor="email" className="text-slate-500 mb-2 block text-sm">
                                    Correo Electrónico
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        onBlur={() => handleBlur('username')}
                                        type="email"
                                        autoComplete="email"
                                        className="p-3 rounded block mb-2 text-slate-900 w-full"
                                    />
                                    {formError && formError['username'] && (
                                        <span className="text-red-500 text-xs">{formError['username']}</span>
                                    )}

                                </div>
                            </div>
                            <div className="col-span-full">
                                <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">
                                    Contraseña
                                </label>
                                <div className="mt-2">
                                    <input
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        onBlur={() => handleBlur('password')}
                                        type="password"
                                        name="password"
                                        id="password"
                                        className="p-3 rounded block mb-2 text-slate-900 w-full"
                                    />
                                    {formError && formError['password'] && (
                                        <span className="text-red-500 text-xs">{formError['password']}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-0 flex items-center justify-end gap-x-6">

                    <button
                        type="submit"
                        className="relative overflow-hidden w-full h-12 rounded bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-2xl group">
                        Iniciar Sesión
                        <span className="absolute right-0 top-0 bottom-0 left-0 bg-white opacity-10 transition-transform transform translate-x-full duration-1000 group-hover:translate-x-0"></span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
