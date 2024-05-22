"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Checkbox from "@/components/checkbox";
import FixedPlugin from "@/components/fixedPlugin/FixedPlugin";
import SimpleSlider from "@/components/slide";
import Image from "next/image";
import { withAuth } from "./middleware/middleware";

import { SlideWelcome } from "@/app/data/dataSlide";

import LogoNormal from "@/assets/img/layout/agrisoft_logo_dark.png";
import "@/assets/css/Login.css";

import Slide1 from "@/assets/img/slides/slide-avocado.png";
import Slide2 from "@/assets/img/slides/slide-potatos.jpg";
import Slide3 from "@/assets/img/slides/slide-blueberries.jpg";
import Slide4 from "@/assets/img/slides/slide-apple.jpg";

const URLAPI = process.env.NEXT_PUBLIC_API_URL;

function LoginPage(props) {
  const { login } = props;
  const [loggedIn, setLoggedIn] = useState(login);
  const [rememberMe, setRememberMe] = useState(false);

  const toggleDarkMode = () => {
    if (darkmode) {
      document.body.classList.remove("dark");
      sessionStorage.setItem("darkmode", JSON.stringify(false));
      setDarkmode(false);
    } else {
      document.body.classList.add("dark");
      sessionStorage.setItem("darkmode", JSON.stringify(true));
      setDarkmode(true);
    }
  };


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [error, setError] = useState(null);  

  const onSubmitLogin = async (data) => {
    try {
      const username = data.username;
      const password = data.password;
  
      let res;
  
      // Si el checkbox está marcado, guarda los detalles de inicio de sesión en localStorage
      if (rememberMe) {
        localStorage.setItem("Logged", true);
      }
  
      // Verificar si estás en un entorno de desarrollo o producción
      if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
        // Simular respuesta de API local para entorno de desarrollo
        const mockData = {
          token: '87873983798379837938',
          dataUser:{
            email: 'agrisoft@agrisoft.cl',
            username: 'Agrisoft Software',
            name: 'Agrisoft',
            lastName: 'Software',
            role: 'superadmin'
          }
        };
  
        res = {
          ok: true,
          json: () => Promise.resolve(mockData)
        };
  
      } else {

        // En producción, realizar la llamada a la API real
        res = await fetch(URLAPI + '/api/v1/signin', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuario: username,
            password: password,
          }),
        });
      }
  
      if (res.ok) {
        
        const userData = await res.json();

        if(userData.code == 'OK') {

          sessionStorage.setItem("userData", JSON.stringify(userData));
          sessionStorage.setItem("isLoggedIn", true);
          router.push("/dashboard");

        } else {

          setError(userData.mensaje);
          console.error("Error al iniciar sesión:", userData.mensaje);
          sessionStorage.clear();

        }

      } else {
        sessionStorage.clear();
        const errorData = await res.json();
        setError(errorData.error);
        console.error("Error al iniciar sesión:", res.status);
      }
    } catch (error) {
      sessionStorage.clear();
      console.error("Error de red:", error);
    }
  };

    return (
      <div className="relative float-right h-full min-h-screen w-full !bg-white dark:!bg-navy-900">
        <div className="mx-auto flex min-h-full w-full flex-col justify-start pt-12 md:max-w-[75%] lg:h-screen lg:max-w-[1013px] lg:px-8 lg:pt-0 xl:h-[100vh] xl:max-w-[1383px] xl:px-0 xl:pl-[70px]">
          <div className="mb-auto h-full flex flex-col pl-5 pr-5 md:pr-0 md:pl-12 lg:max-w-[48%] lg:pl-0 xl:max-w-full">
            <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
              <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
                <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
                  Inicar Sesión
                </h4>
                <p className="mb-9 ml-1 text-base text-gray-600">
                  {" "}
                  Ingresa tu email y password para ingresar.
                </p>
                <form onSubmit={handleSubmit(onSubmitLogin)} className="w-full">
                  {error && (
                    <p className="bg-red-500 text-lg text-white p-3 rounded mb-2">
                      {error}
                    </p>
                  )}

                  <div className="mb-3">
                    <label
                      htmlFor="username"
                      className="text-sm text-navy-700 dark:text-white ml-1.5 font-medium"
                    >
                      Usuario o Email:
                    </label>
                    <input
                      type="text"
                      {...register("username", {
                        required: {
                          value: true,
                          message: "Username is required",
                        },
                      })}
                      className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      placeholder="username"
                    />
                    {errors.username && (
                      <span className="text-red-500 text-xs">
                        {errors.username.message}
                      </span>
                    )}
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="password"
                      className="text-sm text-navy-700 dark:text-white ml-1.5 font-medium"
                    >
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
                      <Checkbox 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      name="rememberMe"
                      />
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

                  <button
                    className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                    ///onClick={}
                    onSubmit={onSubmitLogin}
                  >
                    Login
                  </button>
                </form>
              </div>
            </div>

            <div className="z-[5] mx-auto flex w-full max-w-screen-sm flex-col items-center justify-between px-[20px] pb-4 lg:mb-6 lg:max-w-[100%] lg:flex-row xl:mb-2 xl:w-[1310px] xl:pb-6">
              <p className="mb-6 text-center text-sm text-gray-600 md:text-base lg:mb-0">
                ©{1900 + new Date().getYear()} Agrisoft. Todos los derechos
                Reservados.
              </p>
            </div>

            <div className="absolute right-0 hidden h-dvh min-h-screen md:block lg:w-[49vw] 2xl:w-[44vw]">
              <div className="relative h-full w-full lg:rounded-bl-[120px] xl:rounded-bl-[200px] overflow-hidden">
                {/** Esto se debe arreglar cuando se termine ya que para vercel debe estar en la ruta de app */}
                <SimpleSlider
                  slides={[Slide1, Slide2, Slide3, Slide4]}
                  slidesToShow={1}
                  dots={false}
                  infinite={true}
                  autoplay={true}
                  speed={500}
                  fade={true}
                />
                <Image
                  src={LogoNormal}
                  alt="Agrisoft"
                  width={249}
                  height={241}
                  priority
                  className="object-cover max-h-[241px] min-w-[249px] absolute top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2"
                />
                <FixedPlugin />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default withAuth(LoginPage);
