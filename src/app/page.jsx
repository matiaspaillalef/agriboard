"use client";

import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Checkbox from "@/components/checkbox";
import FixedPlugin from "@/components/fixedPlugin/FixedPlugin";
import SimpleSlider from "@/components/slide";
import Image from 'next/image';

import { SlideWelcome } from "@/app/data/dataSlide";

import LogoNormal from "@/assets/img/layout/agrisoft_logo_dark.png";
import "@/assets/css/Login.css";

function LoginPage() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter()
  const [error, setError] = useState(null)

  const onSubmit = handleSubmit(async (data) => {

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    console.log(res)
    if (res.error) {
      setError(res.error)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  });

  return (
    <div className="relative float-right h-full min-h-screen w-full !bg-white dark:!bg-navy-900">
      <div className="mx-auto flex min-h-full w-full flex-col justify-start pt-12 md:max-w-[75%] lg:h-screen lg:max-w-[1013px] lg:px-8 lg:pt-0 xl:h-[100vh] xl:max-w-[1383px] xl:px-0 xl:pl-[70px]">
        <div className="mb-auto h-full flex flex-col pl-5 pr-5 md:pr-0 md:pl-12 lg:max-w-[48%] lg:pl-0 xl:max-w-full">

          <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
            <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
              <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
                Inicar Sesión
              </h4>
              <p className="mb-9 ml-1 text-base text-gray-600"> Ingresa tu email y password para ingresar.</p>
              <form onSubmit={onSubmit} className="w-full">

                {error && (
                  <p className="bg-red-500 text-lg text-white p-3 rounded mb-2">{error}</p>
                )}

                <div className="mb-3">
                  <label htmlFor="email" className="text-sm text-navy-700 dark:text-white ml-1.5 font-medium">
                    Email:
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: {
                        value: true,
                        message: "Email is required",
                      },
                    })}
                    className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    placeholder="user@email.com"
                  />
                  {errors.email && (
                    <span className="text-red-500 text-xs">{errors.email.message}</span>
                  )}

                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="text-sm text-navy-700 dark:text-white ml-1.5 font-medium">
                    Password:
                  </label>
                  <input
                    type="password"
                    {...register("password", {
                      required: {
                        value: true,
                        message: "Password is required",
                      },
                    })}
                    className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    placeholder="******"
                  />

                  {errors.password && (
                    <span className="text-red-500 text-xs">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                <div className="mb-4 flex items-center justify-between px-2">
                  <div className="flex items-center">
                    <Checkbox />
                    <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                      Recordarme
                    </p>
                  </div>
                  <a
                    className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
                    href=" "
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>


                <button className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                  Login
                </button>

              </form>

            </div>
          </div>

          <div className="z-[5] mx-auto flex w-full max-w-screen-sm flex-col items-center justify-between px-[20px] pb-4 lg:mb-6 lg:max-w-[100%] lg:flex-row xl:mb-2 xl:w-[1310px] xl:pb-6">
            <p className="mb-6 text-center text-sm text-gray-600 md:text-base lg:mb-0">
              ©{1900 + new Date().getYear()} Agrisoft. Todos los derechos Reservados.
            </p>
          </div>

          {/*<div className="absolute right-0 hidden h-full min-h-screen md:block lg:w-[49vw] 2xl:w-[44vw]">
            <div className="absolute flex h-full w-full items-end justify-center bg-cover bg-center lg:rounded-bl-[120px] xl:rounded-bl-[200px]" style={{ backgroundImage: 'url(https://horizon-ui.com/horizon-tailwind-react/static/media/auth.20d5979b439e1531640d.png)' }}></div>
                </div>*/}

          <div className="absolute right-0 hidden h-dvh min-h-screen md:block lg:w-[49vw] 2xl:w-[44vw]">
            <div className="relative h-full w-full lg:rounded-bl-[120px] xl:rounded-bl-[200px] overflow-hidden">

              <SimpleSlider
                slides={SlideWelcome}
                slidesToShow={1}
                dots={false}
                infinite={true}
                autoplay={true}
                speed={500}
                fade={true}
              />
              <Image src={LogoNormal} alt="Agrisoft" width={249} height={241} priority className='object-cover max-h-[241px] min-w-[249px] absolute top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2' />
              <FixedPlugin />
            </div>
          </div>

        </div>


      </div>
    </div>
  );
}
export default LoginPage;