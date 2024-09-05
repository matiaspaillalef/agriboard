"use client";

import { useState, useEffect, useRef } from "react";
import { formatNumber } from "@/functions/functions";
import ExportarExcel from "@/components/button/ButtonExportExcel";
import ExportarPDF from "@/components/button/ButtonExportPDF";
import { set, useForm } from "react-hook-form";
import "@/assets/css/Table.css";
import {
  PlusIcon,
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import LogoNormal from "@/assets/img/layout/agrisoft_logo.png";
import uploadCloud from "@/assets/img/generic/upload-cloud.jpg";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  deleteGround as deleteGroundApi,
  updateGround,
  createGround,
  getDataGround,
} from "@/app/api/ProductionApi";

import { ProvitionalCL } from "@/app/data/dataProvisionals";
import Rut from "@/components/validateRUT";
import { StateCL } from "@/app/data/dataStates";

const CardTableGround = ({
  data,
  thead,
  columnsClasses = [],
  omitirColumns = [],
  title,
  actions,
  tableId,
  companyID,
  downloadBtn,
  SearchInput,
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

  const [selectedItem, setSelectedItem] = useState(null); // Estado para almacenar los datos del item seleccionado para editar
  const [updateMessage, setUpdateMessage] = useState(null); // Estado para manejar el mensaje de actualización

  //Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({}); // Guarda los datos del item al editar

  const [selectedRegion, setSelectedRegion] = useState("XV");
  const [selectedCity, setSelectedCity] = useState("Arica");

  const [rut, setRut] = useState("");
  const [rutValido, setRutValido] = useState(false);

  const [rol, setRol] = useState(""); // control de item por rol

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
    name_item: "",
  });

  const handleOpenNewUser = () => {
    setIsEdit(false);
    handleOpen();
  };

  const handleOpenEditUser = (user) => {
    setRutValido(true); //Se pasa en true ya que si leventa la ventada de editar es por que los datos ya fueron validados
    setSelectedRegion(user.state);
    setIsEdit(true);
    setFormData(user);
    setSelectedItem(user);
    handleOpen(user);

    //Cuando se habra el modal de edición valida si es un usuario con rol de administrador (1)
    const userDataString = sessionStorage.getItem("userData");
    const userData = JSON.parse(userDataString);
    const userRol = userData.rol;

    setRol(userRol);
  };

  const handleOpen = (user) => {
    reset();
    setSelectedItem(user); // Actualiza el estado con los datos del usuario seleccionado
    setOpen(!open);
  };

  const onUpdateItem = async (data) => {
    try {
      if (!data || !data.id) {
        throw new Error(
          "Los datos para actualizar son inválidos o incompletos."
        );
      }

      // Convertir cadenas vacías en null para latitude y longitude
      const updatedData = {
        ...data,
        latitude: data.latitude !== "" ? data.latitude : null,
        longitude: data.longitude !== "" ? data.longitude : null,
      };

      const updateItemApi = await updateGround(updatedData);

      //console.log(updateItemApi);
      if (updateItemApi === "OK") {
        const updatedList = initialData.map((item) =>
          item.id === data.id ? { ...item, ...updatedData } : item
        );

        setInitialData(updatedList);
        setUpdateMessage("Registro actualizado correctamente");
        setOpen(false);
      } else {
        setUpdateMessage("No se pudo actualizar el registro.");
      }
    } catch (error) {
      console.error(error);
      setUpdateMessage("Error al intentar actualizar el registro.");
    }
  };

  const handleOpenAlert = (index, id, name_item) => {
    setItemToDelete({ index, id, name_item });
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
    setItemToDelete({ index: null, id: null, name_item: "" });
  };

  const handlerRemove = async () => {
    const { index, id } = itemToDelete;

    try {
      //if (userConfirmed) {
      const deleteItem = await deleteGroundApi(id);

      // Elimina la fila del front-end si la eliminación fue exitosa
      if (deleteItem === "OK") {
        const updatedData = [...initialData];
        updatedData.splice(index, 1);
        setInitialData(updatedData);
        setOpenAlert(false);
        setUpdateMessage("Registro eliminado correctamente");
      } else {
        setUpdateMessage(
          "Error al eliminar el registro. Inténtalo nuevamente."
        );
      }
    } catch (error) {
      console.error(error);
      // Manejo de errores
      setUpdateMessage("Ocurrió un error al intentar eliminar el registro.");
    }
  };

  // Creación de campo
  const onSubmitForm = async (data) => {
    try {
      if (
        !data ||
        !data.name ||
        !data.state ||
        !data.city ||
        !data.address ||
        !data.zone ||
        !data.company_id ||
        !data.status
      ) {
        throw new Error("Los datos para crear el registro son incompletos.");
      }

      const createItem = await createGround(data);

      console.log(createItem);

      if (createItem === "OK") {
        const updatedData = [...initialData, data];

        setInitialData(updatedData);
        setOpen(false);
        setUpdateMessage("Registro creado correctamente");
      } else {
        setUpdateMessage(createItem || "No se pudo crear el registro");
      }
    } catch (error) {
      console.error("Error al crear el registro:", error);
      setUpdateMessage("Error al intentar crear el registro");
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

  const totalPages = Math.ceil(
    (initialData ? initialData.length : 0) / itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = initialData
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
          <PlusIcon className="w-5 h-5" />
          Nuevo campo
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

            {Array.isArray(initialData) && initialData.length > 0 && (
              <div className="buttonsActions mb-3 flex gap-2 w-full flex-col md:w-auto md:flex-row md:gap-5">
                {downloadBtn && (
                  <ExportarExcel
                    data={initialData}
                    filename="campos"
                    sheetname="campos"
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
            )}
          </div>

          <div className="h-full overflow-x-scroll max-h-dvh">
            <table
              role="table"
              className="mt-8 h-max w-full"
              variant="simple"
              color="gray-500"
              mb="24px"
              id="tablaCampos"
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
                {/* ojo aca Javi, ya que me envias un mensaje de error y nunca llega null o undefined, llega el mensajem, por eso comprueba si es un array o no */}
                {Array.isArray(initialData) && initialData.length > 0 ? (
                  currentItems.map((row, index) => (
                    <tr key={index} role="row">
                      {Object.keys(row).map((key, rowIndex) => {
                        if (omitirColumns.includes(key)) {
                          return null; // Omitir la columna si está en omitirColumns
                        }

                        return (
                          <td
                            key={rowIndex}
                            role="cell"
                            className={`pt-[14px] pb-3 text-[14px] px-5 min-w-[150px] ${
                              index % 2 !== 0
                                ? "bg-lightPrimary dark:bg-navy-900"
                                : ""
                            } ${columnsClasses[rowIndex] || "text-left"}`}
                          >
                            <div className="text-base font-medium text-navy-700 dark:text-white">
                              {key === "status" ? (
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
                          className={`pt-[14px] pb-3 text-[14px] px-5 min-w-[100px] ${
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
                                row.name ? row.name : "",
                                row.lastname ? row.lastname : ""
                              );
                            }}
                          >
                            <TrashIcon className="w-6 h-6" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-4">No se encontraron registros.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {initialData.length > 0 && pagination.length > 1 && (
            <div className="flex items-center justify-between mt-5">
              <div className="flex items-center gap-5">
                <p className="text-sm text-gray-800 dark:text-white">
                  Mostrando {indexOfFirstItem + 1} a{" "}
                  {indexOfLastItem > initialData.length
                    ? initialData.length
                    : indexOfLastItem}{" "}
                  de {initialData.length} registros
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
              {isEdit ? "Editar Campo" : "Crear Campo"}
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
                <div
                  className={`mb-3 grid gap-3 ${
                    isEdit
                      ? "grid-cols-2 lg:grid-cols-2"
                      : "grid-cols-12 lg:grid-cols-2"
                  } `}
                ></div>
                <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
                  <div className="flex flex-col gap-3 ">
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Nombre campo
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required={true}
                      {...register("name")}
                      defaultValue={selectedItem ? selectedItem.name : ""}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    />
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
                      //value={selectedCity}
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

                <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-1">
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="address"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Dirección
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="address"
                        id="address"
                        required={true}
                        {...register("address")}
                        defaultValue={selectedItem ? selectedItem.address : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white pr-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="latitude"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Latitud
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="latitude"
                        id="latitude"
                        {...register("latitude")}
                        defaultValue={selectedItem ? selectedItem.latitude : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white pr-10"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="longitude"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Longitud
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="logitude"
                        id="longitude"
                        {...register("longitude")}
                        defaultValue={
                          selectedItem ? selectedItem.longitude : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white pr-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="zone"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Zona
                    </label>
                    <select
                      name="zone"
                      id="zone"
                      required={true}
                      {...register("zone")}
                      defaultValue={selectedItem ? selectedItem.zone : ""}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    >
                      <option value="Norte">Norte</option>
                      <option value="Centro">Centro</option>
                      <option value="Sur">Sur</option>
                    </select>
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
                      {...register("status")}
                      defaultValue={selectedItem ? selectedItem.status : ""}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    >
                      <option value="0">Inactivo</option>
                      <option value="1">Activo</option>
                    </select>
                  </div>
                </div>

                {/*rol == 1 ? (
                <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-1 ">
                <div className="flex flex-col gap-3">
                    <label
                      htmlFor="company_id"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Campo
                    </label>
                    <select
                      name="company_id"
                      id="company_id"
                      {...register("company_id")}
                      defaultValue={selectedItem ? selectedItem.company_id : ""}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    >
                      {datosCompanies.map((campos, index) => {
                        return (
                          <option key={index} value={campos.id}>
                            {campos.name_company}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  </div>
                ) : (
                  <input
                  type="hidden"
                  name="company_id"
                  {...register("company_id")}
                  
                  defaultValue={selectedItem ? selectedItem.company_id : companyID}
                />
                ) */}

                <input
                  type="hidden"
                  name="company_id"
                  {...register("company_id")}
                  defaultValue={
                    selectedItem ? selectedItem.company_id : companyID
                  }
                />

                <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
                  <div className="flex flex-col gap-3">
                    <button
                      type="submit"
                      className="linear mt-[30px] w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-navy-500 active:bg-navy-500 dark:bg-navy-500 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                      //onSubmit={onUpdateItem}
                      onSubmit={isEdit ? onUpdateItem : onSubmitForm}
                    >
                      {isEdit ? "Editar Campo" : "Crear Campo"}
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
                ¿Seguro que desea eliminar la campo{" "}
                <strong className="font-bold">{itemToDelete.name_item}</strong>?
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

export default CardTableGround;
