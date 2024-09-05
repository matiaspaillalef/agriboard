"use client";

import { useState, useEffect, useRef } from "react";
import { formatNumber } from "@/functions/functions";
import ExportarExcel from "@/components/button/ButtonExportExcel";
import { useForm } from "react-hook-form";
import "@/assets/css/Table.css";
import {
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  UserPlusIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  deleteUser as deleteUserApi,
  updateUser,
  createUser,
  getDataUser,
} from "@/app/api/ConfiguracionApi";

const CardTableUsers = ({
  data,
  thead,
  columnsClasses = [],
  omitirColumns = [],
  title,
  actions,
  tableId,
  downloadBtn,
  SearchInput,
  datoscombos,
  datosCompanies,
}) => {
  const columnLabels = thead
    ? thead.split(",").map((label) => label.trim())
    : "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [initialData, setInitialData] = useState(data);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null); // Estado para almacenar los datos del usuario seleccionado para editar
  const [updateMessage, setUpdateMessage] = useState(null); // Estado para manejar el mensaje de actualización

  //Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({}); // Guarda los datos del usuario al editar

  const [showPassword, setShowPassword] = useState(false);

  const [openAlert, setOpenAlert] = useState(false);

  const [userToDelete, setUserToDelete] = useState({
    index: null,
    id: null,
    nombre: "",
    apellido: "",
  });

  const handleOpenNewUser = () => {
    setIsEdit(false);
    handleOpen();
  };

  const handleOpenEditUser = (user) => {
    console.log("Datos del usuario al editar:", user);
    //console.log("Contraseña cifrada:", user.password);
    setIsEdit(true);
    setFormData(user);
    setSelectedUser(user);
    handleOpen(user);
  };

  //console.log("Datos del usuario al editar:", selectedUser);

  const handleOpen = (user) => {
    reset();
    setSelectedUser(user); // Actualiza el estado con los datos del usuario seleccionado
    setOpen(!open);
  };

  const onUpdateUser = async (data) => {
    console.log("Datos del usuario a actualizar:", data);
    try {
      const updateUserApi = await updateUser(data);

      // Elimina la fila del front-end
      if (updateUserApi === "OK") {
        //let { userPassword, ...userDataWithoutPassword } = data; //Acá sacamos password del objeto data
        let userDataWithoutPassword = { ...data };

        //console.log(data);
        //console.log(userDataWithoutPassword);
        let id_rol = data.id_rol;
        let id_company = data.id_company;
        console.log(id_company);

        console.log(datoscombos);

        datoscombos.forEach((value) => {
          if (value.id_rol == id_rol) {
            userDataWithoutPassword = {
              ...userDataWithoutPassword,
              descripcion: value.descripcion,
              id_rol: value.id_rol, //Igual paso el id_rol ya que es necesario para la actualización de datos
            };
          }
        });

        datosCompanies.forEach((value) => {
          if (value.id == id_company) {
            userDataWithoutPassword = {
              ...userDataWithoutPassword,
              name_company: value.name_company,
              id_company: value.id, //Igual paso el id_company ya que es necesario para la actualización de datos
            };
          }
        });

        const updatedData = initialData.map((user) =>
          user.id === selectedUser.id
            ? {
                id: userDataWithoutPassword.id,
                name: userDataWithoutPassword.name,
                lastname: userDataWithoutPassword.lastname,
                password: userDataWithoutPassword.password,
                mail: userDataWithoutPassword.mail,
                id_rol: userDataWithoutPassword.id_rol,
                descripcion: userDataWithoutPassword.descripcion,
                id_company: userDataWithoutPassword.id_company,
                name_company: userDataWithoutPassword.name_company,
                id_state: userDataWithoutPassword.id_state,
              }
            : user
        );

        setInitialData(updatedData);
        setUpdateMessage("Usuario actualizadocorrectamente");
        setOpen(false);
      } else {
        setUpdateMessage("No se pudo actualizar el usuario");
      }
    } catch (error) {
      console.error(error);
      // Manejo de errores
    }
  };

  const handleOpenAlert = (index, id, nombre, apellido) => {
    setUserToDelete({ index, id, nombre, apellido });
    setOpenAlert(true);
  };

  //console.log("Datos del usuario a eliminar:", userToDelete.nombre);

  const handleCloseAlert = () => {
    setOpenAlert(false);
    setUserToDelete({ index: null, id: null, nombre: "", apellido: "" });
  };

  const handlerRemove = async () => {
    const { index, id } = userToDelete;

    try {
      //if (userConfirmed) {
      const deleteUser = await deleteUserApi(id);

      // Elimina la fila del front-end si la eliminación fue exitosa
      if (deleteUser === "OK") {
        const updatedData = [...initialData];
        updatedData.splice(index, 1);
        setInitialData(updatedData);
        setOpenAlert(false);
        setUpdateMessage("Usuario eliminado correctamente");
      } else {
        setUpdateMessage("Error al eliminar el usuario. Inténtalo nuevamente.");
      }
    } catch (error) {
      console.error(error);
      // Manejo de errores
      setUpdateMessage("Ocurrió un error al intentar eliminar el usuario.");
    }
  };

  // Creación de usuario
  const onSubmitForm = async (data) => {
    console.log(data);
    try {
      const createUserapi = await createUser(data);
      // Agrega la fila del front-end
      if (createUserapi == "OK") {
        //const newUser = { ...data };
        //let { userPassword, ...newUser } = data; // agregamos al fornt el nuevo usuario sin la password

        let id_rol = data.id_rol;
        console.log(id_company);

        datoscombos.forEach((value) => {
          if (value.id_rol == id_rol) {
            data = {
              ...data,
              descripcion: value.descripcion,
              id_rol: value.id_rol, //Igual paso el id_rol ya que es necesario para la actualización de datos
            };
          }
        });

        datosCompanies.forEach((value) => {
          if (value.id == id_company) {
            data = {
              ...data,
              name_company: value.name_company,
              id_company: value.id, //Igual paso el id_company ya que es necesario para la actualización de datos
            };
          }
        });

        const updatedData = [...initialData, data]; // Agregar el nuevo usuario a la lista de datos existente

        setInitialData(updatedData);
        console.log(updatedData);

        //HAgo este fech para traer el ID del usuario recien creado y trayendo la data actualizada de la BD
        const newDataFetch = await getDataUser(); // Actualizar la lista de usuarios
        console.log(newDataFetch);
        setInitialData(newDataFetch);

        setOpen(false);
        setUpdateMessage("Usuario creado correctamente");
      } else {
        setUpdateMessage(createUserapi);
      }
    } catch (error) {
      console.error(error);
      // Manejo de errores
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (updateMessage) {
      const timer = setTimeout(() => {
        setUpdateMessage(null);
        reset();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [updateMessage]);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setLoading(false);
    }
  }, [data]);

  const handlerSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = data.filter((item) =>
      Object.keys(item).some((key) =>
        item[key].toString().toLowerCase().includes(value)
      )
    );
    setInitialData(filteredData);
    setCurrentPage(1); // Resetear a la primera página después de la búsqueda
  };

  const totalPages = Math.ceil(
    (initialData ? initialData.length : 0) / itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = Array.isArray(initialData)
    ? initialData.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  const pagination = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      {updateMessage && ( // Mostrar el mensaje si updateMessage no es null
        <div
          className={`bg-${
            updateMessage.includes("correctamente") ? "green" : "red"
          }-500 text-white text-center py-2 fixed top-0 left-0 right-0 z-50`}
          style={{ zIndex: 999999 }}
        >
          {updateMessage}
        </div>
      )}
      <div className="mb-3 flex gap-5 ">
        <Button
          onClick={handleOpenNewUser}
          //variant="gradient"
          className="max-w-[300px] linear mt-2 w-full rounded-xl bg-blueTertiary py-[12px] text-base font-medium text-white transition duration-200 hover:!bg-blueQuinary active:bg-blueTertiary dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 items-center justify-center flex gap-2 normal-case"
        >
          <UserPlusIcon className="w-6 h-6" />
          Nuevo usuario
        </Button>
      </div>
      {loading ? (
        <div role="status" className="max-w-full animate-pulse p-0">
          {/* Titulo */}
          <div
            className={`h-[22px] dark:bg-gray-200 bg-gray-400 w-1/2 rounded-sm pb-[10px] mb-5`}
          ></div>
        </div>
      ) : (
        <>
          <div
            className={`relative flex items-center ${
              title ? "justify-between" : "justify-end"
            } `}
          >
            {title && (
              <h4 className="text-xl font-bold text-navy-700 dark:text-white md:hidden">
                {title}
              </h4>
            )}

            <div className="buttonsActions mb-3 flex gap-2 w-full flex-col md:w-auto md:flex-row md:gap-5">
              {Array.isArray(initialData) &&
                initialData.length > 0 &&
                downloadBtn && (
                  <ExportarExcel
                    data={initialData}
                    filename="usuarios"
                    sheetname="usuarios"
                    titlebutton="Exportar a excel"
                  />
                )}

              {SearchInput && (
                <input
                  type="search"
                  placeholder="Buscar"
                  className="search mt-2 w-[250px] h-[50px] rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-400 dark:border-white dark:text-white"
                  onKeyUp={handlerSearch}
                />
              )}
            </div>
          </div>

          <div className="h-full overflow-x-scroll max-h-dvh">
            <table
              role="table"
              className="mt-8 h-max w-full"
              variant="simple"
              color="gray-500"
              mb="24px"
              id="tablaUsuarios"
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
                {currentItems.map((row, index) => (
                  <tr key={index} role="row">
                    {Object.keys(row).map((key, rowIndex) => {
                      if (omitirColumns.includes(key)) {
                        return null; // Omitir la columna si está en omitirColumns
                      }
                      {
                        console.log(row);
                      }
                      if (key === "password") {
                        return null; // No renderizar el <td> si la clave es "password"
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
                            {key === "id_state" ? (
                              //console.log(key),
                              row[key] == 1 ? (
                                <p className="activeState bg-lime-500 flex items-center justify-center rounded-md text-white py-2 px-3">
                                  Activo
                                </p>
                              ) : (
                                <p className="inactiveState bg-red-500 flex items-center justify-center rounded-md text-white py-2 px-3">
                                  Inactivo
                                </p>
                              )
                            ) : key !== "password" ? (
                              formatNumber(row[key])
                            ) : (
                              "" // No mostrar la contraseña
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
                          //onClick={() => handleOpen(row)}
                          onClick={() => handleOpenEditUser(row)}
                        >
                          <PencilSquareIcon className="w-6 h-6" />
                        </button>
                        <button
                          id="remove"
                          type="button"
                          onClick={() => {
                            //console.log(row);
                            handleOpenAlert(
                              index,
                              row.id,
                              row.name,
                              row.lastname
                            );
                          }}
                        >
                          <TrashIcon className="w-6 h-6" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {Array.isArray(initialData) &&
            initialData.length > 0 &&
            pagination.length > 1 && (
              <div className="flex items-center justify-between mt-5">
                <div className="flex items-center gap-5">
                  <p className="text-sm text-gray-800 dark:text-white">
                    Mostrando {indexOfFirstItem + 1} a{" "}
                    {indexOfLastItem > initialData.length
                      ? initialData.length
                      : indexOfLastItem}{" "}
                    de {initialData.length} usuarios
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    className={`p-1 bg-gray-200 dark:bg-navy-900 rounded-md ${
                      currentPage === 1 && "hidden"
                    }`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  {pagination.map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={`${
                        currentPage === page
                          ? "font-semibold text-navy-500 dark:text-navy-300"
                          : ""
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="p-1 bg-gray-200 dark:bg-navy-900 rounded-md"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

          <Dialog
            open={open}
            handler={handleOpen}
            size="xs"
            className="p-5 lg:max-w-[25%] dark:bg-navy-900 overflow-x-scroll max-h-[650px]"
          >
            <button
              type="button"
              onClick={handleOpen}
              className="absolute right-[15px] top-[15px] flex items-center justify-center w-10 h-10 bg-lightPrimary dark:bg-navy-800 dark:text-white rounded-md"
            >
              <XMarkIcon className="text-white w-5 h-5" />
            </button>
            <DialogHeader className="dark:text-white">
              {isEdit ? "Editar Usuario" : "Crear Usuario"}
            </DialogHeader>
            <DialogBody>
              <form
                onSubmit={handleSubmit(isEdit ? onUpdateUser : onSubmitForm)}
                method="POST"
              >
                <input
                  type="hidden"
                  name="id"
                  {...register("id")}
                  defaultValue={selectedUser ? selectedUser.id : ""}
                />
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
                      {...register("name")}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="lastname"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Apellido
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      id="lastname"
                      {...register("lastname")}
                      defaultValue={selectedUser ? selectedUser.lastname : ""}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    />
                  </div>
                </div>
                <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-1">
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="userPassword"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        {...register("password")}
                        defaultValue={selectedUser ? selectedUser.password : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showPassword ? (
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  {isEdit && (
                    <small className="text-xs text-red-500">
                      * La contraseña se muestra encriptada por temas de
                      seguridad, puede reemplazar por una nueva, la que luego se
                      mostrará encriptada.
                    </small>
                  )}
                </div>

                <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      {...register("mail")}
                      defaultValue={selectedUser ? selectedUser.mail : ""}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="id_rol"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Rol usuario
                    </label>
                    <select
                      name="id_rol"
                      id="id_rol"
                      {...register("id_rol")}
                      defaultValue={selectedUser ? selectedUser.id_rol : ""}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    >
                      {datoscombos.map((rol, index) => {
                        return (
                          <option key={index} value={rol.id_rol}>
                            {rol.descripcion}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="id_company"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Empresa
                    </label>
                    <select
                      name="id_company"
                      id="id_company"
                      {...register("id_company")}
                      defaultValue={selectedUser ? selectedUser.id_company : ""}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    >
                      {datosCompanies.map((empresas, index) => {
                        return (
                          <option key={index} value={empresas.id}>
                            {empresas.name_company}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="id_state"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Estado
                    </label>
                    <select
                      name="id_state"
                      id="id_state"
                      {...register("id_state")}
                      defaultValue={selectedUser ? selectedUser.id_state : ""}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    >
                      <option value="2">Inactivo</option>
                      <option value="1">Activo</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      type="submit"
                      className="linear mt-[30px] w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-navy-500 active:bg-navy-500 dark:bg-navy-500 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                      //onSubmit={onUpdateUser}
                      onSubmit={isEdit ? onUpdateUser : onSubmitForm} // Aquí va la función que envía los datos al backend para crear el usuario y cerrar el modal
                    >
                      {isEdit ? "Editar Usuario" : "Crear Usuario"}
                    </button>
                  </div>
                </div>
              </form>
            </DialogBody>
          </Dialog>

          <Dialog
            open={openAlert}
            handler={handleCloseAlert}
            size="xs"
            className="p-5 lg:max-w-[25%] dark:bg-navy-900"
          >
            <>
              <h2 className="text-center mb-7 text-xl mt-5 dark:text-white">
                ¿Seguro que desea eliminar usuario{" "}
                <strong className="font-bold">
                  {userToDelete.nombre} {userToDelete.apellido}{" "}
                </strong>
                ?
              </h2>
              <button
                type="button"
                onClick={handleCloseAlert}
                className="bg-gray-500 text-white px-1 py-1 rounded mr-2 absolute right-1 top-2"
              >
                <XMarkIcon className="text-white w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handlerRemove}
                className="bg-red-500 text-white flex items-center justify-center px-4 py-2 rounded m-auto"
              >
                <XMarkIcon className="text-white w-5 h-5" /> Eliminar
              </button>
            </>
          </Dialog>
        </>
      )}
    </>
  );
};

export default CardTableUsers;
