// pages/reset-password.js
"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Logo from "../../../public/agrisoft_logo.webp";

const URLAPI = process.env.NEXT_PUBLIC_API_URL;

export default function ResetPassword({ searchParams }) {
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [codeResponse, setCodeResponse] = useState("");
  const router = useRouter();
  const token = searchParams.token;

  const darkModeFx = useEffect(() => {
    const darkData = JSON.parse(sessionStorage.getItem("darkmode"));
    if (darkData) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await fetch(URLAPI + "/api/v1/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, token }),
      });

      const result = await response.json();

      setCodeResponse(result.code);

      if (result.code == "OK") {
        setMessage("Contraseña actualizada. Redirigiendo al login...");
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        setMessage(result.message || "Hubo un problema. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Hubo un problema. Inténtalo de nuevo.");
    }
  };

  return (
    <div
      className={`flex items-center justify-center max-h-dvh h-dvh p-10 ${
        darkMode ? "bg-navy-900" : "bg-lightPrimary"
      }`}
    >
      <div className="w-full md:w-1/3 bg-white md:p-20 p-5 rounded-lg flex items-center justify-center flex-col gap-5">
        <Image
          src={Logo}
          alt="Agrisoft"
          width={150}
          height={200}
          className="mb-5"
        />
        <h1 className="text-2xl font-bold text-navy-900 text-center">
          Restablecer Contraseña
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div>
            <label>Nueva Contraseña:</label>
            <input
              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
              type="password"
              {...register("password", { required: true })}
              placeholder="Nueva contraseña"
            />
          </div>
          <button
            className="linear mt-[30px] w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-navy-500 active:bg-navy-500 dark:bg-navy-500 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            type="submit"
          >
            Restablecer
          </button>
        </form>
        {message && (
          <p
            className={`w-full px-3 py-1 rounded-sm text-center text-sm ${
              codeResponse == "OK" ? "bg-green-500" : "bg-red-500 text-white"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
