'use client'

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const RegisterPage = () => {

    const { register, handleSubmit, formState:{errors} } = useForm();
    const router = useRouter();

    const onSubmit = handleSubmit(async (data) => {

        if(data.password !== data.confirmPassword){
            return alert('Las contraseñas no coinciden');
        }

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(
                {
                    username: data.username,
                    email: data.email,
                    password: data.password
                }
            ),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if(res.ok){
            router.push("/auth/login");
        }

    });

    //console.log(errors);

    return (
        <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-1/2 h-full p-3">
            <form onSubmit={onSubmit}>

                <label htmlFor="username" className="text-slate-500 mb-2 block text-sm">
                    Nombre
                </label>
                <input
                    type="text"
                    id="username"
                    {...register('username', {
                        required: {
                            value: true,
                            message: 'El nombre es requerido'
                        }
                    })}
                    placeholder="Nombre completo"
                    className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                />
                {errors.username && <span className="text-red-500 text-xs">{errors.username.message}</span>}

                <label htmlFor="email" className="text-slate-500 mb-2 block text-sm">
                    Email <span>*</span>
                </label>
                <input
                    type="email"
                    id="email"
                    {...register('email', {
                        required: {
                            value: true,
                            message: 'El email es requerido'
                        }
                    })}
                    placeholder="tu@email.com"
                    className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                />
                {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}

                <label htmlFor="name" className="text-slate-500 mb-2 block text-sm">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    {...register('password', {
                        required: {
                            value: true,
                            message: 'La contraseña es requerida'
                        }
                    })}
                    placeholder="********"
                    className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                />
                {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}

                <label htmlFor="name" className="text-slate-500 mb-2 block text-sm">
                    Nombre
                </label>
                <input
                    type="confirmPassword"
                    {...register('confirmPassword', {
                        required: {
                            value: true,
                            message: 'La confirmación de la contraseña es requerida'
                        }
                    })}
                    placeholder="********"
                    className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                />
                {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>}

                <button
                    type="submit"
                    className="linear flex items-center justify-center rounded-xl bg-brand-500 px-5 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 gap-2">
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
