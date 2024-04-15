"use client";

import { useState, useEffect } from "react";
import { formatNumber } from "@/functions/functions";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

const CardTableUsers = ({
  data,
  thead,
  columnsClasses = [],
  omitirColumns = [],
  title,
  actions,
}) => {
  const columnLabels = thead
    ? thead.split(",").map((label) => label.trim())
    : "";

  const [initialData, setInitialData] = useState(data);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null); // Estado para almacenar los datos del usuario seleccionado para editar

  const handleOpen = (user) => {
    setSelectedUser(user); // Actualiza el estado con los datos del usuario seleccionado
    setOpen(!open);

    //console.log("Usuario seleccionado", user);
  };

  const handlerRemove = (index) => {
    //console.log("Eliminar usuario", index);
    try {
      // Realiza la petición DELETE al backend
      /*if (!response.ok) {
        throw new Error("Error al eliminar el usuario");
      }*/

      // Elimina la fila del front-end
      const updatedData = [...initialData];
      updatedData.splice(index, 1);
      setInitialData(updatedData); // Actualiza el estado con los datos sin la fila eliminada
    } catch (error) {
      console.error(error);
      // Manejo de errores
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <div role="status" className="max-w-full animate-pulse p-0">
          {/* Titulo */}
          <div
            className={`h-[22px] dark:bg-gray-200 bg-gray-400 w-1/2 rounded-sm pb-[10px] mb-5`}
          ></div>

          {/* Mapeamos la props del thead */}
          {columnLabels && (
            <div className="flex gap-3 mb-2">
              {columnLabels.map((label, index) => {
                if (omitirColumns.includes(label)) {
                  return null; // Omitir la columna si está en omitirColumns
                }

                const widthClass =
                  columnLabels.length > 6
                    ? `w-1/2`
                    : `w-${columnLabels.length}/12`;
                return (
                  <div
                    className={`h-[17px] dark:bg-gray-200 bg-gray-400 ${widthClass} rounded-sm pb-[10px]`}
                    key={index}
                  ></div>
                );
              })}
            </div>
          )}
          {/* Mapeamos los items de la información */}
          {initialData.map((item, index) => {
            const numPropiedades = Object.keys(item).length;

            return (
              <div className="flex gap-3 mb-2" key={index}>
                {Object.keys(item).map((propiedad, idx) => {
                  if (omitirColumns.includes(propiedad)) {
                    return null; // Omitir la columna si está en omitirColumns
                  }

                  const widthClass =
                    numPropiedades > 6 ? `w-1/2` : `w-${numPropiedades}/12`;

                  return (
                    <div
                      className={`h-[40px] dark:bg-gray-200 bg-gray-400 ${widthClass} rounded-sm pb-[10px]`}
                      key={idx}
                    ></div>
                  );
                })}
              </div>
            );
          })}
        </div>
      ) : (
        <>
          {title && (
            <div className="relative flex items-center justify-between">
              <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                {title}
              </h4>
            </div>
          )}
          <div className="h-full overflow-x-scroll max-h-dvh">
            <table
              role="table"
              className="mt-8 h-max w-full"
              variant="simple"
              color="gray-500"
              mb="24px"
            >
              {thead && (
                <thead>
                  <tr role="row">
                    {columnLabels &&
                      columnLabels.map((label, index) => {
                        if (omitirColumns.includes(label)) {
                          return null; // Omitir la columna si está en omitirColumns
                        }
                        return (
                          <th
                            key={index}
                            colSpan={1}
                            role="columnheader"
                            className="border-b border-gray-200 px-5 pb-[10px] text-start dark:!border-navy-700"
                          >
                            <p
                              className={`text-xs tracking-wide text-gray-600 ${
                                columnsClasses[index] || "text-start"
                              } `}
                            >
                              {label}
                            </p>
                          </th>
                        );
                      })}
                  </tr>
                </thead>
              )}
              <tbody role="rowgroup">
                {initialData.map((row, index) => (
                  <tr key={index} role="row">
                    {Object.keys(row).map((key, rowIndex) => {
                      if (omitirColumns.includes(key)) {
                        return null; // Omitir la columna si está en omitirColumns
                      }
                      return (
                        <td
                          key={rowIndex}
                          role="cell"
                          className={`pt-[14px] pb-3 text-[14px] px-5 ${
                            index % 2 !== 0
                              ? "bg-lightPrimary dark:bg-navy-900"
                              : ""
                          } ${columnsClasses[rowIndex] || "text-left"}`}
                        >
                          <div className="text-base font-medium text-navy-700 dark:text-white">
                            {key === "state" ? (

                              row[key] === 1 ? (
                                <p className="activeState bg-lime-500 flex items-center justify-center rounded-md text-white py-2 px-3">
                                  Activo
                                </p>
                              ) : (
                                <p className="inactiveState bg-red-500 flex items-center justify-center rounded-md text-white py-2 px-3">
                                    Inactivo
                                </p>
                              )

                            ) : (
                              formatNumber(row[key])
                            )}
                          </div>
                        </td>
                      );
                    })}
                    {actions && (
                      <td
                        colSpan={columnLabels.length}
                        className={`pt-[14px] pb-3 text-[14px] px-5 ${
                          index % 2 !== 0
                            ? "bg-lightPrimary dark:bg-navy-900"
                            : ""
                        }`}
                      >
                        <button
                          type="button"
                          className="text-sm font-semibold text-gray-800 dark:text-white"
                          onClick={() => handleOpen(row)}
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
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </button>
                        <button
                          id="remove"
                          type="button"
                          onClick={() => handlerRemove(index)}
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
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
            {/* Aquí va el contenido del modal para editar usuario */}
            <DialogHeader>Editar usario</DialogHeader>
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
                      defaultValue={selectedUser ? selectedUser.name : ""}
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
                      defaultValue={selectedUser ? selectedUser.lastName : ""}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    />
                  </div>
                </div>
                <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
                  <div className="flex flex-col gap-3 ">
                    <label
                      htmlFor="userName"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      name="userName"
                      id="userName"
                      defaultValue={selectedUser ? selectedUser.username : ""}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    />
                  </div>
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
                      defaultValue={selectedUser ? selectedUser.password : ""}
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
                      defaultValue={selectedUser ? selectedUser.email : ""}
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
                      defaultValue={selectedUser ? selectedUser.rol : ""}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    >
                      <option value="superadmin">Superadmin</option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
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
                      defaultValue={selectedUser ? selectedUser.state : 0}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    >
                      <option value="0">Inactivo</option>
                      <option value="1">Activo</option>
                    </select>
                  </div>
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
        </>
      )}
    </>
  );
};

export default CardTableUsers;
