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
  getDataVarieties,
  getDataSpecies,
  getDataQuality,
  getDataSeasons,
  getDataSectorBarracks,
  getDataAttributesSector,
  updateAttributesSector,
  createAttributesSector,
  deleteAttributesSector,
} from "@/app/api/ProductionApi";

const CardTableSectorAttributes = ({
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

  const [dataSpecies, setDataSpecies] = useState([]);
  const [dataVarieties, setDataVarieties] = useState([]);
  const [dataQuality, setDataQuality] = useState([]);
  const [dataSeasons, setDataSeasons] = useState([]);
  const [dataScale, setDataScale] = useState([]);
  const [selectedVarieties, setSelectedVarieties] = useState([]);
  const [dataSectorBarracks, setDataSectorBarracks] = useState([]);

  const [openShowUser, setOpenShowUser] = useState(false);

  useEffect(() => {
    const handleNameVarieties = async () => {
      const varieties = await getDataVarieties(companyID);
      const species = await getDataSpecies(companyID);
      const quality = await getDataQuality(companyID);
      const seasons = await getDataSeasons(companyID);
      const sector = await getDataSectorBarracks(companyID);

      setDataVarieties(varieties);
      setDataSpecies(species);
      setDataQuality(quality);
      setDataSeasons(seasons);
      setDataSectorBarracks(sector);
    };
    handleNameVarieties();
  }, []);

  useEffect(() => {
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
  };

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

      const updatedData = { ...data, varieties: selectedVarieties };

      const updateItemApi = await updateAttributesSector(updatedData);
      const dataNew = await getDataAttributesSector(companyID);

      if (updateItemApi === "OK") {
        const updatedList = initialData.map((item) =>
          item.id === Number(data.id) ? { ...item, ...updatedData } : item
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

  const handleOpenAlert = (index, id, name_item) => {
    setItemToDelete({ index, id, name_item });
    setOpenAlert(true);
    setOpenAlertClone(false);
  };

  const handleCloneAlert = (
    index,
    name,
    scale,
    quality,
    date,
    boxes,
    kg_boxes,
    specie,
    variety,
    season,
    company_id
  ) => {
    setItemToClone({
      name,
      scale,
      quality,
      date,
      boxes,
      kg_boxes,
      specie,
      variety,
      season,
      company_id,
    });
    setOpenAlertClone(true);
    setOpenAlert(false);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
    setOpenAlertClone(false);
    setItemToDelete({ index: null, id: null, name_item: "" });
  };

  const handleCloseAlertClone = () => {
    setOpenAlertClone(false);
    setOpenAlert(false);
    setItemToDelete({ index: null, name: "", varieties: "", status: "" });
  };

  const handlerRemove = async () => {
    const { index, id } = itemToDelete;
    try {
      //if (userConfirmed) {
      const deleteItem = await deleteAttributesSector(id);

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
      scale,
      date,
      boxes,
      quality,
      kg_boxes,
      specie,
      variety,
      season,
      company_id,
    } = itemToClone;

    delete itemToClone.name;

    console.log(itemToClone);

    try {
      const cloneItem = await createAttributesSector(itemToClone);
      const dataNew = await getDataAttributesSector(companyID);

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
        season: Number(data.season),
        sector: Number(data.sector),
        specie: Number(data.specie),
        variety: Number(data.variety),
        year_harvest: data.year_harvest,
        ha_productivas: data.ha_productivas,
        hileras: data.hileras,
        plants: data.plants,
        min_daily_frecuency: data.min_daily_frecuency,
        max_daily_frecuency: data.max_daily_frecuency,
        harvest_end: Number(data.harvest_end),
        stimation_good: data.stimation_good,
        stimation_regular: data.stimation_regular,
        stimation_bad: data.stimation_bad,
        stimation_replant_kg: data.stimation_replant_kg,
        surface: data.surface,
        interrow_density: data.interrow_density,
        row_density: data.row_density,
        quantity_plants_ha: data.quantity_plants_ha,
        clasification: data.clasification,
        rotation: data.rotation,
        kg_sector: data.kg_sector,
        kg_hectares: data.kg_hectares,
        kg_plants: data.kg_plants,
        porc_regular: data.porc_regular,
        porc_replant: data.porc_replant,
        company_id: Number(companyID),
      };

      const createItem = await createAttributesSector(transformedData);
      const dataNew = await getDataAttributesSector(companyID);

      if (createItem === "OK") {
        const updatedData = [...initialData, transformedData];

        setInitialData(updatedData); //Actualizamos la visualización de la tabla
        setInitialData(dataNew); //Actualizamos la visualizacion pero con el id, quizas sea necesario quitar el de ahi arriba
        setOpen(false);
        setSelectedVarieties([]);
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
    variety: dataVarieties,
    specie: dataSpecies,
    quality: dataQuality,
    sector: dataSectorBarracks,
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
                                row.name
                                  ? row.name
                                  : getNameByKey("scale", row.scale),
                                row.scale ? row.scale : "",
                                row.quality ? row.quality : "",
                                row.date ? row.date : "",
                                row.boxes ? row.boxes : "",
                                row.kg_boxes ? row.kg_boxes : "",
                                row.specie ? row.specie : "",
                                row.variety ? row.variety : "",
                                row.season ? row.season : "",
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
                                row.scale
                                  ? getNameByKey("scale", row.scale)
                                  : ""
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
                    <td className="py-4" colSpan={4}>
                      No se encontraron registros.
                    </td>
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
                  <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
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

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="sector"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Sector
                      </label>
                      <select
                        name="sector"
                        id="sector"
                        required={true}
                        {...register("sector")}
                        defaultValue={selectedItem ? selectedItem.sector : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      >
                        {Array.isArray(dataSectorBarracks) &&
                        dataSectorBarracks.length > 0 ? (
                          dataSectorBarracks.map(
                            (sector) =>
                              sector.status != 0 && (
                                <option key={sector.id} value={sector.id}>
                                  {sector.name}
                                </option>
                              )
                          )
                        ) : (
                          <option value="">No hay sectores</option>
                        )}
                      </select>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="specie"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Especie
                      </label>
                      <select
                        name="specie"
                        id="specie"
                        required={true}
                        {...register("specie")}
                        defaultValue={selectedItem ? selectedItem.specie : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      >
                        {Array.isArray(dataSpecies) &&
                        dataSpecies.length > 0 ? (
                          dataSpecies.map(
                            (specie) =>
                              specie.status != 0 && (
                                <option key={specie.id} value={specie.id}>
                                  {specie.name}
                                </option>
                              )
                          )
                        ) : (
                          <option value="">No hay especies</option>
                        )}
                      </select>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="variety"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Variedad
                      </label>
                      <select
                        name="variety"
                        id="variety"
                        required={true}
                        {...register("variety")}
                        defaultValue={selectedItem ? selectedItem.variety : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      >
                        {Array.isArray(dataSpecies) &&
                        dataSpecies.length > 0 ? (
                          dataVarieties.map(
                            (variety) =>
                              variety.status != 0 && (
                                <option key={variety.id} value={variety.id}>
                                  {variety.name}
                                </option>
                              )
                          )
                        ) : (
                          <option value="">No hay variedades</option>
                        )}
                      </select>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="year_harvest"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Año de cosecha
                      </label>
                      <input
                        type="date"
                        name="year_harvest"
                        id="year_harvest"
                        required={true}
                        {...register("year_harvest")}
                        defaultValue={
                          selectedItem
                            ? formatDateForInput(selectedItem.year_harvest)
                            : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="ha_productivas"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Ha Productivas
                      </label>
                      <input
                        type="number"
                        name="ha_productivas"
                        id="ha_productivas"
                        required={true}
                        step={0.01}
                        {...register("ha_productivas")}
                        defaultValue={
                          selectedItem ? selectedItem.ha_productivas : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="hileras"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Hileras
                      </label>
                      <input
                        type="number"
                        name="hileras"
                        id="hileras"
                        required={true}
                        {...register("hileras")}
                        defaultValue={selectedItem ? selectedItem.hileras : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="plants"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Plantas
                      </label>
                      <input
                        type="number"
                        name="plants"
                        id="plants"
                        required={true}
                        {...register("plants")}
                        defaultValue={selectedItem ? selectedItem.plants : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="min_daily_frecuency"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Frecuencia mínima diaria
                      </label>
                      <input
                        type="number"
                        name="min_daily_frecuency"
                        id="min_daily_frecuency"
                        required={true}
                        {...register("min_daily_frecuency")}
                        defaultValue={
                          selectedItem ? selectedItem.min_daily_frecuency : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="max_daily_frecuency"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Frecuencia máxima diaria
                      </label>
                      <input
                        type="number"
                        name="max_daily_frecuency"
                        id="max_daily_frecuency"
                        required={true}
                        {...register("max_daily_frecuency")}
                        defaultValue={
                          selectedItem ? selectedItem.max_daily_frecuency : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="harvest_end"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Fin de cosecha
                      </label>
                      <select
                        name="harvest_end"
                        id="harvest_end"
                        {...register("harvest_end")}
                        defaultValue={
                          selectedItem ? selectedItem.harvest_end : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      >
                        <option value="0">No</option>
                        <option value="1">Si</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="stimation_good"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Estimación de buena
                      </label>
                      <input
                        type="number"
                        name="stimation_good"
                        id="stimation_good"
                        {...register("stimation_good")}
                        defaultValue={
                          selectedItem ? selectedItem.stimation_good : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="stimation_regular"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Estimación de regular
                      </label>
                      <input
                        type="number"
                        name="stimation_regular"
                        id="stimation_regular"
                        {...register("stimation_regular")}
                        defaultValue={
                          selectedItem ? selectedItem.stimation_regular : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="stimation_bad"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Estimación de mala
                      </label>
                      <input
                        type="number"
                        name="stimation_bad"
                        id="stimation_bad"
                        {...register("stimation_bad")}
                        defaultValue={
                          selectedItem ? selectedItem.stimation_bad : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="stimation_replant_kg"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Estimación de replante
                      </label>
                      <input
                        type="number"
                        name="stimation_replant_kg"
                        id="stimation_replant_kg"
                        step={0.01}
                        {...register("stimation_replant_kg")}
                        defaultValue={
                          selectedItem ? selectedItem.stimation_replant_kg : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="surface"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Superficie
                      </label>
                      <input
                        type="number"
                        name="surface"
                        id="surface"
                        step={0.01}
                        {...register("surface")}
                        defaultValue={selectedItem ? selectedItem.surface : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="interrow_density"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Densidad entre hileras
                      </label>
                      <input
                        type="number"
                        name="interrow_density"
                        id="interrow_density"
                        step={0.01}
                        {...register("interrow_density")}
                        defaultValue={
                          selectedItem ? selectedItem.interrow_density : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="row_density"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Densidad de hileras
                      </label>
                      <input
                        type="number"
                        name="row_density"
                        id="row_density"
                        step={0.01}
                        {...register("row_density")}
                        defaultValue={
                          selectedItem ? selectedItem.row_density : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="quantity_plants_ha"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Cantidad de plantas por Ha
                      </label>
                      <input
                        type="number"
                        name="quantity_plants_ha"
                        id="quantity_plants_ha"
                        step={0.01}
                        {...register("quantity_plants_ha")}
                        defaultValue={
                          selectedItem ? selectedItem.quantity_plants_ha : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="clasification"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Clasificación
                      </label>
                      <input
                        type="text"
                        name="clasification"
                        id="clasification"
                        {...register("clasification")}
                        defaultValue={
                          selectedItem ? selectedItem.clasification : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="rotation"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Rotación
                      </label>
                      <input
                        type="number"
                        name="rotation"
                        id="rotation"
                        step={0.01}
                        {...register("rotation")}
                        defaultValue={selectedItem ? selectedItem.rotation : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="kg_sector"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Kg por sector
                      </label>
                      <input
                        type="number"
                        name="kg_sector"
                        id="kg_sector"
                        step={0.01}
                        {...register("kg_sector")}
                        defaultValue={
                          selectedItem ? selectedItem.kg_sector : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="kg_hectares"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Kg por hectáreas
                      </label>
                      <input
                        type="number"
                        name="kg_hectares"
                        id="kg_hectares"
                        step={0.01}
                        {...register("kg_hectares")}
                        defaultValue={
                          selectedItem ? selectedItem.kg_hectares : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="kg_plants"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Kg por plantas
                      </label>
                      <input
                        type="number"
                        name="kg_plants"
                        id="kg_plants"
                        step={0.01}
                        {...register("kg_plants")}
                        defaultValue={
                          selectedItem ? selectedItem.kg_plants : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="porc_regular"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Porcentaje de regular
                      </label>
                      <input
                        type="number"
                        name="porc_regular"
                        id="porc_regular"
                        step={0.01}
                        {...register("porc_regular")}
                        defaultValue={
                          selectedItem ? selectedItem.porc_regular : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="porc_replant"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Porcentaje de replante
                      </label>
                      <input
                        type="number"
                        name="porc_replant"
                        id="porc_replant"
                        step={0.01}
                        {...register("porc_replant")}
                        defaultValue={
                          selectedItem ? selectedItem.porc_replant : ""
                        }
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
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Temporada:</strong>{" "}
                    {getNameByKey("season", selectedItem.season, dataMap)}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Sector:</strong>{" "}
                    {getNameByKey("sector", selectedItem.sector, dataMap)}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Especie:</strong>{" "}
                    {getNameByKey("specie", selectedItem.specie, dataMap)}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Variedad:</strong>{" "}
                    {getNameByKey("variety", selectedItem.variety, dataMap)}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Ha. productivas:</strong>{" "}
                    {selectedItem.ha_productivas}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Año plantación:</strong> {selectedItem.year_harvest}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Frecuencia diaria mínima:</strong>{" "}
                    {selectedItem.min_daily_frecuency}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Frecuencia diaria máxima:</strong>{" "}
                    {selectedItem.max_daily_frecuency}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Cosecha finalizada:</strong>{" "}
                    {selectedItem.harvest_end == 1 ? "Sí" : "No"}
                  </p>

                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Densidad de pantación
                  </h3>
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      <strong>Hileras:</strong> {selectedItem.hileras}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      <strong>Distancia entre hileras:</strong>{" "}
                      {selectedItem.interrow_density} mts.
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      <strong>Distancia sobre hileras:</strong>{" "}
                      {selectedItem.row_density} mts.
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      <strong>Plantas por hilera:</strong>{" "}
                      {selectedItem.plants_per_row}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      <strong>Número de plantas:</strong> {selectedItem.plants}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      <strong>Clasificación:</strong>{" "}
                      {selectedItem.clasification != null
                        ? selectedItem.clasification
                        : "-"}
                    </p>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Proyección de producción
                  </h3>
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      <strong>Hileras:</strong> {selectedItem.hileras}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      <strong>Distancia entre hileras:</strong>{" "}
                      {selectedItem.interrow_density} mts.
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      <strong>Distancia sobre hileras:</strong>{" "}
                      {selectedItem.row_density} mts.
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      <strong>Plantas por hilera:</strong>{" "}
                      {selectedItem.plants_per_row}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      <strong>Número de plantas:</strong> {selectedItem.plants}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      <strong>Clasificación:</strong>{" "}
                      {selectedItem.clasification != null
                        ? selectedItem.clasification
                        : "-"}
                    </p>
                  </div>
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
                  {openAlert ? itemToDelete.name_item : itemToClone.name}
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

export default CardTableSectorAttributes;
