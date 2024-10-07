"use client";

import { useState, useEffect, useRef } from "react";
import { formatNumber } from "@/functions/functions";
import ExportarExcel from "@/components/button/ButtonExportExcel";
import { set, useForm } from "react-hook-form";
import "@/assets/css/Table.css";
import {
  PlusIcon,
  XMarkIcon,
  TrashIcon,
  PencilSquareIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Tooltip,
} from "@material-tailwind/react";

import {
  deleteSquad as deleteSquadApi,
  updateSquad,
  createSquad,
  getDataSquads,
  getDataGroups,
  getDataWorkers,
} from "@/app/api/ManagementPeople";

const CardTableSquads = ({
  data,
  thead,
  columnsClasses = [],
  omitirColumns = [],
  title,
  actions,
  tableId,
  downloadBtn,
  SearchInput,
  companyID,
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

  ///Modal agregar trabajadores
  const [openAddWorkers, setOpenAddWorkers] = useState(false);

  const [openAlert, setOpenAlert] = useState(false);

  const [itemToDelete, setItemToDelete] = useState({
    index: null,
    id: null,
    name: "",
  });

  const [groups, setGroups] = useState([]);
  const [workers, setWorkers] = useState([]);

  const [selectSquad, setSelectSquad] = useState({
    id: null,
    name: "",
  });

  //Search Workers
  const [showSelectedWorkers, setShowSelectedWorkers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredWorkers, setFilteredWorkers] = useState(workers);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = workers.filter(
      (worker) =>
        worker.name.toLowerCase().includes(value) ||
        worker.lastname.toLowerCase().includes(value) ||
        worker.rut.toLowerCase().includes(value)
    );

    setFilteredWorkers(filtered);
  };

  const handleCheckboxChange = (event) => {
    setShowSelectedWorkers(event.target.checked);
    if (event.target.checked) {
      // Mostrar solo los trabajadores seleccionados en la cuadrilla
      if (selectSquad.workers && selectSquad.workers.length > 0) {
        const selectedWorkers = workers.filter((worker) =>
          selectSquad.workers.includes(worker.id)
        );
        setFilteredWorkers(selectedWorkers);
      } else {
        // En caso de que no haya trabajadores seleccionados, muestra un mensaje o maneja la lógica según tu aplicación
        setFilteredWorkers([]);
      }
    } else {
      // Mostrar todos los trabajadores
      setFilteredWorkers(workers);
    }
  };

  const handleAssignWorkers = async () => {
    const selectedWorkerIds = workers
      .filter((worker) => worker.isSelected)
      .map((worker) => worker.id);

    const updatedSquad = {
      ...selectSquad,
      workers: selectedWorkerIds, // Agregamos los IDs de los trabajadores seleccionados
    };


    const responseCode = await updateSquad(updatedSquad);
    //console.log("Response code:", responseCode);
    if (responseCode === "OK") {
      // Manejar éxito
      setUpdateMessage("Trabajadores asignados correctamente.");

      //Esto lo hago para cuando se reabra el modal quede con la data actualizada
      const squadData = await getDataSquads(companyID);
      setInitialData(squadData);

      setTimeout(() => {
        setOpenAddWorkers(!openAddWorkers);
        set;
      }, 2000);
      console.log("Trabajadores asignados correctamente.");
    } else {
      // Manejar error
      setUpdateMessage("Error al asignar trabajadores.");
      console.error("Error al asignar trabajadores.");
    }
  };

  useEffect(() => {
    setFilteredWorkers(workers);
  }, [workers]);

  const handleModalClose = () => {
    setShowSelectedWorkers(false);
    setOpenAddWorkers(false);
  };

  const handleOpenNewUser = () => {
    setIsEdit(false);
    handleOpen();
  };

  const handleAddWorkers = (squad) => {

    setSelectSquad(squad);
    setOpenAddWorkers(!openAddWorkers);

    // Convertir la cadena de texto de workers a un array de números
    const workerIds = JSON.parse(squad.workers);

    // Actualizar el estado de los trabajadores para marcar los ya asignados
    const updatedWorkers = workers.map((worker) => ({
        ...worker,
        isSelected: workerIds.includes(worker.id),
    }));

    console.log("Updated workers:", updatedWorkers);

    setWorkers(updatedWorkers);
};

  const handleOpenEditUser = (user) => {
    const workersJson = JSON.parse(user.workers);

    const updatedUser = {
      ...user,
      workers: workersJson,
    };

    setIsEdit(true);
    setFormData(updatedUser);
    setSelectedItem(updatedUser);
    handleOpen(updatedUser);
  };

  const handleOpen = (user) => {
    reset();
    setSelectedItem(user); // Actualiza el estado con los datos del usuario seleccionado
    setOpen(!open);
  };

  const onUpdateItem = async (data) => {
    // Convierte el campo workers de una cadena separada por comas a un array de números
    const workersArray = data.workers
      .split(",")
      .map((workerId) => parseInt(workerId.trim(), 10)) // Convierte a número
      .filter((workerId) => !isNaN(workerId)); // Filtra valores no válidos

    // Actualiza el campo workers en el objeto de datos
    const updatedData = {
      ...data,
      workers:workersArray,
    };

    try {

      const updateSquadApi = await updateSquad(updatedData);
      const squadData = await getDataSquads(companyID);
      console.log(squadData);

      if (updateSquadApi.code === "OK") {

        const newData = initialData.map((item) =>
          item.id === updatedData.id ? updatedData : item

        );

        setInitialData(newData);
        setInitialData(squadData.squads);
        setUpdateMessage(updateSquadApi.mensaje);
        
      }else if (updateSquadApi.code === "ERROR") {

        setUpdateMessage(setUpdateMessage(updateUserApi.mensaje));

      } 

      setOpen(false);
    } catch (error) {

      console.error(error);
      // Manejo de errores
      setUpdateMessage(
        "Error al intentar actualizar la cuadrilla. Inténtalo nuevamente."
      );
    }
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
      const deleteSquad = await deleteSquadApi(id);

      // Elimina la fila del front-end si la eliminación fue exitosa
      if (deleteSquad.code === "OK") {

        const updatedData = [...initialData];
        updatedData.splice(index, 1);
        setInitialData(updatedData);
        setOpenAlert(false);

        setUpdateMessage(deleteSquad.mensaje);

      }else if (deleteSquad.code === "ERROR") {

        setUpdateMessage(deleteSquad.mensaje);

      }

    } catch (error) {
      console.error(error);
      // Manejo de errores
      setUpdateMessage("Ocurrió un error al intentar eliminar el cuadrilla.");
    }
  };

  // Creación
  const onSubmitForm = async (data) => {
    try {

      const createSquadapi = await createSquad(data);

      // Agrega la fila del front-end

      console.log(createSquadapi);
      if (createSquadapi.code == "OK") {
        const updatedData = [...initialData, data]; // Agregar el nuevo usuario a la lista de datos existente

        setInitialData(updatedData);

        //Hago este fech para traer el ID del usuario recien creado y trayendo la data actualizada de la BD
        const newDataFetch = await getDataSquads(companyID );

        if(newDataFetch.code  === "OK"){

          setInitialData(newDataFetch.squads);

        }else if (newDataFetch.code === "ERROR") {

          setUpdateMessage(newDataFetch.mensaje);

        }

        setUpdateMessage(createSquadapi.mensaje);

      } else if (createSquadapi.code === "ERROR") {
          ;
          setUpdateMessage(createSquadapi.mensaje);
        
      }

      setOpen(false)

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

  useEffect(() => {
    // Obtener los grupos cuando el componente se monte
    const fetchGroups = async () => {
      try {
        const groupsData = await getDataGroups(companyID);
        console.log(groupsData);
        setGroups(groupsData.groups);
      } catch (error) {
        console.error("Error al obtener los grupos", error);
      }
    };

    const fetchWorkers = async () => {
      try {
        const workersData = await getDataWorkers(companyID);
        setWorkers(workersData);
      } catch (error) {
        console.error("Error al obtener los trabajadores", error);
      }
    };

    fetchWorkers();
    fetchGroups();
  }, []);

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
          Nuevo cuadrilla
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
              {Array.isArray(initialData) && downloadBtn && (
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

              <tbody role="rowSquad">
                {Array.isArray(initialData) && initialData.length > 0 ? (
                  currentItems.map((row, index) => (
                    <tr key={index} role="row">
                      {Object.keys(row).map((key, rowIndex) => {
                        if (omitirColumns.includes(key)) {
                          return null; // Omitir la columna si está en omitirColumns
                        }


                        //Acá mapeamos los id del grupo para trernos el nombre de la DB groups
                        if (key === "group") {
                          const group = Array.isArray(groups) ? groups.find(
                            (group) => group.id == row[key]
                          ) : null ;
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
                                {group ? group.name : "-"}
                              </div>
                            </td>
                          );
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
                          <Tooltip
                            placement="bottom"
                            className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10 text-navy-900 dark:text-white dark:bg-navy-900 dark:border-navy-900"
                            content="Asignar trabajadores"
                          >
                            <button
                              type="button"
                              className="text-sm font-semibold text-gray-800 dark:text-white mr-2"
                              onClick={() => {
                                handleAddWorkers(row);
                              }}
                              data-tooltip-target="tooltip"
                            >
                              <UserGroupIcon className="w-6 h-6" />
                            </button>
                          </Tooltip>

                          <Tooltip
                            placement="bottom"
                            className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10 text-navy-900 dark:text-white dark:bg-navy-900 dark:border-navy-900"
                            content="Editar cuadrilla"
                          >
                            <button
                              type="button"
                              className="text-sm font-semibold text-gray-800 dark:text-white mr-2"
                              //onClick={() => handleOpen(row)}
                              onClick={() => handleOpenEditUser(row)}
                            >
                              <PencilSquareIcon className="w-6 h-6" />
                            </button>
                          </Tooltip>

                          <Tooltip
                            placement="bottom"
                            className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10 text-navy-900 dark:text-white dark:bg-navy-900 dark:border-navy-900"
                            content="Eliminar cuadrilla"
                          >
                            <button
                              id="remove"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
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
                          </Tooltip>
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
          {Array.isArray(initialData) && initialData.length > 0 && (
            <div className="flex items-center justify-between mt-5">
              <div className="flex items-center gap-5">
                <p className="text-sm text-gray-800 dark:text-white">
                  Mostrando {indexOfFirstItem + 1} a{" "}
                  {indexOfLastItem > (initialData?.length ?? 0)
                    ? initialData?.length ?? 0
                    : indexOfLastItem}{" "}
                  de {initialData?.length ?? 0} cuadrillas
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
                  className="p-1 bg-gray-200 dark:bg-navy-900 text-navy-900 dark:text-white rounded-md"
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
              className="absolute right-[15px] top-[15px] flex items-center justify-center w-10 h-10 bg-lightPrimary dark:bg-navy-800 text-navy-900 dark:text-white rounded-md"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            <DialogHeader className="text-navy-900 dark:text-white">
              {isEdit ? "Editar cuadrilla" : "Crear cuadrilla"}
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
                      Nombre del cuadrilla
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required={true}
                      defaultValue={selectedItem ? selectedItem.name : ""}
                      {...register("name")}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 text-navy-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
                  <div className="flex flex-col gap-3">
                    <label
                      htmlFor="group"
                      className="text-sm font-semibold text-gray-800 dark:text-white"
                    >
                      Grupo
                    </label>
                    <select
                      name="group"
                      id="group"
                      //required={true}
                      {...register("group")}
                      defaultValue={selectedItem ? selectedItem.group : ""}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 text-navy-900 dark:text-white"
                    >
                      <option value="">Selecciona un grupo</option>
                      {Array.isArray(groups) &&
                        groups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

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
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 text-navy-900 dark:text-white"
                    >
                      <option value="0">Inactivo</option>
                      <option value="1">Activo</option>
                    </select>
                  </div>

                  <input
                    type="hidden"
                    name="company_id"
                    {...register("company_id")}
                    defaultValue={companyID}
                  />

                  <input
                    type="hidden"
                    name="workers"
                    {...register("workers")}
                    defaultValue={selectedItem ? selectedItem.workers : "[]"}
                  />

                  <div className="flex flex-col gap-3">
                    <button
                      type="submit"
                      className="linear mt-[30px] w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-navy-500 active:bg-navy-500 dark:bg-navy-500 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                      //onSubmit={onUpdateItem}
                      onSubmit={isEdit ? onUpdateItem : onSubmitForm}
                    >
                      {isEdit ? "Editar cuadrilla" : "Crear cuadrilla"}
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
              <h2 className="text-center mb-7 text-xl mt-5 text-navy-900 dark:text-white">
                ¿Seguro que desea eliminar la cuadrilla{" "}
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

          <Dialog
            open={openAddWorkers}
            handler={setOpenAddWorkers}
            size="md"
            className="p-5 lg:max-w-[25%] dark:bg-navy-900"
          >
            <>
              <h2 className="text-left mb-7 font-medium text-xl mt-5 text-navy-900 dark:text-white">
                Asignar trabajadores a <strong>{selectSquad.name}</strong>
              </h2>
              <button
                type="button"
                //onClick={() => setOpenAddWorkers(false)}
                onClick={handleModalClose}
                className="bg-gray-500 text-white px-1 py-1 rounded mr-2 absolute right-1 top-2"
              >
                <XMarkIcon className="text-white w-5 h-5" />
              </button>

              <div className="mb-3 grid grid-cols-3 gap-5 lg:grid-cols-3 items-center">
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Buscar trabajadores..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search w-full p-2 rounded-md border bg-white/0 dark:bg-navy-900 text-navy-900 dark:text-white border-gray-200 dark:border-white/10"
                  />
                </div>
                <div className="flex flex-row gap-3">
                  <input
                    type="checkbox"
                    id="showSelectedWorkers"
                    className="!bg-center rounded-sm"
                    checked={showSelectedWorkers}
                    onChange={handleCheckboxChange}
                  />
                  <label
                    htmlFor="showSelectedWorkers"
                    className="text-sm font-semibold"
                  >
                    Ver asignados
                  </label>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleAssignWorkers}
                    className="linear w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-navy-500 active:bg-navy-500 dark:bg-navy-500 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                  >
                    Asignar trabajadores
                  </button>
                </div>
              </div>

              <table className="w-full">
                <thead>
                  <tr>
                    <th className="inputcheck border-b-gray-200 border-b"></th>
                    <th className="text-left border-b-gray-200 border-b">
                      Nombre
                    </th>
                    <th className="text-left border-b-gray-200 border-b">
                      RUT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(filteredWorkers) &&
                  filteredWorkers.length > 0 ? (
                    filteredWorkers.map((worker, index) => (
                      <tr
                        key={worker.id}
                        className={`pt-[14px] p-3 text-[14px] px-5 ${
                          index % 2 !== 0
                            ? "bg-lightPrimary dark:bg-navy-900"
                            : ""
                        }`}
                      >
                        <td className="py-2">
                          <input
                            type="checkbox"
                            className="!bg-center rounded-sm"
                            checked={worker.isSelected || false}
                            onChange={() => {
                              worker.isSelected = !worker.isSelected;
                              setWorkers([...workers]);
                            }}
                          />
                        </td>
                        <td>{worker.name + " " + worker.lastname}</td>
                        <td>{worker.rut}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No hay trabajadores asignados a esta cuadrilla.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          </Dialog>
        </>
      )}
    </>
  );
};

export default CardTableSquads;
