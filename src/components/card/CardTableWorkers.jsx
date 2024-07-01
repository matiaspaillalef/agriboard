"use client";

import { useState, useEffect, useRef } from "react";
import { formatNumber } from "@/functions/functions";
import ExportarExcel from "@/components/button/ButtonExportExcel";
import ExportarPDF from "@/components/button/ButtonExportPDF";
import { useForm } from "react-hook-form";
import "@/assets/css/Table.css";
import { PlusIcon, XMarkIcon, EyeIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
} from "@material-tailwind/react";
import {
  deleteWorker as deleteWorkerApi,
  updateWorker,
  createWorker,
  getDataWorkers,
} from "@/app/api/ConfiguracionApi";

import { ProvitionalCL } from "@/app/data/dataProvisionals";
import Rut from "@/components/validateRUT";
import { StateCL } from "@/app/data/dataStates";

const CardTableWorkers = ({
  data,
  thead,
  columnsClasses = [],
  omitirColumns = [],
  title,
  actions,
  tableId,
  downloadBtn,
  SearchInput,
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

  const [selectedItem, setSelectedItem] = useState(null); // Estado para almacenar los datos del item seleccionado para editar
  const [updateMessage, setUpdateMessage] = useState(null); // Estado para manejar el mensaje de actualización

  //Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({}); // Guarda los datos del item al editar

  const [openShowUser, setOpenShowUser] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState("XV");
  const [selectedCity, setSelectedCity] = useState("Arica");

  const [rut, setRut] = useState("");
  const [rutValido, setRutValido] = useState(false);

  const handleRegionChange = (event) => {
    const region = event.target.value;
    setSelectedRegion(region);

    // Buscar la región seleccionada en los datos de StateCL
    const selectedRegionData = StateCL.find(
      (state) => state.region_number === region
    );

    // Actualizar las comunas correspondientes a la región seleccionada
    if (selectedRegionData) {
      const { comunas } = selectedRegionData;
      // Establecer la primera comuna como la seleccionada por defecto
      if (comunas && comunas.length > 0) {
        setSelectedCity(comunas[0].name);
      } else {
        setSelectedCity(""); // Resetear la ciudad seleccionada si no hay comunas
      }
    } else {
      setSelectedCity(""); // Resetear la ciudad seleccionada si no se encuentra la región seleccionada
    }
  };

  const [openAlert, setOpenAlert] = useState(false);

  const [itemToDelete, setItemToDelete] = useState({
    index: null,
    id: null,
    name: "",
    lastname: "",
  });

  const handleOpenShowUser = (user) => {
    console.log(user);
    setSelectedItem(user);
    setOpenShowUser(true);
    setSelectedRegion(user.state);
    setFormData(user);
    handleOpen(user);
    setIsEdit(false);
  };

  const handleOpenNewUser = () => {
    setIsEdit(false);
    setOpenShowUser(false);
    handleOpen();
  };

  const handleOpenEditUser = (user) => {
    setRutValido(true); //Se pasa en true ya que si leventa la ventada de editar es por que los datos ya fueron validados
    setOpenShowUser(false);
    setSelectedRegion(user.state);
    setIsEdit(true);
    setFormData(user);
    setSelectedItem(user);
    handleOpen(user);
  };

  const handleOpen = (user) => {
    reset();
    setSelectedItem(user); // Actualiza el estado con los datos del usuario seleccionado
    setOpen(!open);
  };

  const onUpdateItem = async (data) => {
    console.log(data);

    try {
      const updateWorkerApi = await updateWorker(data);

      // Elimina la fila del front-end
      if (updateWorkerApi === "OK") {
        const updatedData = initialData.map((item) =>
          item.id == data.id ? { ...data } : item
        );

        setInitialData(updatedData);
        setUpdateMessage("Trabajadoractualizado correctamente");
        setOpen(false);
      } else {
        setUpdateMessage("No se pudo actualizar al trabajador");
      }
    } catch (error) {
      console.error(error);
      // Manejo de errores
      setUpdateMessage("Error al intentar actualizar al trabajador");
    }
  };

  const handleOpenAlert = (index, id, name, lastname) => {
    setItemToDelete({ index, id, name, lastname });
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
    setItemToDelete({ index: null, id: null, name: "", lastname: "" });
  };

  const handlerRemove = async () => {
    const { index, id } = itemToDelete;

    try {
      //if (userConfirmed) {
      const deleteWorker = await deleteWorkerApi(id);

      // Elimina la fila del front-end si la eliminación fue exitosa
      if (deleteWorker === "OK") {
        const updatedData = [...initialData];
        updatedData.splice(index, 1);
        setInitialData(updatedData);
        setOpenAlert(false);
        setUpdateMessage("Trabajador eliminado correctamente");
      } else {
        setUpdateMessage(
          "Error al eliminar al trabajador. Inténtalo nuevamente."
        );
      }
    } catch (error) {
      console.error(error);
      // Manejo de errores
      setUpdateMessage("Ocurrió un error al intentar eliminar al trabajador.");
    }
  };

  // Creación
  const onSubmitForm = async (data) => {
    console.log(data);

    try {
      const createWorkerapi = await createWorker(data);

      console.log(createWorkerapi);
      // Agrega la fila del front-end
      if (createWorkerapi == "OK") {
        const updatedData = [...initialData, data]; // Agregar el nuevo usuario a la lista de datos existente

        setInitialData(updatedData);

        //Hago este fech para traer el ID del usuario recien creado y trayendo la data actualizada de la BD
        const newDataFetch = await getDataWorkers(); // Actualizar la lista de usuarios
        //console.log(newDataFetch);
        setInitialData(newDataFetch);

        setOpen(false);

        setUpdateMessage("Trabajador creado correctamente");
      } else {
        setUpdateMessage("Error al crear al trabajador");
      }
    } catch (error) {
      console.error(error);
      // Manejo de errores
    }
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

  let totalPages;
  if (initialData === undefined) {
    totalPages = 0; // O cualquier otro valor por defecto que desees asignar
  } else {
    totalPages = Math.ceil(initialData.length / itemsPerPage);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  let currentItems = [];
  if (Array.isArray(initialData)) {
    currentItems = initialData.slice(indexOfFirstItem, indexOfLastItem);
  }

  const pagination = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (!data || data.length === 0) {
    return <div>No hay datos disponibles.</div>;
  }

  const formatDateToInput = (date) => {
    if (!date) return "";
    return date.split("T")[0]; // Solo toma la parte de la fecha antes de la 'T'
  };

  // Función para manejar la validación de la fecha de nacimiento
  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    const minDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    // Validar que la fecha no sea en el futuro y que la persona sea mayor de 18 años
    if (selectedDate > today || selectedDate > minDate) {
      // Mostrar algún mensaje de error o tomar la acción necesaria (por ejemplo, deshabilitar el botón de submit)
      alert(
        "La fecha de nacimiento debe ser válida y el usuario debe ser mayor de 18 años."
      );
      e.target.value = "";
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Add leading zero if month or day is less than 10
    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }

    return `${year}-${month}-${day}`;
  };

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
          variant="gradient"
          className="max-w-[300px] linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 items-center justify-center flex gap-2 normal-case"
        >
          <PlusIcon className="w-5 h-5" />
          Nuevo trabajador
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
              {downloadBtn && (
                <>
                  <ExportarExcel
                    data={initialData}
                    filename="empresas"
                    sheetname="empresas"
                    titlebutton="Exportar a excel"
                  />
                  <ExportarPDF
                    data={initialData}
                    filename="empresas"
                    titlebutton="Exportar a PDF"
                  />
                </>
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
              id="tablaEmpresas"
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
                    {/* Aquí se renderiza la columna Actions si actions es true */}
                    {actions && (
                      <th
                        colSpan={1}
                        role="columnheader"
                        className="border-b border-gray-200 px-5 pb-[10px] text-start dark:!border-navy-700"
                      >
                        <p className="text-xs tracking-wide text-gray-600">
                          Actions
                        </p>
                      </th>
                    )}
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
                            {key === "status" ? (
                              //console.log(key),
                              row[key] == 1 ? (
                                <p className="activeState bg-lime-500 flex items-center justify-center rounded-md text-white py-2 px-3 max-w-36">
                                  Activo
                                </p>
                              ) : (
                                <p className="inactiveState bg-red-500 flex items-center justify-center rounded-md text-white py-2 px-3 max-w-36">
                                  Inactivo
                                </p>
                              )
                            ) : key !== "password" ? (
                              key === "state" ? (
                                // Transformar el número de región a su nombre correspondiente
                                StateCL.find(
                                  (state) => state.region_number == row[key]
                                )?.region || "-"
                              ) : (
                                formatNumber(row[key])
                              )
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
                          onClick={() => handleOpenShowUser(row)}
                        >
                          <EyeIcon className="w-6 h-6" />
                        </button>
                        <button
                          type="button"
                          className="text-sm font-semibold text-gray-800 dark:text-white"
                          //onClick={() => handleOpen(row)}
                          onClick={() => handleOpenEditUser(row)}
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
                          onClick={() => {
                            //console.log(row);
                            handleOpenAlert(
                              index,
                              row.id,
                              row.name ? row.name : "",
                              row.lastname ? row.lastname : ""
                            );
                          }}
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
          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center gap-5">
              <p className="text-sm text-gray-800 dark:text-white">
                Mostrando {indexOfFirstItem + 1} a{" "}
                {indexOfLastItem > initialData.length
                  ? initialData.length
                  : indexOfLastItem}{" "}
                de {initialData.length} trabajadores
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
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
              {openShowUser
                ? "Datos del trabajador"
                : isEdit
                ? "Editar trabajador"
                : "Nuevo trabajador"}
            </DialogHeader>
            <DialogBody>
              <form
                onSubmit={handleSubmit(isEdit ? onUpdateItem : onSubmitForm)}
                method="POST"
              >
                <input
                  type="hidden"
                  name="id"
                  {...register("id")}
                  defaultValue={selectedItem ? selectedItem.id : ""}
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
                      readOnly={openShowUser}
                      required={true}
                      defaultValue={selectedItem ? selectedItem.name : ""}
                      {...register("name")}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    />
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="lastname"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Apellido paterno
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      id="lastname"
                      readOnly={openShowUser}
                      required={true}
                      defaultValue={selectedItem ? selectedItem.lastname : ""}
                      {...register("lastname")}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="lastname2"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Apellido materno
                    </label>
                    <input
                      type="text"
                      name="lastname2"
                      id="lastname2"
                      readOnly={openShowUser}
                      required={true}
                      defaultValue={selectedItem ? selectedItem.lastname2 : ""}
                      {...register("lastname2")}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    />
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="rut"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      RUT
                    </label>
                    <Rut
                      //value={rut}
                      onChange={(e) => setRut(e.target.value)}
                      onValid={setRutValido}
                    >
                      <input
                        type="text"
                        name="rut"
                        id="rut"
                        readOnly={openShowUser}
                        required={true}
                        {...register("rut")}
                        defaultValue={selectedItem ? selectedItem.rut : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </Rut>
                    {!rutValido && (
                      <span className="text-red-500 text-xs">
                        El rut es inválido
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="born_date"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Fecha de nacimiento
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="born_date"
                        readOnly={openShowUser}
                        required={true}
                        max={getCurrentDate()}
                        id="born_date"
                        {...register("born_date")}
                        defaultValue={
                          selectedItem
                            ? formatDateToInput(selectedItem.born_date)
                            : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white pr-10"
                        onChange={handleDateChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="gender"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Género
                    </label>
                    <div className="relative">
                      <select
                        name="gender"
                        id="gender"
                        disabled={openShowUser}
                        required={true}
                        {...register("gender")}
                        defaultValue={selectedItem ? selectedItem.gender : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      >
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="state_civil"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Estado civil
                    </label>
                    <div className="relative">
                      <select
                        name="state_civil"
                        id="state_civil"
                        disabled={openShowUser}
                        required={true}
                        {...register("state_civil")}
                        defaultValue={
                          selectedItem ? selectedItem.state_civil : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      >
                        <option value="Soltero">Soltero</option>
                        <option value="Casado">Casado</option>
                        <option value="Divorciado">Divorciado</option>
                        <option value="Viudo">Viudo</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="state"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Región
                    </label>
                    <select
                      name="state"
                      id="state"
                      disabled={openShowUser}
                      required={true}
                      {...register("state")}
                      defaultValue={selectedItem ? selectedItem.state : ""}
                      onChange={handleRegionChange}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    >
                      {StateCL.map((state) => (
                        <option
                          key={state.region_number}
                          value={state.region_number}
                        >
                          {state.region}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="city"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Ciudad
                    </label>
                    <select
                      name="city"
                      id="city"
                      disabled={openShowUser}
                      onChange={(event) => setSelectedCity(event.target.value)}
                      {...register("city")}
                      defaultValue={selectedItem ? selectedItem.city : ""}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    >
                      {selectedRegion &&
                        StateCL.find(
                          (state) => state.region_number === selectedRegion
                        )?.comunas.map((comuna) => (
                          <option key={comuna.name} value={comuna.name}>
                            {comuna.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="address"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Dirección
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      readOnly={openShowUser}
                      required={true}
                      defaultValue={selectedItem ? selectedItem.address : ""}
                      {...register("address")}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    />
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="phone"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Teléfono
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      readOnly={openShowUser}
                      required={true}
                      defaultValue={selectedItem ? selectedItem.phone : ""}
                      {...register("phone")}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="phone_company"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Teléfono de la empresa
                    </label>
                    <input
                      type="text"
                      name="phone_company"
                      id="phone_company"
                      readOnly={openShowUser}
                      required={true}
                      defaultValue={
                        selectedItem ? selectedItem.phone_company : ""
                      }
                      {...register("phone_company")}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    />
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="date_admission"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Fecha de ingreso
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="date_admission"
                        required={true}
                        id="date_admission"
                        max={getCurrentDate()}
                        readOnly={openShowUser}
                        {...register("date_admission")}
                        defaultValue={
                          selectedItem
                            ? formatDateToInput(selectedItem.date_admission)
                            : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white pr-10"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="status"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Estado
                    </label>
                    <select
                      name="status"
                      id="status"
                      required={true}
                      disabled={openShowUser}
                      {...register("status")}
                      defaultValue={selectedItem ? selectedItem.status : ""}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    >
                      <option value="0">Inactivo</option>
                      <option value="1">Activo</option>
                    </select>
                  </div>
                </div>
                {!openShowUser && (
                  <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
                    <div className="flex flex-col gap-3">
                      <button
                        type="submit"
                        className="linear mt-[30px] w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-navy-500 active:bg-navy-500 dark:bg-navy-500 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                        onSubmit={isEdit ? onUpdateItem : onSubmitForm}
                      >
                        {isEdit ? "Editar Trabajador" : "Crear Trabajador"}
                      </button>
                    </div>
                  </div>
                )}
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
                ¿Seguro que desea eliminar al trabajador{" "}
                <strong className="font-bold">
                  {itemToDelete.name + " " + itemToDelete.lastname}
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

export default CardTableWorkers;