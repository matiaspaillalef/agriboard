"use client";

import { useState, useEffect, useRef } from "react";
import { formatNumber } from "@/functions/functions";
import ExportarExcel from "@/components/button/ButtonExportExcel";
//import ExportarPDF from "@/components/button/ButtonExportPDF";
import { useForm } from "react-hook-form";
import "@/assets/css/Table.css";
import {
  PlusIcon,
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  EyeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
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
  deleteContractor as deleteContractorApi,
  updateContractor,
  createContractor,
  getDataContractors,
} from "@/app/api/ManagementPeople";

import { ProvitionalCL } from "@/app/data/dataProvisionals";
import Rut from "@/components/validateRUT";
import { StateCL } from "@/app/data/dataStates";

const CardTableContractors = ({
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
  const [openShowUser, setOpenShowUser] = useState(false);
  const [formatInitialData, setFormatInitialData] = useState([]);

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

  const [filteredData, setFilteredData] = useState(initialData);

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

  const handleOpenNewUser = () => {
    setOpenShowUser(false);
    setIsEdit(false);
    handleOpen();
  };

  const handleOpenEditUser = (user) => {
    //console.log(user);
    setOpenShowUser(false);
    setRutValido(true); //Se pasa en true ya que si leventa la ventada de editar es por que los datos ya fueron validados
    setSelectedRegion(user.state);
    setIsEdit(true);
    setFormData(user);
    setSelectedItem(user);
    handleOpen(user);
    
  };


  const handleOpenShowUser = (user) => {
    //console.log(user);
    setSelectedItem(user);
    setOpenShowUser(true);
    setSelectedRegion(user.state);
    setFormData(user);
    handleOpen(user);
    setIsEdit(false);
  };

  const handleOpen = (user) => {
    reset();
    setSelectedItem(user); // Actualiza el estado con los datos del usuario seleccionado
    setOpen(!open);
  };
  

  const onUpdateItem = async (data) => {

    try {
      const updateContractorApi = await updateContractor(data);

      // Elimina la fila del front-end
      if (updateContractorApi === "OK") {
        //Al momento de actualizar y el array lo estaba mandando de otra forma, se debe hacer un map para actualizar el array de forma correcta
        const updatedData = initialData.map((item) =>
          item.id == data.id
            ? {
              rut: data.rut,
              name: data.name,
              lastname: data.lastname,
              giro: data.giro,
              phone: data.phone,
              email: data.email,
              state: data.state,
              city: data.city,
              address: data.address,
              status: data.status,
            }
            : item
        );

        setInitialData(updatedData);
        setUpdateMessage("Contratistaactualizado correctamente");
        setOpen(false);
      } else {
        setUpdateMessage("No se pudo actualizar al contratista");
      }
    } catch (error) {
      console.error(error);
      // Manejo de errores
      setUpdateMessage("Error al intentar actualizar al contratista");
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
      const deleteContractor = await deleteContractorApi(id);

      // Elimina la fila del front-end si la eliminación fue exitosa
      if (deleteContractor === "OK") {
        const updatedData = [...initialData];
        updatedData.splice(index, 1);
        setInitialData(updatedData);
        setOpenAlert(false);
        setUpdateMessage("Contratista eliminado correctamente");
      } else {
        setUpdateMessage(
          "Error al eliminar al contratista. Inténtalo nuevamente."
        );
      }
    } catch (error) {
      console.error(error);
      // Manejo de errores
      setUpdateMessage("Ocurrió un error al intentar eliminar al contratista.");
    }
  };

  // Creación
  const onSubmitForm = async (data) => {

    try {
      const createContractorapi = await createContractor(data);

      // Agrega la fila del front-end
      if (createContractorapi == "OK") {
        const updatedData = [...initialData, data]; // Agregar el nuevo usuario a la lista de datos existente

        setInitialData(updatedData);

        const userDataString = sessionStorage.getItem("userData");
        const userData = JSON.parse(userDataString);
        const idCompany = userData.idCompany;

        //Hago este fech para traer el ID del usuario recien creado y trayendo la data actualizada de la BD
        const newDataFetch = await getDataContractors(idCompany); // Actualizar la lista de usuarios
        //console.log(newDataFetch);
        setInitialData(newDataFetch);

        setOpen(false);

        setUpdateMessage("Contratista creado correctamente");
      } else {
        setUpdateMessage(createContractorapi);
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
    // Verificar si `data` está definido y no es un array vacío ni un objeto vacío
    if (
      (data && Array.isArray(data) && data.length > 0) ||
      (typeof data === "object" && Object.keys(data).length > 0)
    ) {
      setLoading(false);
    } else {
      // Si `data` es un array vacío o un objeto vacío, manejarlo como no cargado
      setLoading(false);
    }
  }, []);

  const handlerSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = data.filter((item) =>
      Object.keys(item).some((key) => {
        const fieldValue = item[key];
        return (
          fieldValue != null && // Asegúrate de que no sea null o undefined
          fieldValue.toString().toLowerCase().includes(value)
        );
      })
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

  const currentItems = (
    Array.isArray(initialData) && initialData.length > 0 ? initialData : []
  ).slice(indexOfFirstItem, indexOfLastItem);

  const pagination = Array.from({ length: totalPages }, (_, i) => i + 1);


  /*if (!data || data.length === 0) {
    return <div>No hay datos disponibles.</div>;
  }*/

    //Exportar Excel datas de front
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Función para separar el RUT y su dígito verificador
          const splitRut = (rut) => {
            // Primero eliminamos puntos y guiones
            const cleanedRut = rut.replace(/[.\-]/g, '');
    
            // Separamos el RUT y el dígito verificador
            const rutNumber = cleanedRut.slice(0, -1); // Todo menos el último carácter
            const dv = cleanedRut.slice(-1); // Último carácter (el dígito verificador)
    
            return { rutNumber, dv };
          };
    
          // Mapeamos los datos iniciales y formateamos los resultados
          const data = initialData.map((item) => {
            const { rutNumber, dv } = splitRut(item.rut || "Sin asignar");
    
            return {
              Nombre: item.name,
              Apellido: item.lastname,
              Rut: rutNumber,
              DV: dv,
              Giro: item.giro,
              Teléfono: item.phone,
              Email: item.email,
              Región: StateCL.find((state) => state.region_number == item.state)?.region || "-",
              Ciudad: item.city,
              Dirección: item.address,
              Estado: item.status == 1 ? "Activo" : "Inactivo",
            };
          });
    
          setFormatInitialData(data); // Guardamos los datos formateados en el estado
        } catch (error) {
          console.error("Error al procesar los datos:", error);
        }
      };
    
      fetchData(); // Llamamos a la función fetchData
    }, [initialData]);

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
          ////variant="gradient"
          className="max-w-[300px] linear mt-2 w-full rounded-xl bg-blueTertiary py-[12px] text-base font-medium text-white transition duration-200 hover:!bg-blueQuinary active:bg-blueTertiary dark:bg-blueQuinary dark:text-white dark:hover:!bg-navy-900 dark:active:bg-blueQuinary items-center justify-center flex gap-2 normal-case"
        >
          <PlusIcon className="w-5 h-5" />
          Nuevo contratista
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

            {Array.isArray(initialData) && initialData.length > 0 && (
              <div className="buttonsActions mb-3 flex gap-2 w-full flex-col md:w-auto md:flex-row md:gap-5">
                {downloadBtn && (
                  <ExportarExcel
                    data={formatInitialData}
                    filename="contratistas"
                    sheetname="conrtatistas"
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
                          className={`pt-[14px] pb-3 text-[14px] px-5 ${index % 2 !== 0
                            ? "bg-lightPrimary dark:bg-navy-900"
                            : ""
                            }`}
                        >
                          <Tooltip
                            placement="bottom"
                            content="Ver trabajador"
                            className="border border-blue-gray-50 bg-white dark:bg-navy-600 dark:border-navy-600 px-4 py-3 shadow-xl shadow-black/10 text-navy-900 dark:text-white"
                          >
                            <button
                              type="button"
                              className="text-sm font-semibold text-gray-800 dark:text-white mr-2"
                              onClick={() => handleOpenShowUser(row)}
                            >
                              <EyeIcon className="w-6 h-6" />
                            </button>
                          </Tooltip>

                          <Tooltip
                            placement="bottom"
                            content="Editar trabajador"
                            className="border border-blue-gray-50 bg-white dark:bg-navy-600 dark:border-navy-600 px-4 py-3 shadow-xl shadow-black/10 text-navy-900 dark:text-white"
                          >
                            <button
                              type="button"
                              className="text-sm font-semibold text-gray-800 dark:text-white mr-2"
                              onClick={() => handleOpenEditUser(row)}
                            >
                              <PencilSquareIcon className="w-6 h-6" />
                            </button>
                          </Tooltip>

                          <Tooltip
                            placement="bottom"
                            content="Eliminar trabajdor"
                            className="border border-blue-gray-50 bg-white dark:bg-navy-600 dark:border-navy-600 px-4 py-3 shadow-xl shadow-black/10 text-navy-900 dark:text-white"
                          >
                            <button
                              id="remove"
                              type="button"
                              onClick={() => {
                                //console.log(row);
                                handleOpenAlert(
                                  index,
                                  row.id,
                                  row.name ? row.name : "",
                                  row.lastname ? row.lastname : "",
                                  row.email ? row.email : ""
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

          {Array.isArray(initialData) &&
            initialData.length > 0 &&
            pagination.length > 1 && (
              <div className="flex flex-col md:flex-row items-center justify-between mt-5">
                <div className="flex items-center gap-2 mt-5 md:gap-5 md:mt-0">
                  <p className="text-sm text-gray-800 dark:text-white">
                    Mostrando {indexOfFirstItem + 1} a{" "}
                    {indexOfLastItem > initialData.length
                      ? initialData.length
                      : indexOfLastItem}{" "}
                    de {initialData.length} registros
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-5 md:gap-5 md:mt-0">
                  {/* Botón de página anterior */}
                  <button
                    type="button"
                    className={`p-1 bg-gray-200 dark:bg-navy-900 rounded-md ${currentPage === 1 && "hidden"
                      }`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>

                  {/* Números de página resumidos */}
                  {pagination.map((page) => {
                    const pagesToShow = 5; // Número de páginas a mostrar alrededor de la página actual
                    const isStart = page <= pagesToShow;
                    const isEnd = page > totalPages - pagesToShow;
                    const isAroundCurrent = Math.abs(page - currentPage) <= 2;

                    if (isStart || isEnd || isAroundCurrent) {
                      return (
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
                      );
                    } else if (
                      (page === currentPage - 3 && currentPage > pagesToShow) ||
                      (page === currentPage + 3 && currentPage < totalPages - pagesToShow)
                    ) {
                      return <span key={page}>...</span>; // Mostrar puntos suspensivos
                    }
                    return null;
                  })}

                  {/* Botón de página siguiente */}
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
            size="sm"
            className="p-5 lg:max-w-[40%] dark:bg-navy-900 overflow-x-scroll max-h-[650px]"
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
                ? "Datos del contratista"
                : isEdit
                  ? "Editar Contratista"
                  : "Crear Contratista"
                  }
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
                  <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
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
                        defaultValue={selectedItem ? selectedItem.name : ""}
                        {...register("name")}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-3 ">
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
                        required={true}
                        defaultValue={selectedItem ? selectedItem.lastname : ""}
                        {...register("lastname")}
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
                        htmlFor="giro"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Giro
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="giro"
                          required={true}
                          id="giro"
                          {...register("giro")}
                          defaultValue={selectedItem ? selectedItem.giro : ""}
                          className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white pr-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="phone"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Teléfono
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          {...register("phone")}
                          defaultValue={selectedItem ? selectedItem.phone : ""}
                          className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white pr-10"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="email"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          {...register("email")}
                          defaultValue={selectedItem ? selectedItem.email : ""}
                          className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white pr-10"
                        />
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

                  <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
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
                        //required={true}
                        {...register("address")}
                        defaultValue={selectedItem ? selectedItem.address : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
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
                    <div className="flex flex-col gap-3">
                      <button
                        type="submit"
                        className="linear mt-[30px] w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-navy-500 active:bg-navy-500 dark:bg-navy-500 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                        //onSubmit={onUpdateItem}
                        onSubmit={isEdit ? onUpdateItem : onSubmitForm}
                      >
                        {isEdit ? "Editar Contratista" : "Crear Contratista"}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-3">

                  <p className="text-md font-semibold text-gray-800 dark:text-white">
                    <strong>
                    {selectedItem ? `${selectedItem.name || ""} ${selectedItem.lastname || ""}` : "Sin información"}
                    </strong>
                  </p>

                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Giro:</strong>{" "}
                    {selectedItem?.giro || "-"}
                  </p>

                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>RUT:</strong> {selectedItem?.rut || "-"}
                  </p>

                  <p className="text-sm font-semibold text-gray-800 dark:text-white flex gap-2 align-middle">
                    <span>
                      <strong>Teléfono:</strong>{" "}
                      {selectedItem?.phone ? (
                        <a
                          href={`tel:${selectedItem?.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {selectedItem?.phone}
                        </a>
                      ) : (
                        "No registrado"
                      )}
                    </span>
                    <a
                      href={`tel:${selectedItem?.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blueQuinary inline-flex align-middle justify-center p-1 text-white"
                    >
                      <PhoneIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://api.whatsapp.com/send?phone=${selectedItem?.phone}&text=Buen%20d%C3%ADa!%20${selectedItem?.name} ${selectedItem?.lastname}`}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="bg-[#25d366] inline-flex align-middle justify-center p-1 text-white"
                    >
                      <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    </a>
                  </p>

                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Email:</strong>{" "}
                    {selectedItem?.email && selectedItem?.email != ' ' ? (
                      <a
                        href={`mailto:${selectedItem.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedItem?.email}
                      </a>
                    ) : (
                      "No registrado"
                    )}
                  </p>

                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Región:</strong>{" "}
                    {StateCL.find(
                      (state) => state?.region_number == selectedItem?.state
                    )?.region || "-"}
                  </p>

                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Ciudad:</strong> {selectedItem?.city || "-"}
                  </p>

                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Dirección:</strong> {selectedItem?.address || "-"}
                  </p>

                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Estado:</strong>{" "}
                    {selectedItem?.status == 1 ? "Activo" : "Inactivo"}
                  </p>
                </div>

              )}
            </DialogBody>
          </Dialog>

          <Dialog
            open={openAlert}
            handler={handleCloseAlert}
            size="xs"
            className="p-5 lg:max-w-[40%] dark:bg-navy-900"
          >
            <>
              <h2 className="text-center mb-7 text-xl mt-5 dark:text-white">
                ¿Seguro que desea eliminar al contratista{" "}
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

export default CardTableContractors;
