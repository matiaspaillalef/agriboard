"use client";
import { useState } from "react";
import CardTableRoles from "@/components/card/CardTableRoles";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

import Switch from "@/components/switch";

import { DataRoles } from "@/app/data/dataRoles";

const RoleCreationPage = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  //console.log(DataRoles[0].roles);

  return (
    <div className="flex w-full flex-col gap-5 mt-3">
      <Button
        onClick={handleOpen}
        variant="gradient"
        className="max-w-[300px] linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 items-center justify-center flex gap-2 normal-case"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        Crear nuevo rol
      </Button>
      <Dialog
        open={open}
        handler={handleOpen}
        size="xs"
        className="p-5 lg:max-w-[25%]"
      >
        <button
          type="button"
          onClick={handleOpen}
          className="absolute right-[15px] top-[15px] flex items-center justify-center w-10 h-10 bg-lightPrimary dark:bg-navy-900 rounded-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>

        <DialogHeader>Crea un nuevo rol</DialogHeader>
        <DialogBody>
          <form action=" " method="POST">
            <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
              <div className="flex flex-col gap-3 ">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-800 dark:text-white"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                />
              </div>
              <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-4">
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="switchRead"
                    className="text-sm font-semibold text-gray-800 dark:text-white"
                  >
                    Lectura
                  </label>
                  <Switch id="switchRead" />
                </div>
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="switchUpdate"
                    className="text-sm font-semibold text-gray-800 dark:text-white"
                  >
                    Edición
                  </label>
                  <Switch id="switchUpdate" />
                </div>
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="switchClear"
                    className="text-sm font-semibold text-gray-800 dark:text-white"
                  >
                    Eliminación
                  </label>
                  <Switch id="switchClear" />
                </div>
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="switchCreate"
                    className="text-sm font-semibold text-gray-800 dark:text-white"
                  >
                    Escritura
                  </label>
                  <Switch id="switchCreate" />
                </div>
              </div>
            </div>

            <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  className="linear mt-[30px] w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                  onClick={handleOpen} // Aquí va la función que envía los datos al backend para crear el usuario y cerrar el modal
                >
                  Crear usuario
                </button>
              </div>
            </div>
          </form>
        </DialogBody>
      </Dialog>

      <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
        <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
          <CardTableRoles
            data={DataRoles[0].roles}
            thead="Nombre, Lectura, Edición, Eliminación, Escritura, Acciones"
            title="Roles de usuario"
            actions={true}
          />
        </div>
      </div>
    </div>
  );
};

export default RoleCreationPage;
