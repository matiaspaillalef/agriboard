"use client";

import { useState, useEffect, useRef } from "react";
import { formatNumber } from "@/functions/functions";
import ExportarExcel from "@/components/button/ButtonExportExcel";
import { useForm } from "react-hook-form";
import "@/assets/css/Table.css";
import {
  PlusIcon,
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  deleteShift as deleteShiftApi,
  updateShift,
  createShift,
  getDataShifts,
} from "@/app/api/ManagementPeople";

const CardTableShifts = ({
  data,
  thead,
  columnsClasses = [],
  omitirColumns = [],
  title,
  actions,
  companyID,
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

  //console.log(data);
  const [initialData, setInitialData] = useState();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  //Accordions
  const [openAcc, setOpenAcc] = useState(false);
  const handleOpenAcc = (value) => setOpenAcc(openAcc === value ? 0 : value);

  const [selectedItem, setSelectedItem] = useState(null); // Estado para almacenar los datos del item seleccionado para editar
  const [updateMessage, setUpdateMessage] = useState(null); // Estado para manejar el mensaje de actualización

  //Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({}); // Guarda los datos del item al editar

  const [openAlert, setOpenAlert] = useState(false);

  const [isShowSchedule, setIsShowSchedule] = useState(false);

  const [itemToDelete, setItemToDelete] = useState({
    index: null,
    id: null,
    name: "",
  });

  const handleOpenNewUser = () => {
    setIsEdit(false);
    handleOpen();
    setIsShowSchedule(false);
  };

  const handleOpenEditUser = (user) => {
    setIsEdit(true);
    setFormData(user);
    setSelectedItem(user);
    handleOpen(user);
    setIsShowSchedule(false);
  };

  const handleOpen = (user) => {
    reset();
    setSelectedItem(user); // Actualiza el estado con los datos del usuario seleccionado
    setOpen(!open);
  };

  //Para cargar los datos de lado del cliente
  useEffect(() => {
    if (data && data.length > 0) {
      setInitialData(data);
    }
  }, [data]);

  const onUpdateItem = async (data) => {
    //console.log("Datos de la empresa a actualizar:", data);
    try {
      const updateShiftApi = await updateShift(data);
      // Elimina la fila del front-end
      if (updateShiftApi.code === "OK") {

        const updatedData = initialData.map((item) =>
          item.id == data.id
            ? {
              id: data.id,
              name: data.name,
              status: data.status,
            }
            : item
        );

        setInitialData(updatedData);

        const newDataFetch = await getDataShifts(companyID);

        if(newDataFetch.code  === "OK"){

          setInitialData(newDataFetch.shifts);

        }else if (newDataFetch.code === "ERROR") {

          setUpdateMessage(newDataFetch.mensaje);

        }

        setUpdateMessage(updateShiftApi.mensaje);

      }else if (updateShiftApi.code === "ERROR") {

        setUpdateMessage(updateShiftApi.mensaje);

      }

      setOpen(false);

    } catch (error) {
      console.error(error);
      // Manejo de errores
      setUpdateMessage(
        "Error al intentar actualizar el turno. Inténtalo nuevamente."
      );
    }
  };

  const handleShowSchedule = (user) => {
    setIsShowSchedule(true);
    setFormData(user);
    setSelectedItem(user);
    handleOpen(user);
  };

  const handleOpenAlert = (index, id, name) => {
    setItemToDelete({ index, id, name });
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
    setItemToDelete({ index: null, id: null, name: "" });
  };

  const handlerRemove = async () => {
    const { index, id } = itemToDelete;

    try {
      //if (userConfirmed) {
      const deleteShift = await deleteShiftApi(id);
      
      const newDataFetch = await getDataShifts(companyID);

      // Elimina la fila del front-end si la eliminación fue exitosa
      if (deleteShift.code === "OK") {

        const updatedData = [...initialData];
        updatedData.splice(index, 1);
        setInitialData(updatedData);

        if(newDataFetch.code  === "OK"){

          setInitialData(newDataFetch.shifts);

        }else if (newDataFetch.code === "ERROR") {

          setUpdateMessage(deleteShift.mensaje);

        }

        setOpenAlert(false);
        setUpdateMessage(deleteShift.mensaje);

      }else if (deleteShift.code === "ERROR") {

        setUpdateMessage(deleteShift.mensaje);

      }
    } catch (error) {
      console.error(error);
      // Manejo de errores
      setUpdateMessage("Ocurrió un error al intentar eliminar el turno.");
    }
  };

  // Creación de empresa
  const onSubmitForm = async (data) => {

    console.log(data);

    try {
      const createShiftapi = await createShift(data);

      // Agrega la fila del front-end
      if (createShiftapi.code == "OK") {

        const updatedData = [...initialData, data]; // Agregar el nuevo usuario a la lista de datos existente

        setInitialData(updatedData);

        //Hago este fech para traer el ID del usuario recien creado y trayendo la data actualizada de la BD
        const newDataFetch = await getDataShifts(companyID);


        if (newDataFetch.code === "OK") {

          setInitialData(newDataFetch.shifts);

        } else if (newDataFetch.code === "ERROR") {

          setUpdateMessage(newDataFetch.mensaje);

        }

        
        setUpdateMessage(createShiftapi.mensaje);

      } else if (createShiftapi.code === "ERROR") {

        setUpdateMessage(createShiftapi.mensaje);

      }

      setOpen(false);

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

  return (
    <>
      {updateMessage && ( // Mostrar el mensaje si updateMessage no es null
        <div
          className={`bg-${updateMessage.includes("correctamente") ? "green" : "red"
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
          Nuevo turno
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
            className={`relative flex items-center ${title ? "justify-between" : "justify-end"
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
                    filename="empresas"
                    sheetname="empresas"
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
                              className={`text-xs tracking-wide text-gray-600 ${columnsClasses[index] || "text-start"
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
                            className={`pt-[14px] pb-3 text-[14px] px-5 ${index % 2 !== 0
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
                              ) : (
                                formatNumber(row[key])
                              )}
                            </div>
                          </td>
                        );
                      })}

                      <td
                        className={`pt-[14px] pb-3 text-[14px] px-5 ${index % 2 !== 0
                            ? "bg-lightPrimary dark:bg-navy-900"
                            : ""
                          }`}
                      >
                        <button
                          type="button"
                          className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-white cursor-pointer"
                          onClick={() => handleShowSchedule(row)}
                        >
                          <EyeIcon className="w-5 h-5"></EyeIcon> Ver horarios
                        </button>
                      </td>

                      {actions && (
                        <td
                          colSpan={columnLabels.length}
                          className={`pt-[14px] pb-3 text-[14px] px-5 ${index % 2 !== 0
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
                                row.name ? row.name : ""
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
                  className={`p-1 bg-gray-200 dark:bg-navy-900 rounded-md ${currentPage === 1 && "hidden"
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
                    className={`${currentPage === page
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
              <XMarkIcon className="w-5 h-5" />
            </button>
            <DialogHeader className="dark:text-white">
              {isShowSchedule
                ? "Horarios"
                : isEdit
                  ? "Editar turno"
                  : "Crear turno"}
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
                {!isShowSchedule && (
                  <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
                    <div className="flex flex-col gap-3 ">
                      <label
                        htmlFor="name"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Nombre del turno
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required={true}
                        defaultValue={selectedItem ? selectedItem.name : ""}
                        {...register("name")}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>
                  </div>
                )}
                <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-1 bg-lightPrimary p-5 rounded-xl my-5">
                  <div className="flex flex-col gap-0">
                    <Accordion
                      open={openAcc === 1}
                      icon={<ChevronDownIcon className="w-5 h-5" />}
                    >
                      <AccordionHeader
                        onClick={() => handleOpenAcc(1)}
                        className="text-sm font-semibold py-3"
                      >
                        Lunes
                      </AccordionHeader>
                      <AccordionBody>
                        <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
                          <div className="flex flex-col gap-3">
                            <label
                              htmlFor="monday_opening_time"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Hora de apertura
                            </label>
                            <input
                              type="time"
                              name="monday_opening_time"
                              id="monday_opening_time"
                              readOnly={isShowSchedule}
                              //required={true}
                              defaultValue={
                                selectedItem
                                  ? selectedItem.monday_opening_time
                                  : ""
                              }
                              {...register("monday_opening_time")}
                              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            />
                          </div>
                          <div className="flex flex-col gap-3">
                            <label
                              htmlFor="monday_closing_time"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Hora de cierre
                            </label>
                            <input
                              type="time"
                              name="monday_closing_time"
                              id="monday_closing_time"
                              readOnly={isShowSchedule}
                              //required={true}
                              defaultValue={
                                selectedItem
                                  ? selectedItem.monday_closing_time
                                  : ""
                              }
                              {...register("monday_closing_time")}
                              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            />
                          </div>
                        </div>
                      </AccordionBody>
                    </Accordion>
                    <Accordion
                      open={openAcc === 2}
                      icon={<ChevronDownIcon className="w-5 h-5" />}
                    >
                      <AccordionHeader
                        onClick={() => handleOpenAcc(2)}
                        className="text-sm font-semibold py-3"
                      >
                        Martes
                      </AccordionHeader>
                      <AccordionBody>
                        <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
                          <div className="flex flex-col gap-3">
                            <label
                              htmlFor="tuesday_opening_time"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Hora de apertura
                            </label>
                            <input
                              type="time"
                              name="tuesday_opening_time"
                              id="tuesday_opening_time"
                              readOnly={isShowSchedule}
                              //required={true}
                              defaultValue={
                                selectedItem
                                  ? selectedItem.tuesday_opening_time
                                  : ""
                              }
                              {...register("tuesday_opening_time")}
                              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            />
                          </div>
                          <div className="flex flex-col gap-3">
                            <label
                              htmlFor="tuesday_closing_time"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Hora de cierre
                            </label>
                            <input
                              type="time"
                              name="tuesday_closing_time"
                              id="tuesday_closing_time"
                              readOnly={isShowSchedule}
                              //required={true}
                              defaultValue={
                                selectedItem
                                  ? selectedItem.tuesday_closing_time
                                  : ""
                              }
                              {...register("tuesday_closing_time")}
                              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            />
                          </div>
                        </div>
                      </AccordionBody>
                    </Accordion>
                    <Accordion
                      open={openAcc === 3}
                      icon={<ChevronDownIcon className="w-5 h-5" />}
                    >
                      <AccordionHeader
                        onClick={() => handleOpenAcc(3)}
                        className="text-sm font-semibold py-3"
                      >
                        Miércoles
                      </AccordionHeader>
                      <AccordionBody>
                        <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
                          <div className="flex flex-col gap-3">
                            <label
                              htmlFor="wednesday_opening_time"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Hora de apertura
                            </label>
                            <input
                              type="time"
                              name="wednesday_opening_time"
                              id="wednesday_opening_time"
                              readOnly={isShowSchedule}
                              //required={true}
                              defaultValue={
                                selectedItem
                                  ? selectedItem.wednesday_opening_time
                                  : ""
                              }
                              {...register("wednesday_opening_time")}
                              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            />
                          </div>
                          <div className="flex flex-col gap-3">
                            <label
                              htmlFor="wednesday_closing_time"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Hora de cierre
                            </label>
                            <input
                              type="time"
                              name="wednesday_closing_time"
                              id="wednesday_closing_time"
                              readOnly={isShowSchedule}
                              //required={true}
                              defaultValue={
                                selectedItem
                                  ? selectedItem.wednesday_closing_time
                                  : ""
                              }
                              {...register("wednesday_closing_time")}
                              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            />
                          </div>
                        </div>
                      </AccordionBody>
                    </Accordion>
                    <Accordion
                      open={openAcc === 4}
                      icon={<ChevronDownIcon className="w-5 h-5" />}
                    >
                      <AccordionHeader
                        onClick={() => handleOpenAcc(4)}
                        className="text-sm font-semibold py-3"
                      >
                        Jueves
                      </AccordionHeader>

                      <AccordionBody>
                        <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
                          <div className="flex flex-col gap-3">
                            <label
                              htmlFor="thursday_opening_time"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Hora de apertura
                            </label>
                            <input
                              type="time"
                              name="thursday_opening_time"
                              id="thursday_opening_time"
                              readOnly={isShowSchedule}
                              //required={true}
                              defaultValue={
                                selectedItem
                                  ? selectedItem.thursday_opening_time
                                  : ""
                              }
                              {...register("thursday_opening_time")}
                              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            />
                          </div>
                          <div className="flex flex-col gap-3">
                            <label
                              htmlFor="thursday_closing_time"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Hora de cierre
                            </label>
                            <input
                              type="time"
                              name="thursday_closing_time"
                              id="thursday_closing_time"
                              readOnly={isShowSchedule}
                              //required={true}
                              defaultValue={
                                selectedItem
                                  ? selectedItem.thursday_closing_time
                                  : ""
                              }
                              {...register("thursday_closing_time")}
                              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            />
                          </div>
                        </div>
                      </AccordionBody>
                    </Accordion>
                    <Accordion
                      open={openAcc === 5}
                      icon={<ChevronDownIcon className="w-5 h-5" />}
                    >
                      <AccordionHeader
                        onClick={() => handleOpenAcc(5)}
                        className="text-sm font-semibold py-3"
                      >
                        Viernes
                      </AccordionHeader>

                      <AccordionBody>
                        <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
                          <div className="flex flex-col gap-3">
                            <label
                              htmlFor="friday_opening_time"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Hora de apertura
                            </label>
                            <input
                              type="time"
                              name="friday_opening_time"
                              id="friday_opening_time"
                              readOnly={isShowSchedule}
                              //required={true}
                              defaultValue={
                                selectedItem
                                  ? selectedItem.friday_opening_time
                                  : ""
                              }
                              {...register("friday_opening_time")}
                              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            />
                          </div>
                          <div className="flex flex-col gap-3">
                            <label
                              htmlFor="friday_closing_time"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Hora de cierre
                            </label>
                            <input
                              type="time"
                              name="friday_closing_time"
                              id="friday_closing_time"
                              readOnly={isShowSchedule}
                              //required={true}
                              defaultValue={
                                selectedItem
                                  ? selectedItem.friday_closing_time
                                  : ""
                              }
                              {...register("friday_closing_time")}
                              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            />
                          </div>
                        </div>
                      </AccordionBody>
                    </Accordion>
                    <Accordion
                      open={openAcc === 6}
                      icon={<ChevronDownIcon className="w-5 h-5" />}
                    >
                      <AccordionHeader
                        onClick={() => handleOpenAcc(6)}
                        className="text-sm font-semibold py-3"
                      >
                        Sábado
                      </AccordionHeader>

                      <AccordionBody>
                        <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
                          <div className="flex flex-col gap-3">
                            <label
                              htmlFor="satursday_opening_time"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Hora de apertura
                            </label>
                            <input
                              type="time"
                              name="saturday_opening_time"
                              id="saturday_opening_time"
                              readOnly={isShowSchedule}
                              //required={true}
                              defaultValue={
                                selectedItem
                                  ? selectedItem.saturday_opening_time
                                  : ""
                              }
                              {...register("saturday_opening_time")}
                              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            />
                          </div>
                          <div className="flex flex-col gap-3">
                            <label
                              htmlFor="saturday_closing_time"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Hora de cierre
                            </label>
                            <input
                              type="time"
                              name="saturday_closing_time"
                              id="saturday_closing_time"
                              readOnly={isShowSchedule}
                              //required={true}
                              defaultValue={
                                selectedItem
                                  ? selectedItem.saturday_closing_time
                                  : ""
                              }
                              {...register("saturday_closing_time")}
                              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            />
                          </div>
                        </div>
                      </AccordionBody>
                    </Accordion>
                    <Accordion
                      open={openAcc === 7}
                      icon={<ChevronDownIcon className="w-5 h-5" />}
                    >
                      <AccordionHeader
                        onClick={() => handleOpenAcc(7)}
                        className="text-sm font-semibold py-3"
                      >
                        Domingo
                      </AccordionHeader>

                      <AccordionBody>
                        <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
                          <div className="flex flex-col gap-3">
                            <label
                              htmlFor="sunday_opening_time"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Hora de apertura
                            </label>
                            <input
                              type="time"
                              name="sunday_opening_time"
                              readOnly={isShowSchedule}
                              id="sunday_opening_time"
                              //required={true}
                              defaultValue={
                                selectedItem
                                  ? selectedItem.sunday_opening_time
                                  : ""
                              }
                              {...register("sunday_opening_time")}
                              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            />
                          </div>
                          <div className="flex flex-col gap-3">
                            <label
                              htmlFor="sunday_closing_time"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Hora de cierre
                            </label>
                            <input
                              type="time"
                              name="sunday_closing_time"
                              id="sunday_closing_time"
                              readOnly={isShowSchedule}
                              //required={true}
                              defaultValue={
                                selectedItem
                                  ? selectedItem.sunday_closing_time
                                  : ""
                              }
                              {...register("sunday_closing_time")}
                              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            />
                          </div>
                        </div>
                      </AccordionBody>
                    </Accordion>
                  </div>
                </div>

                {!isShowSchedule && (
                  <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
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

                    <input
                      type="hidden"
                      name="id_company"
                      id="id_company"
                      required={true}
                      {...register("id_company")}
                      defaultValue={companyID}
                    />

                    <div className="flex flex-col gap-3">
                      <button
                        type="submit"
                        className="linear mt-[30px] w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-navy-500 active:bg-navy-500 dark:bg-navy-500 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                        //onSubmit={onUpdateItem}
                        onSubmit={isEdit ? onUpdateItem : onSubmitForm}
                      >
                        {isEdit ? "Editar Turno" : "Crear Turno"}
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
                ¿Seguro que desea eliminar la turno{" "}
                <strong className="font-bold">{itemToDelete.name}</strong>?
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

export default CardTableShifts;
