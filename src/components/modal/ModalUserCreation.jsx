"use client";

import { useState, useRef } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { createUser }  from "@/app/api/ConfiguracionApi";

const ModalUserCreation = (props) => {

  const [open, setOpen] = useState(false);
  const {datoscombos} = props;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const  onSubmitForm =  async (data) => {

        try {
      
            const createUserapi = await createUser(data);
            console.log(createUserapi);
      
            // Elimina la fila del front-end
            if(createUserapi == "OK") {
              //aqui se debe recargar la grilla con el usuario recien creado
              //const updatedData = [...initialData];
              //updatedData.splice(index, 1);
              //setInitialData(updatedData); // Actualiza el estado con los datos sin la fila eliminada
              setOpen(!open);
            }else {
              //aqui el else mati :P
            }
            
          } catch (error) {
            console.error(error);
            // Manejo de errores
          }

  };

  const handleOpen = () => setOpen(!open);

  return (
    <>
      <div className="mb-3 flex gap-5 ">
        <Button
          onClick={handleOpen}
          //variant="gradient"
          className="max-w-[300px] linear mt-2 w-full rounded-xl bg-blueTertiary py-[12px] text-base font-medium text-white transition duration-200 hover:!bg-blueQuinary active:bg-blueTertiary dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 items-center justify-center flex gap-2 normal-case"
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
              d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
            />
          </svg>
          Nuevo usuario
        </Button>
      </div>
      <Dialog
        open={open}
        handler={handleOpen}
        size="xs"
        className="p-5 lg:max-w-[25%] dark:bg-navy-900"
      >
        <button
          type="button"
          onClick={handleOpen}
          className="absolute right-[15px] top-[15px] flex items-center justify-center w-10 h-10 bg-lightPrimary dark:bg-navy-800 dark:text-white rounded-md"
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

        <DialogHeader className="dark:text-white">
          Crea un nuevo usario
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit(onSubmitForm)} method="POST">
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
                  {...register("name")}
                  className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="lastName"
                  className="text-sm font-semibold text-gray-800 dark:text-white"
                >
                  Apellido
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  {...register("lastName")}
                  className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                />
              </div>
            </div>
            <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="userPassword"
                  className="text-sm font-semibold text-gray-800 dark:text-white"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  name="userPassword"
                  id="userPassword"
                  {...register("userPassword")}
                  className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                />
              </div>
            </div>

            <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="userEmail"
                  className="text-sm font-semibold text-gray-800 dark:text-white"
                >
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="userEmail"
                  id="userEmail"
                  {...register("userEmail")}
                  className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="menuRol"
                  className="text-sm font-semibold text-gray-800 dark:text-white"
                >
                  Rol usuario
                </label>
                <select
                  name="menuRol"
                  id="menuRol"
                  {...register("menuRol")}
                  className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                >
                  {datoscombos.map((rol,index) => { 
                    return (<option key={index} value={rol.id_rol}>{rol.descripcion}</option>)
                  })}
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="menuState"
                  className="text-sm font-semibold text-gray-800 dark:text-white"
                >
                  Estado
                </label>
                <select
                  name="menuState"
                  id="menuState"
                  {...register("menuState")}
                  className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                >
                  <option value="0">Inactivo</option>
                  <option value="1">Activo</option>
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  className="linear mt-[30px] w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-navy-500 active:bg-navy-500 dark:bg-navy-500 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                  onSubmit={onSubmitForm} // Aquí va la función que envía los datos al backend para crear el usuario y cerrar el modal
                >
                  Crear usuario
                </button>
              </div>
            </div>
          </form>
        </DialogBody>
      </Dialog>

      <div id="confirmModal" class="modal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <p>¿Estás seguro de que deseas eliminar este usuario?</p>
    <button id="confirmBtn">Aceptar</button>
    <button id="cancelBtn">Cancelar</button>
  </div>
</div>
    </>
  );
};

export default ModalUserCreation;