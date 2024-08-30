"use client";

import { useState, useEffect, useRef } from "react";
import { formatNumber } from "@/functions/functions";
import ExportarExcel from "@/components/button/ButtonExportExcel";
import ExportarPDF from "@/components/button/ButtonExportPDF";
import { get, set, useForm } from "react-hook-form";
import "@/assets/css/Table.css";
import {
  PlusIcon,
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  EyeIcon,
  DocumentDuplicateIcon,
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
  getDataQuality,
  getDataSeasons,
  getDataExporters,
  getDataDispatchGuide,
  updateDispatchGuide,
  createDispatchGuide,
  deleteDispatchGuide,
} from "@/app/api/ProductionApi";

const CardTableDispatchGuide = ({
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

  const [rut, setRut] = useState("");
  const [rutValido, setRutValido] = useState(false);

  const [rol, setRol] = useState(""); // control de item por rol

  const [dataQuality, setDataQuality] = useState([]);
  const [dataSeasons, setDataSeasons] = useState([]);
  const [dataExporters, setDataExporters] = useState([]);

  const [openShowUser, setOpenShowUser] = useState(false);

  useEffect(() => {
    const handleNameItems = async () => {
      const quality = await getDataQuality(companyID);
      const seasons = await getDataSeasons(companyID);
      const exporters = await getDataExporters(companyID);

      setDataQuality(quality);
      setDataSeasons(seasons);
      setDataExporters(exporters);
    };
    handleNameItems();
  }, []);

  /*useEffect(() => {
    if (selectedItem) {
      setSelectedVarieties(selectedItem.varieties || []); // Asegúrate de que sea un arreglo
      //setValue('varieties', selectedItem.varieties || []); // Actualiza el valor del formulario
    }
  }, [selectedItem]);

  const handleCheckboxChange = (id) => {
    setSelectedVarieties((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((varietyId) => varietyId !== id)
        : [...prevSelected, id]
    );
  };*/

  const [openAlert, setOpenAlert] = useState(false);
  const [openAlertClone, setOpenAlertClone] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({
    index: null,
    id: null,
    name_item: "",
  });

  const [itemToClone, setItemToClone] = useState({
    index: null,
    id: null,
    name: "",
    scale: "",
    date: "",
    boxes: "",
    kg_boxes: "",
    specie: "",
    variety: "",
    season: "",
    company_id: "",
  });

  const handleNameVarieties = (ids) => {
    if (!Array.isArray(ids)) {
      console.error("El argumento proporcionado no es un array.");
      return "";
    }

    // Encontrar los nombres de las variedades correspondientes a los IDs
    const names = ids.map((id) => {
      const variety = dataVarieties.find((variety) => variety.id === id);
      return variety ? variety.name : "";
    });

    // Filtrar nombres vacíos y unirlos con comas si hay más de uno
    const filteredNames = names.filter((name) => name !== "");
    return filteredNames.join(filteredNames.length > 1 ? ", " : "");
  };

  const handleNameVarietiesSafe = (ids) => {
    return Array.isArray(ids) ? handleNameVarieties(ids) : "";
  };

  const handleOpenShowUser = (user) => {
    //console.log(user);
    setSelectedItem(user);
    setOpenShowUser(true);
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
    //console.log(user);
    setIsEdit(true);
    setOpenShowUser(false);
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

      const updateItemApi = await updateDispatchGuide(data);
      const dataNew = await getDataDispatchGuide(companyID);

      if (updateItemApi === "OK") {
        const updatedList = initialData.map((item) =>
          item.id === Number(data.id) ? { ...item, ...data } : item
        );

        setInitialData(updatedList);
        setInitialData(dataNew);
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

  const handleOpenAlert = (index, id, client, correlative) => {
    setItemToDelete({ index, id, client, correlative });
    setOpenAlert(true);
    setOpenAlertClone(false);
  };

  const handleCloneAlert = (
    index,
    client,
    date,
    season,
    correlative,
    boxes,
    kg,
    company_id
  ) => {
    setItemToClone({
      client,
      date,
      season,
      correlative,
      boxes,
      kg,
      company_id,
    });
    setOpenAlertClone(true);
    setOpenAlert(false);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
    setOpenAlertClone(false);
    setItemToDelete({ index: null, id: null, client: "", correlative: "" });
  };

  const handleCloseAlertClone = () => {
    setOpenAlertClone(false);
    setOpenAlert(false);
    setItemToDelete({ index: null, name: "", client: "", correlative: "" });
  };

  const handlerRemove = async () => {
    const { index, id } = itemToDelete;
    try {
      //if (userConfirmed) {
      const deleteItem = await deleteDispatchGuide(id);

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

  const handlerClone = async () => {
    const {
      client,
      date,
      season,
      correlative,
      boxes,
      kg,
      quality,
      company_id,
    } = itemToClone;

    try {
      const cloneItem = await createDispatchGuide(itemToClone);
      const dataNew = await getDataDispatchGuide(companyID);

      if (cloneItem === "OK") {
        const updatedData = [...initialData, itemToClone];

        setInitialData(updatedData);
        setInitialData(dataNew);
        setOpenAlertClone(false);
        setUpdateMessage("Registro clonado correctamente");
      } else {
        setUpdateMessage(cloneItem || "No se pudo clonar el registro");
      }
    } catch (error) {
      console.error("Error al clonar el registro:", error);
      setUpdateMessage("Error al intentar clonar el registro");
    }
  };

  // Creación
  const onSubmitForm = async (data) => {
    try {
      const transformedData = {
        id: Number(data.id) || null,
        client: Number(data.client),
        date: data.date,
        quality: Number(data.quality),
        season: Number(data.season),
        correlative: data.correlative,
        boxes: Number(data.boxes),
        kg: Number(data.kg),
        company_id: Number(data.company_id) || null,
      };

      //remove name de transformData
      delete transformedData.name;

      const createItem = await createDispatchGuide(transformedData);
      const dataNew = await getDataDispatchGuide(companyID);

      if (createItem === "OK") {
        const updatedData = [...initialData, transformedData];

        setInitialData(updatedData); //Actualizamos la visualización de la tabla
        setInitialData(dataNew); //Actualizamos la visualizacion pero con el id, quizas sea necesario quitar el de ahi arriba
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

  //const totalPages = Math.ceil(initialData.length / itemsPerPage);
  const totalPages = Math.ceil(
    (initialData ? initialData.length : 0) / itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = initialData.slice(indexOfFirstItem, indexOfLastItem);

  const pagination = Array.from({ length: totalPages }, (_, i) => i + 1);

  //Mapero de datos para la tabla
  const dataMap = {
    quality: dataQuality,
    client: dataExporters,
    season: dataSeasons,
  };

  const getNameByKey = (key, value) => {
    const data = dataMap[key];
    return data?.find((item) => item.id === value)?.name || value;
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `${day} de ${month} de ${year}`;
  };

  function formatDateForInput(dateString) {
    if (!dateString) return "";
    return dateString.substring(0, 10);
  }

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
          Nuevo registro
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
                    filename="Tipos de recolección"
                    sheetname="Tipos de recolección"
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
                {/* ojo aca Javi, ya que me envias un mensaje de error y nunca llega null o undefined, llega el mensajem, por eso comprueba si es un array o no, el currentItems es de la paginación */}
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
                              ) : key === "date" ? (
                                formatDate(row[key]) // Formatea la fecha aquí
                              ) : (
                                getNameByKey(key, row[key]) ||
                                formatNumber(row[key])
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
                            className="text-sm font-semibold text-gray-800 dark:text-white mr-2"
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
                            <PencilSquareIcon className="w-6 h-6" />
                          </button>

                          <button
                            type="button"
                            className="text-sm font-semibold text-gray-800 dark:text-white"
                            onClick={() => {
                              //console.log('clone',row);
                              handleCloneAlert(
                                index,
                                //row.id,
                                row.client,
                                row.date,
                                row.season,
                                row.correlative,
                                row.boxes,
                                row.kg,
                                row.quality,
                                Number(companyID)
                              );
                            }}
                          >
                            <DocumentDuplicateIcon className="w-6 h-6" />
                          </button>

                          <button
                            id="remove"
                            type="button"
                            onClick={() => {
                              handleOpenAlert(
                                index,
                                row.id,
                                row.client
                                  ? getNameByKey("client", row.client)
                                  : "",
                                row.correlative
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
              <XMarkIcon className="w-6 h-6" />
            </button>
            <DialogHeader className="dark:text-white">
              {openShowUser
                ? "Datos del registro"
                : isEdit
                ? "Editar registro"
                : "Nuevo registro"}
            </DialogHeader>
            <DialogBody>
              {!openShowUser ? (
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
                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="client"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Cliente
                      </label>
                      <select
                        name="client"
                        id="client"
                        required={true}
                        {...register("client")}
                        defaultValue={selectedItem ? selectedItem.client : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      >
                        {Array.isArray(dataExporters) &&
                        dataExporters.length > 0 ? (
                          dataExporters.map(
                            (exporter) =>
                              exporter.status != 0 && (
                                <option key={exporter.id} value={exporter.id}>
                                  {exporter.name}
                                </option>
                              )
                          )
                        ) : (
                          <option value="">No hay clientes</option>
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="corrertive"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Correlativo
                      </label>
                      <input
                        type="text"
                        name="correlative"
                        id="correlative"
                        required={true}
                        {...register("correlative")}
                        defaultValue={
                          selectedItem ? selectedItem.correlative : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="date"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Fecha
                      </label>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        required={true}
                        {...register("date")}
                        defaultValue={
                          selectedItem
                            ? formatDateForInput(selectedItem.date)
                            : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="quality"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Calidad
                      </label>
                      <select
                        name="quality"
                        id="quality"
                        required={true}
                        {...register("quality")}
                        defaultValue={selectedItem ? selectedItem.quality : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      >
                        {Array.isArray(dataQuality) &&
                        dataQuality.length > 0 ? (
                          dataQuality.map(
                            (quality) =>
                              quality.status != 0 && (
                                <option key={quality.id} value={quality.id}>
                                  {quality.name}
                                </option>
                              )
                          )
                        ) : (
                          <option value="">No hay calidades</option>
                        )}
                      </select>
                    </div>
                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="season"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Temporada
                      </label>
                      <select
                        name="season"
                        id="season"
                        required={true}
                        {...register("season")}
                        defaultValue={selectedItem ? selectedItem.season : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      >
                        {Array.isArray(dataSeasons) &&
                        dataSeasons.length > 0 ? (
                          dataSeasons.map(
                            (season) =>
                              season.status != 0 && (
                                <option key={season.id} value={season.id}>
                                  {season.name}
                                </option>
                              )
                          )
                        ) : (
                          <option value="">No hay temporadas</option>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="boxes"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        N. de Cajas
                      </label>
                      <input
                        type="number"
                        name="boxes"
                        id="boxes"
                        required={true}
                        {...register("boxes")}
                        defaultValue={selectedItem ? selectedItem.boxes : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="kg_boxes"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Kg
                      </label>
                      <input
                        type="number"
                        name="kg"
                        id="kg"
                        required={true}
                        step="0.01"
                        {...register("kg")}
                        defaultValue={selectedItem ? selectedItem.kg : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>
                  </div>

                  <input
                    type="hidden"
                    name="company_id"
                    {...register("company_id")}
                    defaultValue={companyID}
                  />
                  <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
                    <div className="flex flex-col gap-3">
                      <button
                        type="submit"
                        className="linear mt-[30px] w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-navy-500 active:bg-navy-500 dark:bg-navy-500 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                        //onSubmit={onUpdateItem}
                        onSubmit={isEdit ? onUpdateItem : onSubmitForm}
                      >
                        {isEdit ? "Editar" : "Crear"}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-md font-semibold text-gray-800 dark:text-white">
                    <strong>
                      {getNameByKey("client", selectedItem.client, dataMap)}
                    </strong>
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Fecha:</strong>{" "}
                    {formatDate(selectedItem.date, dataMap)}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Temporada:</strong>{" "}
                    {getNameByKey("season", selectedItem.season, dataMap)}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Correlativo:</strong> {selectedItem.correlative}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Cajas:</strong> {selectedItem.boxes}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Kg:</strong> {selectedItem.kg}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Calidad:</strong>{" "}
                    {getNameByKey("quality", selectedItem.quality, dataMap)}
                  </p>
                </div>
              )}
            </DialogBody>
          </Dialog>

          <Dialog
            open={openAlert || openAlertClone}
            handler={handleCloseAlert || handleCloseAlertClone}
            size="xs"
            className="p-5 lg:max-w-[25%] dark:bg-navy-900"
          >
            <>
              <h2 className="text-center mb-7 text-xl mt-5 dark:text-white">
                ¿Seguro que desea {openAlert ? "eliminar" : "clonar"} la
                recolección{" "}
                <strong className="font-bold">
                  {openAlert
                    ? getNameByKey("client", itemToClone.client, dataMap)
                    : getNameByKey("client", itemToClone.client, dataMap)}
                </strong>{" "}
                con el correlativo{" "}
                <strong className="font-bold">
                  {openAlert
                    ? itemToDelete.correlative
                    : itemToClone.correlative}
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
                onClick={openAlert ? handlerRemove : handlerClone}
                className={`${
                  openAlert ? "bg-red-500" : "bg-blueTertiary"
                } text-white flex items-center justify-center px-4 py-2 rounded m-auto`}
              >
                {openAlert ? (
                  <>
                    <XMarkIcon className="text-white w-5 h-5" /> Eliminar
                  </>
                ) : (
                  <>
                    <DocumentDuplicateIcon className="text-white w-5 h-5" />{" "}
                    Clonar
                  </>
                )}
              </button>
            </>
          </Dialog>
        </>
      )}
    </>
  );
};

export default CardTableDispatchGuide;
