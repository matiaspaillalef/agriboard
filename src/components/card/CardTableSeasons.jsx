"use client";

import { useState, useEffect, useRef } from "react";
import { formatNumber } from "@/functions/functions";
import ExportarExcel from "@/components/button/ButtonExportExcel";
import { set, useForm } from "react-hook-form";
import moment from "moment-timezone";
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
  getDataSeasons,
  updateSeason,
  createSeason,
  deleteSeason,
} from "@/app/api/ProductionApi";

import { getDataShifts } from "@/app/api/ManagementPeople";

const CardTableSeasons = ({
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

  const [dataShifts, setDataShifts] = useState([]);
  const [selectedShifts, setSelectedShifts] = useState([]);

  const [openShowUser, setOpenShowUser] = useState(false);

  useEffect(() => {
    const handleNameShifts = async () => {
      const shifts = await getDataShifts(companyID);
      //console.log(shifts);
      setDataShifts(shifts);
    };
    handleNameShifts();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      setSelectedShifts(selectedItem.shifts || []); // Asegúrate de que sea un arreglo
    }
  }, [selectedItem]);

  const handleCheckboxChange = (id) => {
    setSelectedShifts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((shiftId) => shiftId !== id)
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
    period: "",
    date_from: "",
    date_until: "",
    shifts: "",
    status: "",
  });

  const handleNameShifts = (ids) => {
    if (!Array.isArray(ids)) {
      console.error("El argumento proporcionado no es un array.");
      return "";
    }

    // Encontrar los nombres de los turnos correspondientes a los IDs
    const names = ids.map((id) => {
      const shift = dataShifts.find((shift) => shift.id === id);
      return shift ? shift.name : "";
    });

    // Filtrar nombres vacíos y unirlos con comas si hay más de uno
    const filteredNames = names.filter((name) => name !== "");
    return filteredNames.join(filteredNames.length > 1 ? ", " : "");
  };

  const handleNameShiftsSafe = (ids) => {
    return Array.isArray(ids) ? handleNameShifts(ids) : "";
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
    console.log(data);
    try {
      if (!data || !data.id) {
        throw new Error(
          "Los datos para actualizar son inválidos o incompletos."
        );
      }

      let updatedData;

      if (selectedShifts != "") {
        updatedData = { ...data, shifts: selectedShifts };
      } else {
        updatedData = { ...data };
      }

      const updateItemApi = await updateSeason(updatedData);
      const dataNew = await getDataSeasons(companyID);

      if (updateItemApi === "OK") {
        const updatedList = initialData.map((item) =>
          item.id === Number(data.id) ? { ...item, ...updatedData } : item
        );

        setInitialData(updatedList);
        setInitialData(dataNew);

        if (selectedShifts != "") {
          setUpdateMessage("Registro actualizado correctamente");
        }

        setOpen(false);
      } else {
        setUpdateMessage("No se pudo actualizar el registro.");
      }
    } catch (error) {
      console.error(error);
      setUpdateMessage("Error al intentar actualizar el registro.");
    }
  };

  useEffect(() => {
    // Define la zona horaria de Chile
    const timeZone = "America/Santiago";
    const now = moment().tz(timeZone);
    const localDateString = now.format("YYYY-MM-DD");

    // Obtener la hora en segundos desde medianoche
    const nowTime = now.hours() * 3600 + now.minutes() * 60 + now.seconds(); // Total de segundos desde medianoche

    // Calcula las horas, minutos y segundos
    const hours = Math.floor(nowTime / 3600);
    const minutes = Math.floor((nowTime % 3600) / 60);
    const seconds = nowTime % 60;

    if (Array.isArray(initialData)) {
      initialData.forEach((season) => {
        const endDate = moment(season.date_until)
          .tz(timeZone)
          .format("YYYY-MM-DD");

        if (endDate < localDateString && season.status === 1) {
          const seasonToUpdate = {
            id: season.id.toString(),
            name: season.name,
            period: season.period,
            date_from: moment(season.date_from).format("YYYY-MM-DD"),
            date_until: moment(season.date_until).format("YYYY-MM-DD"),
            status: "2", // Convertir status a string
            company_id: season.company_id.toString(),
            shifts: season.shifts,
          };

          onUpdateItem(seasonToUpdate);
        }
      });
    } else {
      console.log("No hay datos");
    }
  }, [initialData, onUpdateItem]);

  const handleOpenAlert = (index, id, name_item) => {
    setItemToDelete({ index, id, name_item });
    setOpenAlert(true);
    setOpenAlertClone(false);
  };

  const handleCloneAlert = (
    index,
    name,
    period,
    date_from,
    date_until,
    shifts,
    status,
    company_id
  ) => {
    setItemToClone({
      name,
      period,
      date_from,
      date_until,
      shifts,
      status,
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
    setItemToDelete({
      index: null,
      name: "",
      period: "",
      date_from: "",
      date_until: "",
      shifts: "",
      status: "",
      company_id: "",
    });
  };

  const handlerRemove = async () => {
    const { index, id } = itemToDelete;
    try {
      //if (userConfirmed) {
      const deleteItem = await deleteSeason(id);

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
    const { name, period, date_from, date_until, shifts, status, company_id } =
      itemToClone;

    try {
      const cloneItem = await createSeason(itemToClone);
      const dataNew = await getDataSeasons(companyID);

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
        name: data.name.trim(),
        period: data.period.trim(),
        date_from: data.date_from.trim(),
        date_until: data.date_until.trim(),
        shifts: selectedShifts,
        company_id: Number(data.company_id) || null, // Convierte a número
        status: data.status.trim(),
      };

      const createItem = await createSeason(transformedData);
      const dataNew = await getDataSeasons(companyID);

      if (createItem === "OK") {
        const updatedData = [...initialData, transformedData];

        setInitialData(updatedData); //Actualizamos la visualización de la tabla
        setInitialData(dataNew); //Actualizamos la visualizacion pero con el id, quizas sea necesario quitar el de ahi arriba
        setOpen(false);
        setSelectedShifts([]);
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

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `${day} de ${month} de ${year}`;
  };

  const formatDateForInput = (isoDate) => {
    if (!isoDate) return ""; // Maneja el caso en que la fecha sea null o undefined
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // `getMonth()` devuelve 0-11, así que sumamos 1
    const day = String(date.getDate()).padStart(2, "0");
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
          //variant="gradient"
          className="max-w-[300px] linear mt-2 w-full rounded-xl bg-blueTertiary py-[12px] text-base font-medium text-white transition duration-200 hover:!bg-blueQuinary active:bg-blueTertiary dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 items-center justify-center flex gap-2 normal-case"
        >
          <PlusIcon className="w-5 h-5" />
          Nueva temporada
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
                    filename="Temporadas"
                    sheetname="temporadas"
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
                {/* Ojo aca Javi, ya que me envias un mensaje de error y nunca llega null o undefined, llega el mensaje, por eso comprueba si es un array o no, el currentItems es de la paginación */}
                {Array.isArray(initialData) && initialData.length > 0 ? (
                  currentItems.map((row, index) => {
                    // Calcula si la fila debe tener el fondo amarillo
                    const endDate = new Date(row.date_until);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const endOfToday = new Date(today);
                    endOfToday.setHours(15, 59, 59, 999);

                    const tenDaysFromNow = new Date(today);
                    tenDaysFromNow.setDate(today.getDate() + 10);

                    const isClosingSoon =
                      endDate >= today && endDate <= tenDaysFromNow;

                    const rowClass =
                      row.status === 2
                        ? ""
                        : isClosingSoon
                        ? "bg-yellow-100"
                        : index % 2 !== 0
                        ? "bg-lightPrimary dark:bg-navy-900"
                        : "";

                    return (
                      <tr key={index} role="row" className={rowClass}>
                        {Object.keys(row).map((key, rowIndex) => {
                          if (omitirColumns.includes(key)) {
                            return null; // Omitir la columna si está en omitirColumns
                          }

                          return (
                            <td
                              key={rowIndex}
                              role="cell"
                              className={`pt-[14px] pb-3 text-[14px] px-5 min-w-[150px] ${
                                columnsClasses[rowIndex] || "text-left"
                              }`}
                            >
                              <div className="text-base font-medium text-navy-700 dark:text-white">
                                {key === "status" ? (
                                  row[key] === 1 ? (
                                    <p className="activeState bg-lime-500 flex items-center justify-center rounded-md text-white py-2 px-3 max-w-36">
                                      Activo
                                    </p>
                                  ) : row[key] === 2 ? (
                                    <p className="inactiveState bg-orange-500 flex items-center justify-center rounded-md text-white py-2 px-3 max-w-36">
                                      Cerrado
                                    </p>
                                  ) : (
                                    <p className="inactiveState bg-red-500 flex items-center justify-center rounded-md text-white py-2 px-3 max-w-36">
                                      Inactivo
                                    </p>
                                  )
                                ) : key === "date_from" ||
                                  key === "date_until" ? (
                                  formatDate(row[key])
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
                            className={`pt-[14px] pb-3 text-[14px] px-5 min-w-[100px] ${rowClass}`}
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
                              onClick={() => handleOpenEditUser(row)}
                            >
                              <PencilSquareIcon className="w-6 h-6" />
                            </button>

                            <button
                              type="button"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                              onClick={() => {
                                handleCloneAlert(
                                  index,
                                  row.name ? row.name : "",
                                  row.period ? row.period : "",
                                  row.date_from ? row.date_from : "",
                                  row.date_until ? row.date_until : "",
                                  row.shifts ? row.shifts : "",
                                  row.status !== undefined &&
                                    row.status !== null
                                    ? Number(row.status)
                                    : "",
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
                                  row.name ? row.name : ""
                                );
                              }}
                            >
                              <TrashIcon className="w-6 h-6" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
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
                ? "Datos de la temporada"
                : isEdit
                ? "Editar temporada"
                : "Nueva temporada"}
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
                        required={true}
                        {...register("name")}
                        defaultValue={selectedItem ? selectedItem.name : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
                    <div className="flex flex-row flex-wrap gap-3">
                      <label
                        htmlFor="period"
                        className="text-sm font-semibold text-gray-800 dark:text-white basis-full"
                      >
                        Periodo
                      </label>
                      <select
                        name="period"
                        id="period"
                        required={true}
                        {...register("period")}
                        defaultValue={selectedItem ? selectedItem.period : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      >
                        <option value="Anual">Anual</option>
                        <option value="Bimestral">Bimestral</option>
                        <option value="Semestral">Semestral</option>
                        <option value="Trimestral">Trimestral</option>
                        <option value="Mensual">Mensual</option>
                        <option value="Semanal">Semanal</option>
                        <option value="Diario">Diario</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div className="flex flex-row flex-wrap gap-3">
                      <label
                        htmlFor="date_from"
                        className="text-sm font-semibold text-gray-800 dark:text-white basis-full"
                      >
                        Fecha de inicio
                      </label>
                      <input
                        type="date"
                        name="date_from"
                        id="date_from"
                        required={true}
                        {...register("date_from")}
                        defaultValue={
                          selectedItem
                            ? formatDateForInput(selectedItem.date_from)
                            : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>
                    <div className="flex flex-row flex-wrap gap-3">
                      <label
                        htmlFor="date_until"
                        className="text-sm font-semibold text-gray-800 dark:text-white basis-full"
                      >
                        Fecha de termino
                      </label>
                      <input
                        type="date"
                        name="date_until"
                        id="date_until"
                        required={true}
                        {...register("date_until")}
                        defaultValue={
                          selectedItem
                            ? formatDateForInput(selectedItem.date_until)
                            : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
                    <div className="flex flex-row flex-wrap gap-3">
                      <label
                        htmlFor="varieties"
                        className="text-sm font-semibold text-gray-800 dark:text-white basis-full"
                      >
                        Turnos
                      </label>

                      {Array.isArray(dataShifts) &&
                        dataShifts.map(
                          (shift) =>
                            shift.status == 1 && (
                              <div key={shift.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`shift-${shift.id}`}
                                  name="shifts"
                                  value={shift.id}
                                  checked={selectedShifts.includes(shift.id)}
                                  onChange={() =>
                                    handleCheckboxChange(shift.id)
                                  }
                                  className="mr-2"
                                />
                                <label
                                  htmlFor={`shift-${shift.id}`}
                                  className="text-sm font-medium text-gray-800 dark:text-white"
                                >
                                  {shift.name}
                                </label>
                              </div>
                            )
                        )}
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
                        <option value="2">Cerrado</option>
                      </select>
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
                    <strong>{selectedItem.name}</strong>
                  </p>

                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Periodo:</strong> {selectedItem.period}
                  </p>

                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Fecha de inicio:</strong>{" "}
                    {formatDate(selectedItem.date_from)}
                  </p>

                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Fecha de termino:</strong>{" "}
                    {formatDate(selectedItem.date_until)}
                  </p>

                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Variedades:</strong>{" "}
                    {handleNameShiftsSafe(selectedItem.shifts)}
                  </p>

                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Estado:</strong>{" "}
                    {selectedItem.status == 1
                      ? "Activo"
                      : selectedItem.status == 2
                      ? "Cerrado"
                      : "Inactivo"}
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
                temporada{" "}
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

export default CardTableSeasons;
