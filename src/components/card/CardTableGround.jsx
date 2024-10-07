"use client";

import { useState, useEffect, useRef, use } from "react";
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
  MapPinIcon,
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
import { getDataCompanies } from "@/app/api/ConfiguracionApi";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
//import L from "leaflet";
import customMarker from "@/../public/pin.png";
import { custom } from "zod";

const LocationSelector = ({ position, setPosition, setLatLng }) => {
  const [customIcon, setCustomIcon] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Solo se ejecuta en el cliente
      const icon = new L.Icon({
        iconUrl: customMarker.src,
        iconSize: [30, 35],
        iconAnchor: [17.5, 35],
        popupAnchor: [0, -30],
      });
      setCustomIcon(icon);
      setLatLng(position[0], position[1]);
    }
  }, [position, setLatLng]);

  useMapEvents({
    dblclick(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
    },
  });

  if (!customIcon) {
    return null; // Espera a que se cargue el icono
  }

  return <Marker position={position} icon={customIcon} />;
};

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

  const [currentLat, setCurrentLat] = useState("");
  const [currentLng, setCurrentLng] = useState("");

  useEffect(() => {
    const fetchLocationByIP = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();

        if (data && data.latitude && data.longitude) {
          const { latitude: lat, longitude: lng } = data;
          setPosition([lat, lng]);
          setCurrentLat(lat);
          setCurrentLng(lng);
        } else {
          console.warn("No latitude/longitude found in the response:", data);
          setPosition(initialPosition); // Establecer posición por defecto
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        setPosition(initialPosition); // Establecer posición por defecto
      }
    };

    fetchLocationByIP();
  }, []);

  const initialPosition = [currentLat, currentLng]; // Mostramos como posición inicial la ubicación actual
  const [position, setPosition] = useState(initialPosition);

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

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [rut, setRut] = useState("");
  const [rutValido, setRutValido] = useState(false);

  const [rol, setRol] = useState(""); // control de item por rol

  const [latitude, setLatitude] = useState(""); // Inicializa el estado de latitud
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    // Cuando cambia la región, reiniciamos la ciudad seleccionada
    setSelectedCity(""); // Esto asegura que la opción predeterminada esté seleccionada
  }, [selectedRegion]);

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
    setSelectedCity(""); // Reiniciar la ciudad seleccionada
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const filteredComunas =
    StateCL.find((state) => state.region_number === selectedRegion)?.comunas ||
    [];

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
    setPosition([user.latitude, user.longitude]);

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

  const onUpdateItem = async (formData) => {
    const data = {
      ...formData,
      latitude, // Asegúrate de que `latitude` tenga un valor
      longitude, // Asegúrate de que `longitude` tenga un valor
    };

    try {
      if (!data || !data.id) {
        throw new Error(
          "Los datos para actualizar son inválidos o incompletos."
        );
      }

      // Convertir cadenas vacías en null para latitude y longitude
      /*const updatedData = {
        ...data,
        latitude: data.latitude !== "" ? data.latitude : null,
        longitude: data.longitude !== "" ? data.longitude : null,
      };*/

      const updateItemApi = await updateGround(data);
      const dataNew = await getDataGround(companyID);

      if (updateItemApi === "OK") {
        const updatedList = initialData.map((item) =>
          item.id === data.id ? { ...item, ...updatedData } : item
        );

        setInitialData(updatedList);
        setInitialData(dataNew);
        setUpdateMessage("Registro actualizado correctamente");
        setOpen(false);
      } else {
        setUpdateMessage(
          updateItemApi ? updateItemApi : "No se pudo actualizar el registro."
        );
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

  const [openMap, setOpenMap] = useState(false);

  const handleOpenMap = () => {
    setOpenMap(true);
  };

  const handleCloseMap = () => {
    setOpenMap(false);
  };

  const handlerRemove = async () => {
    const { index, id } = itemToDelete;

    try {
      //if (userConfirmed) {
      const deleteItem = await deleteGroundApi(id);

      // Elimina la fila del front-end si la eliminación fue exitosa
      if (deleteItem.code === "OK") {

        const updatedData = [...initialData];

        updatedData.splice(index, 1);

        setInitialData(updatedData);

        setOpenAlert(false);

        setUpdateMessage(deleteItem.mensaje);

      }else if (deleteItem.code === "ERROR") {

        setUpdateMessage(deleteItem.mensaje);

      }
    } catch (error) {
      console.error(error);
      // Manejo de errores
      setUpdateMessage("Ocurrió un error al intentar eliminar el registro.");
    }
  };

  // Creación de campo
  const onSubmitForm = async (formData) => {
    const data = {
      ...formData,
      latitude, // Asegúrate de que `latitude` tenga un valor
      longitude, // Asegúrate de que `longitude` tenga un valor
    };

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
      if (createItem.code === "OK") {

        const updatedData = [...initialData, data];

        const dataNew = await getDataGround(companyID);

        if(dataNew.code  === "OK"){

          setInitialData(updatedData);
          setInitialData(dataNew.grounds);
          setOpen(false);
          setUpdateMessage(createItem.mensaje);
          setLatitude("");
          setLongitude("");

        }else if (dataNew.code === "ERROR") {

          setUpdateMessage(dataNew.mensaje);

        }

      } else if (createItem.code === "ERROR") {
       
        setUpdateMessage(createItem.mensaje);
      
    }
    } catch (error) {
      console.error(error);
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

            <div className="buttonsActions mb-3 flex gap-2 w-full flex-col md:w-auto md:flex-row md:gap-5">
              {Array.isArray(initialData) &&
                initialData.length > 0 &&
                downloadBtn && (
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
                            className={`pt-[14px] pb-3 text-[14px] px-5  ${
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
                                  StateCL.find(
                                    (state) => state.region_number == row[key]
                                  )?.region || "-"
                                ) : key === "latitude" ||
                                  key === "longitude" ? (
                                  <div className="flex justify-center">
                                    <p className="mr-2">
                                      Latitud: {row.latitude}
                                    </p>
                                    <p>Longitud: {row.longitude}</p>
                                  </div>
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
                            onClick={() => handleOpenEditUser(row)}
                          >
                            <PencilSquareIcon className="w-6 h-6" />
                          </button>
                          <button
                            id="remove"
                            type="button"
                            onClick={() => {
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
                    <td className="py-4" colSpan={columnLabels.length}>
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
            //Evitamos el cierre automatico con click en el backdrop
            dismiss={{
              outsidePress: false,
              escapeKey: false,
            }}
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
                      <option value="" disabled>
                        Seleccione una región
                      </option>

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
                      required={true}
                      onChange={handleCityChange}
                      //onChange={(event) => setSelectedCity(event.target.value)}
                      {...register("city")}
                      defaultValue={selectedItem ? selectedItem.city : ""}
                      //value={selectedCity}
                      className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                    >
                      <option value="">Seleccione una ciudad</option>{" "}
                      {/* Opción predeterminada */}
                      {filteredComunas.map((comuna) => (
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

                <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-1">
                  <label className="text-sm font-semibold text-gray-800 dark:text-white">
                    Seleccionar ubicación
                  </label>
                  <button
                    type="button"
                    //htmlFor="link"
                    //href="https://www.gps-coordinates.net/my-location"
                    onClick={handleOpenMap}
                    className="linear flex w-full max-w-[220px] rounded-md bg-blueQuinary py-[12px] text-sm font-medium text-white transition duration-200 hover:bg-navy-500 active:bg-navy-500 dark:bg-navy-500 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-2000 px-5 gap-2 justify-center"
                    target="_blank"
                  >
                    <MapPinIcon className="w-5 h-5" />

                    {isEdit ? "Editar ubicación" : "Selecciona la ubicación"}
                  </button>
                </div>

                <div className="mb-3 grid-cols-1 gap-3 lg:grid-cols-2 hidden">
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
                        readOnly={true}
                        //value={latitude}
                        //defaultValue={handleOpenMap ? latitude : selectedItem ? (selectedItem.latitude == null ? latitude : selectedItem.latitude) : latitude}
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
                        readOnly={true}
                        //value={selectedItem ? selectedItem.longitude : ''}
                        //defaultValue={handleOpenMap ? longitude : selectedItem ? (selectedItem.longitude == null ? longitude : selectedItem.longitude) : longitude}
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
          <Dialog
            open={openMap}
            handler={handleCloseMap}
            size="xs"
            className="p-5 lg:max-w-[25%] dark:bg-navy-900"
            data-modal-backdrop="static"
          >
            <>
              <h2 className="text-center mb-7 text-xl mt-5 dark:text-white">
                Selecciona tu ubicación
              </h2>
              <button
                type="button"
                onClick={handleCloseMap}
                className="bg-gray-500 text-white px-1 py-1 rounded mr-2 absolute right-1 top-2"
              >
                <XMarkIcon className="text-white w-5 h-5" />
              </button>

              <div className="mb-4 dark:text-white">
                <p className="text-sm">
                  Haz doble clic en el mapa para seleccionar la ubicación
                </p>
                <div className="flex gap-2">
                  <span className="font-semibold">Latitud:</span>
                  <span>{latitude}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold">Longitud:</span>
                  <span>{longitude}</span>
                </div>
              </div>

              <MapContainer
                center={position}
                zoom={13}
                style={{ height: "300px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                />
                <LocationSelector
                  position={position}
                  setPosition={setPosition}
                  setLatLng={(lat, lng) => {
                    setLatitude(lat); // Actualiza el estado de latitud
                    setLongitude(lng); // Actualiza el estado de longitud
                  }}
                />
              </MapContainer>
            </>
          </Dialog>
        </>
      )}
    </>
  );
};

export default CardTableGround;
