"use client";

import { useState, useEffect, useRef } from "react";
import { formatNumber } from "@/functions/functions";
import ExportarExcel from "@/components/button/ButtonExportExcel";
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
import Rut from "@/components/validateRUT";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  getDataGround,
  getDataSectorBarracks,
  getDataVarieties,
  getDataSpecies,
  getDataScale,
  getDataQuality,
  getDataSeasons,
  getDataHarvestFormat,
  getDataManualHarvesting,
  updateManualHarvesting,
  createManualHarvesting,
  deleteManualHarvesting,
} from "@/app/api/ProductionApi";

import {
  getDataWorkers,
  getDataSquads,
  getDataShifts,
  getDataContractors,
} from "@/app/api/ManagementPeople";
import { sync } from "framer-motion";

const CardTableManualHarvesting = ({
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
  const [formatInitialData, setFormatInitialData] = useState([]);

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

  const [rol, setRol] = useState("");

  const [dataChangeZone, setDataChangeZone] = useState("");
  const [dataChangeGround, setDataChangeGround] = useState("");
  const [dataChangeSector, setDataChangeSector] = useState("");
  const [dataChangeSquad, setDataChangeSquad] = useState("");
  const [dataChangeWorker, setDataChangeWorker] = useState("");
  const [dataChangeSpecie, setDataChangeSpecie] = useState("");

  const [dataGround, setDataGround] = useState([]);
  const [dataSector, setDataSector] = useState([]);
  const [dataWorkers, setDataWorkers] = useState([]);
  const [dataSqaads, setDataSquads] = useState([]);
  const [dataSpecies, setDataSpecies] = useState([]);
  const [dataVarieties, setDataVarieties] = useState([]);
  const [dataQuality, setDataQuality] = useState([]);
  const [dataSeasons, setDataSeasons] = useState([]);
  const [dataScale, setDataScale] = useState([]);
  const [selectedVarieties, setSelectedVarieties] = useState([]);
  const [dataHarvestFormat, setDataHarvestFormat] = useState([]);
  const [dataContractors, setDataContractors] = useState([]);
  const [dataShifts, setDataShifts] = useState([]);

  const [openShowUser, setOpenShowUser] = useState(false);

  useEffect(() => {
    const handleNameItems = async () => {
      const ground = await getDataGround(companyID);
      const sector = await getDataSectorBarracks(companyID);
      const workers = await getDataWorkers(companyID);
      const squad = await getDataSquads(companyID);
      const varieties = await getDataVarieties(companyID);
      const species = await getDataSpecies(companyID);
      const quality = await getDataQuality(companyID);
      const seasons = await getDataSeasons(companyID);
      const scales = await getDataScale(companyID);
      const harvestFormat = await getDataHarvestFormat(companyID);
      const contractors = await getDataContractors(companyID);
      const shifts = await getDataShifts(companyID);

      setDataGround(ground.grounds);
      setDataSector(sector);
      setDataWorkers(workers);
      setDataSquads(squad.squads);
      setDataVarieties(varieties);
      setDataSpecies(species);
      setDataQuality(quality);
      setDataSeasons(seasons);
      setDataScale(scales);
      setDataHarvestFormat(harvestFormat);
      setDataContractors(contractors);
      setDataShifts(shifts);
    };
    handleNameItems();
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
    zone: "",
    ground: "",
    sector: "",
    squad: "",
    squad_leader: "",
    batch: "",
    worker: "",
    worker_rut: "",
    harvest_date: "",
    specie: "",
    variety: "",
    boxes: "",
    kg_boxes: "",
    quality: "",
    hilera: "",
    harvest_format: "",
    weigher_rut: "",
    sync: "",
    sync_date: "",
    season: "",
    turns: "",
    date_register: "",
    temp: "",
    wet: "",
    contractor: "",
    company_id: "",
  });

  const handleNameItems = (ids) => {
    if (!Array.isArray(ids)) {
      console.error("El argumento proporcionado no es un array.");
      return "";
    }

    // Filtrar nombres vacíos y unirlos con comas si hay más de uno
    const filteredNames = names.filter((name) => name !== "");
    return filteredNames.join(filteredNames.length > 1 ? ", " : "");
  };

  const handleOpenShowUser = (user) => {
    setRutValido(true);
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
    setRutValido(true);
    setIsEdit(true);
    setOpenShowUser(false);
    setFormData(user);
    setSelectedItem(user);
    handleOpen(user);

    // Setear los valores de los campos en el formulario al momento de levntar el modal de editar y se setean los valores en los campos select
    setDataChangeZone(user.zone);
    setDataChangeGround(user.ground);
    setDataChangeSector(user.sector);
    setDataChangeSquad(user.squad);

    setDataChangeWorker(user.worker);
    setDataChangeSpecie(user.specie);

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

      const updateData = {
        id: Number(data.id) || null,
        zone: data.zone,
        ground: data.ground,
        sector: data.sector,
        squad: data.squad ? data.squad : null,
        squad_leader: data.squad_leader ? data.squad_leader : null,
        batch: data.batch ? data.batch : null,
        worker: data.worker ? data.worker : null,
        worker_rut: data.worker_rut ? data.worker_rut : null,
        harvest_date: data.harvest_date,
        specie: data.specie,
        variety: data.variety,
        boxes: data.boxes ? Number(data.boxes) : null,
        kg_boxes: data.kg_boxes ? Number(data.kg_boxes) : null,
        quality: data.quality ? data.quality : null,
        hilera: data.hilera ? Number(data.hilera) : null,
        harvest_format: data.harvest_format,
        weigher_rut: data.weigher_rut ? data.weigher_rut : null,
        sync: data.sync ? data.sync : null,
        sync_date: data.sync_date ? data.sync_date : null,
        season: data.season ? data.season : null,
        turns: data.turns ? data.turns : null,
        date_register: data.date_register ? data.date_register : null,
        temp: data.temp ? data.temp : null,
        wet: data.wet ? data.wet : null,
        contractor: data.contractor ? data.contractor : null,
        source: 1,
        company_id: Number(companyID),
      };

      const updateItemApi = await updateManualHarvesting(updateData);
      const dataNew = await getDataManualHarvesting(companyID);

      if (updateItemApi === "OK") {
        const updatedList = initialData.map((item) =>
          item.id === Number(data.id) ? { ...item, ...updateData } : item
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

  const handleOpenAlert = (index, id, harvest_date, ground) => {
    setItemToDelete({ index, id, harvest_date, ground });
    setOpenAlert(true);
    setOpenAlertClone(false);
  };

  const handleCloneAlert = (
    index,
    zone,
    ground,
    sector,
    squad,
    squad_leader,
    batch,
    worker,
    worker_rut,
    harvest_date,
    specie,
    variety,
    boxes,
    kg_boxes,
    quality,
    hilera,
    harvest_format,
    weigher_rut,
    sync,
    sync_date,
    season,
    turns,
    date_register,
    temp,
    wet,
    contractor,
    source,
    company_id
  ) => {
    setItemToClone({
      zone,
      ground,
      sector,
      squad,
      squad_leader,
      batch,
      worker,
      worker_rut,
      harvest_date,
      specie,
      variety,
      boxes,
      kg_boxes,
      quality,
      hilera,
      harvest_format,
      weigher_rut,
      sync,
      sync_date,
      season,
      turns,
      date_register,
      temp,
      wet,
      contractor,
      source,
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
      const deleteItem = await deleteManualHarvesting(id);

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
      zone,
      ground,
      sector,
      squad,
      squad_leader,
      batch,
      worker,
      worker_rut,
      harvest_date,
      specie,
      variety,
      boxes,
      kg_boxes,
      quality,
      hilera,
      harvest_format,
      weigher_rut,
      sync,
      sync_date,
      season,
      turns,
      date_register,
      temp,
      wet,
      contractor,
      source,
      company_id,
    } = itemToClone;

    try {
      const cloneItem = await createManualHarvesting(itemToClone);
      const dataNew = await getDataManualHarvesting(companyID);

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
    console.log(data);
    try {
      // Preparar los datos transformados
      const transformedData = {
        zone: data.zone || null,
        ground: Number(data.ground) || null,
        sector: Number(data.sector) || null,
        squad: data.squad ? Number(data.squad) : null,
        squad_leader: data.squad_leader || null,
        batch: data.batch ? Number(data.batch) : null,
        worker: data.worker ? Number(data.worker) : null,
        worker_rut: data.worker_rut || null,
        harvest_date: data.harvest_date || null,
        specie: data.specie || null,
        variety: data.variety || null,
        boxes: data.boxes ? Number(data.boxes) : null,
        kg_boxes: data.kg_boxes ? Number(data.kg_boxes) : null,
        quality: data.quality || null,
        hilera: data.hilera ? Number(data.hilera) : null,
        harvest_format: data.harvest_format || null,
        weigher_rut: data.weigher_rut || null,
        sync: data.sync || null,
        sync_date: data.sync_date || null,
        season: data.season ? Number(data.season) : null,
        turns: data.turns ? Number(data.turns) : null,
        date_register: data.date_register || null,
        temp: data.temp || null,
        wet: data.wet || null,
        contractor: data.contractor ? Number(data.contractor) : null,
        source: 1,
        company_id: Number(data.company_id) || null,
      };
  
  
      // Enviar datos al servidor
      const createItem = await createManualHarvesting(transformedData);
      const dataNew = await getDataManualHarvesting(companyID);
  
      if (createItem === "OK") {
        const updatedData = [...initialData, transformedData];
        
        setInitialData(updatedData);
        setInitialData(dataNew);
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

  //Buscador especial para la tabla de cosecha manueales
  const handlerSearch = (e) => {
    const value = e.target.value.toLowerCase();

    const filteredData = data
      .map((item) => ({
        ...item,
        ground: getNameByKey("ground", item.ground),
        sector: getNameByKey("sector", item.sector),
        harvest_date: formatDateSearch(item.harvest_date),
        specie: getNameByKey("specie", item.specie),
        variety: getNameByKey("variety", item.variety),
        harvest_format: getNameByKey("harvest_format", item.harvest_format),
      }))
      .filter((item) => {
        return Object.values(item).some((val) =>
          String(val).toLowerCase().includes(value)
        );
      });

    setInitialData(filteredData); // Actualiza initialData con los resultados filtrados
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

  const currentItems = Array.isArray(initialData) ? initialData.slice(indexOfFirstItem, indexOfLastItem) : [];

  const pagination = Array.from({ length: totalPages }, (_, i) => i + 1);

  //Mapero de datos para la tabla
  const dataMap = {
    ground: dataGround,
    sector: dataSector,
    worker: dataWorkers,
    squad_leader: dataWorkers,
    squad: dataSqaads,
    variety: dataVarieties,
    specie: dataSpecies,
    quality: dataQuality,
    scale: dataScale,
    season: dataSeasons,
    harvest_format: dataHarvestFormat,
    contractor: dataContractors,
    turns: dataShifts,
  };
  
  const getNameByKey = (key, value) => {
    const data = dataMap[key];
    if (key === "worker" || key === "squad_leader") {
      const worker = data?.find((item) => item.id === value);
      return worker ? `${worker.name} ${worker.lastname}` : value;
    } else {
      return data?.find((item) => item.id === value)?.name || value;
    }
  };

  const today = new Date().toISOString().split('T')[0]

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `${day} de ${month} de ${year}`;
  };

  const formatDateSearch = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toISOString(); // Devuelve una cadena de fecha ISO o 'Invalid Date'
  };

  function formatDateForInput(dateString) {
    if (!dateString) return "";
    return dateString.substring(0, 10);
  }

  //Exportar Excel datas de front
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Aquí llamamos a cada función solo una vez
        const [
          fetchedDataSector,
          fetchedDataSquads,
          fetchedDataWorkers,
          fetchedDataVarieties,
          fetchedDataSpecies,
          fetchedDataQuality,
          fetchedDataHarvestFormat,
          fetchedDataGround,
          fetchedDataSeasons,
          fetchedDataContractors,
        ] = await Promise.all([
          getDataSectorBarracks(companyID),
          getDataSquads(companyID),
          getDataWorkers(companyID),
          getDataVarieties(companyID),
          getDataSpecies(companyID),
          getDataQuality(companyID),
          getDataHarvestFormat(companyID), // Asegúrate de que esta función esté definida y retorne los datos correctos
          getDataGround(companyID),
          getDataSeasons(companyID),
          getDataContractors(companyID),
        ]);

        // Aquí puedes guardar los datos en el estado si es necesario
        setDataSector(fetchedDataSector);
        setDataSquads(fetchedDataSquads.squads);
        setDataWorkers(fetchedDataWorkers);
        setDataVarieties(fetchedDataVarieties);
        setDataSpecies(fetchedDataSpecies);
        setDataQuality(fetchedDataQuality);
        setDataHarvestFormat(fetchedDataHarvestFormat);
        setDataGround(fetchedDataGround.grounds);
        setDataSeasons(fetchedDataSeasons);
        setDataContractors(fetchedDataContractors);

        if (initialData) {
          const formatData = await Promise.all(
            initialData.map(async (item) => {
              return {
                Zona: item.zone,
                Campo: fetchedDataGround.grounds.find(
                  (ground) => ground.id === item.ground
                )?.name,
                Sector: fetchedDataSector.find(
                  (sector) => sector.id === item.sector
                )?.name,
                Cuadrilla: fetchedDataSquads.squads.find(
                  (squad) => squad.id === item.squad
                )?.name,
                "Jefe cuadrilla": fetchedDataWorkers.find(
                  (worker) => worker.id === item.squad_leader
                )?.name,
                Lote: item.batch,
                Cosechero:
                  fetchedDataWorkers.find((worker) => worker.id === item.worker)
                    ?.name +
                  " " +
                  fetchedDataWorkers.find((worker) => worker.id === item.worker)
                    ?.lastname,
                "RUT Cosechero": item.worker_rut,
                "Fecha cosecha": formatDate(item.harvest_date),
                Especie: fetchedDataSpecies.find(
                  (specie) => specie.id === item.specie
                )?.name,
                Variedad: fetchedDataVarieties.find(
                  (variety) => variety.id === item.variety
                )?.name,
                Cajas: item.boxes,
                "Kilos Caja": item.kg_boxes,
                Calidad: fetchedDataQuality.find(
                  (quality) => quality.id === item.quality
                )?.name,
                Hilera: item.hilera,
                "Formato cosecha": fetchedDataHarvestFormat.find(
                  (format) => format.id === item.harvest_format
                )?.name,
                "RUT Pesador": item.weigher_rut,
                Sincronizado: item.sync,
                "Fecha sincronización": item.sync_date,
                Temporada: fetchedDataSeasons.find(
                  (season) => season.id === item.season
                )?.name,
                Turnos: item.turns,
                "Fecha registro": item.date_register,
                Temp: item.temp,
                Humedad: item.wet,
                Contratista: fetchedDataContractors.find(
                  (contractor) => contractor.id === item.contractor
                )?.name,
              };
            })
          );

          //console.log("formatData", formatData);
          setFormatInitialData(formatData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    fetchData();
  }, [initialData, companyID]);

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
                    data={formatInitialData}
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
                              ) : key === "harvest_date" ? (
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
                                row.zone,
                                row.ground,
                                row.sector,
                                row.squad,
                                row.squad_leader,
                                row.batch,
                                row.worker,
                                row.worker_rut,
                                row.harvest_date,
                                row.specie,
                                row.variety,
                                Number(row.boxes),
                                Number(row.kg_boxes),
                                row.quality,
                                row.hilera,
                                row.harvest_format,
                                row.weigher_rut,
                                row.sync,
                                row.sync_date,
                                row.season,
                                row.turns,
                                row.date_register,
                                row.temp,
                                row.wet,
                                row.contractor,
                                row.source ? 1 : 1,
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
                                row.harvest_date
                                  ? formatDate(row.harvest_date)
                                  : "",
                                row.ground
                                  ? getNameByKey("groud", row.ground)
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
                ? "Datos de la cosecha"
                : isEdit
                ? "Editar cosecha"
                : "Nueva cosecha"}
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

                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                    {" "}
                    Ubicación
                  </h3>

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
                        onChange={(e) => {
                          setDataChangeZone(e.target.value);
                          setDataChangeGround("");
                          setDataChangeSector("");
                        }}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      >
                        <option key="0" value="">
                          Elige una zona
                        </option>
                        <option key="1" value="Norte">
                          Norte
                        </option>
                        <option key="2" value="Centro">
                          Centro
                        </option>
                        <option key="3" value="Sur">
                          Sur
                        </option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="ground"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Campo
                      </label>
                      <select
                        name="ground"
                        id="ground"
                        required={true}
                        {...register("ground")}
                        value={dataChangeGround} // Usar value en lugar de defaultValue
                        onChange={(e) => {
                          setDataChangeGround(e.target.value);
                          setDataChangeSector(""); // Resetear sector cuando cambia el campo
                        }}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      >
                        <option key="0" value="">
                          Elige un campo
                        </option>
                        {Array.isArray(dataGround) && dataGround.length > 0 ? (
                          dataGround.filter(
                            (ground) =>
                              ground.status != 0 &&
                              ground.zone == dataChangeZone
                          ).length > 0 ? (
                            dataGround
                              .filter(
                                (ground) =>
                                  ground.status != 0 &&
                                  ground.zone == dataChangeZone
                              )
                              .map((ground) => (
                                <option key={ground.id} value={ground.id}>
                                  {ground.name}
                                </option>
                              ))
                          ) : (
                            <option key="no-fields" value="">
                              No hay campos
                            </option>
                          )
                        ) : (
                          <option key="no-fields" value="">
                            No hay campos
                          </option>
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
                        value={dataChangeSector} // Usar value en lugar de defaultValue
                        onChange={(e) => {
                          setDataChangeSector(e.target.value);
                        }}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      >
                        <option key="0" value="">
                          Elige un sector
                        </option>
                        {Array.isArray(dataSector) && dataSector.length > 0 ? (
                          dataSector.filter(
                            (sector) =>
                              sector.status != 0 &&
                              sector.ground == dataChangeGround
                          ).length > 0 ? (
                            dataSector
                              .filter(
                                (sector) =>
                                  sector.status != 0 &&
                                  sector.ground == dataChangeGround
                              )
                              .map((sector) => (
                                <option key={sector.id} value={sector.id}>
                                  {sector.name}
                                </option>
                              ))
                          ) : (
                            <option key="no-fields" value="">
                              No hay sectores
                            </option>
                          )
                        ) : (
                          <option value="">No hay sectores</option>
                        )}
                      </select>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="squad"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Cuadrillas
                      </label>
                      <select
                        name="squad"
                        id="squad"
                        required={true}
                        {...register("squad")}
                        defaultValue={selectedItem ? selectedItem.squad : ""}
                        onChange={(e) => {
                          setDataChangeSquad(e.target.value);
                        }}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      >
                        <option value="">Elige una cuadrilla</option>
                        {Array.isArray(dataSqaads) && dataSqaads.length > 0 ? (
                          dataSqaads.map(
                            (squad) =>
                              squad.status != 0 && (
                                <option key={squad.id} value={squad.id}>
                                  {squad.name}
                                </option>
                              )
                          )
                        ) : (
                          <option value="">No hay cuadrillas</option>
                        )}
                      </select>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="squad_leader"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Jefe de cuadrilla
                      </label>
                      <input
                        name="squad_leader"
                        id="squad_leader"
                        required={true}
                        {...register("squad_leader")}
                        readOnly={true}
                        defaultValue={
                          selectedItem ? selectedItem.squad_leader : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="batch"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Lote
                      </label>
                      <select
                        name="batch"
                        id="batch"
                        required={true}
                        {...register("batch")}
                        defaultValue={selectedItem ? selectedItem.batch : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      >
                        <option value="">Elige un lote</option>

                        {Array.from({ length: 50 }, (_, i) => i + 1).map(
                          (lote) => (
                            <option key={lote} value={lote}>
                              {lote}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-[50px] mb-3">
                    {" "}
                    Datos cosecha
                  </h3>

                  <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="worker"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Cosechero
                      </label>
                      <select
                        name="worker"
                        id="worker"
                        required={true}
                        {...register("worker")}
                        onChange={(e) => {
                          setDataChangeWorker(e.target.value);
                        }}
                        defaultValue={selectedItem ? selectedItem.worker : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      >
                        {dataChangeSquad ? (
                          dataSqaads.length > 0 ? (
                            <>
                              <option value="">Elige cosechero</option>
                              {dataSqaads
                                .filter((squad) => squad.id == dataChangeSquad)
                                .map((squad) =>
                                  JSON.parse(squad.workers).length > 0 ? (
                                    JSON.parse(squad.workers).map(
                                      (worker) =>
                                        worker.status != 0 &&
                                        dataWorkers
                                          .filter(
                                            (workerSelect) =>
                                              workerSelect.id == worker
                                          )
                                          .map((workerSelect) => (
                                            <option
                                              key={workerSelect.id}
                                              value={workerSelect.id}
                                            >
                                              {workerSelect.name +
                                                " " +
                                                workerSelect.lastname}
                                            </option>
                                          ))
                                    )
                                  ) : (
                                    <option value="">
                                      No hay trabajadores
                                    </option>
                                  )
                                )}
                            </>
                          ) : (
                            <option value="">No hay trabajadores</option>
                          )
                        ) : (
                          <option value="">No hay trabajadores</option>
                        )}
                      </select>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="worker_rut"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Rut cosechero
                      </label>
                      <input
                        type="text"
                        name="worker_rut"
                        id="worker_rut"
                        required={true}
                        {...register("worker_rut")}
                        readOnly={true}
                        defaultValue={
                          selectedItem
                            ? selectedItem.worker_rut
                            : dataChangeWorker.length > 0
                            ? dataWorkers
                                .filter(
                                  (worker) => worker.id == dataChangeWorker
                                )
                                .map((worker) => worker.rut)
                            : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="harvest_date"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Fecha cosecha
                      </label>
                      <input
                        type="date"
                        name="harvest_date"
                        id="harvest_date"
                        required={true}
                        {...register("harvest_date")}
                        defaultValue={
                          selectedItem
                            ? formatDateForInput(selectedItem.harvest_date)
                            : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
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
                        onChange={(e) => {
                          setDataChangeSpecie(e.target.value);
                        }}
                        defaultValue={selectedItem ? selectedItem.specie : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      >
                        <option value="">Elige una especie</option>
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
                        <>
                          <option value="">Elige una variedad</option>
                          {Array.isArray(dataSpecies) &&
                          dataSpecies.length > 0 ? (
                            dataSpecies
                              .filter((specie) => specie.id == dataChangeSpecie)
                              .map((specie) =>
                                Array.isArray(specie.varieties) &&
                                specie.varieties.length > 0 ? (
                                  <>
                                    <option key="empty" value="">
                                      Elige una variedad
                                    </option>
                                    {specie.varieties.map((variety) =>
                                      dataVarieties
                                        .filter(
                                          (varietySelect) =>
                                            varietySelect.id == variety
                                        )
                                        .map((varietySelect) => (
                                          <option
                                            key={varietySelect.id}
                                            value={varietySelect.id}
                                          >
                                            {varietySelect.name}
                                          </option>
                                        ))
                                    )}
                                  </>
                                ) : (
                                  <option value="">No hay variedades</option>
                                )
                              )
                          ) : (
                            <option value="">No hay variedades</option>
                          )}
                        </>
                      </select>
                    </div>

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
                        step="0.01"
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
                        Kg Cajas
                      </label>
                      <input
                        type="number"
                        name="kg_boxes"
                        id="kg_boxes"
                        required={true}
                        step="0.01"
                        {...register("kg_boxes")}
                        defaultValue={selectedItem ? selectedItem.kg_boxes : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

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
                        <>
                          <option value="">Elige una calidad</option>
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
                        </>
                      </select>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="hilera"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Hilera
                      </label>
                      <input
                        type="number"
                        name="hilera"
                        id="hilera"
                        step="0.01"
                        {...register("hilera")}
                        defaultValue={selectedItem ? selectedItem.hilera : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="harvest_format"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Formato cosecha
                      </label>
                      <select
                        name="harvest_format"
                        id="harvest_format"
                        required={true}
                        {...register("harvest_format")}
                        defaultValue={
                          selectedItem ? selectedItem.harvest_format : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      >
                        <>
                          <option value="">Elige un formato de cosecha</option>
                          {Array.isArray(dataHarvestFormat) &&
                          dataHarvestFormat.length > 0 ? (
                            dataHarvestFormat.map(
                              (harvest_format) =>
                                harvest_format.status != 0 && (
                                  <option
                                    key={harvest_format.id}
                                    value={harvest_format.id}
                                  >
                                    {harvest_format.name}
                                  </option>
                                )
                            )
                          ) : (
                            <option value="">No hay formatos de cosecha</option>
                          )}
                        </>
                      </select>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="weigher_rut"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Pesador
                      </label>
                      <select
                        name="weigher_rut"
                        id="weigher_rut"
                        {...register("weigher_rut")}
                        defaultValue={
                          selectedItem ? selectedItem.weigher_rut : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      >
                        {dataChangeSquad ? (
                          dataSqaads.length > 0 ? (
                            <>
                              <option value="">Elige pesador</option>
                              {dataSqaads
                                .filter((squad) => squad.id == dataChangeSquad)
                                .map((squad) =>
                                  JSON.parse(squad.workers).length > 0 ? (
                                    JSON.parse(squad.workers).map(
                                      (worker) =>
                                        worker.status != 0 &&
                                        dataWorkers
                                          .filter(
                                            (workerSelect) =>
                                              workerSelect.id == worker
                                          )
                                          .map((workerSelect) => (
                                            <option
                                              key={workerSelect.id}
                                              value={workerSelect.rut}
                                            >
                                              {workerSelect.name +
                                                " " +
                                                workerSelect.lastname}
                                            </option>
                                          ))
                                    )
                                  ) : (
                                    <option value="">No hay pesadores</option>
                                  )
                                )}
                            </>
                          ) : (
                            <option value="">No hay pesadores</option>
                          )
                        ) : (
                          <option value="">No hay pesadores</option>
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
                        {...register("season")}
                        defaultValue={selectedItem ? selectedItem.season : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      >
                        <option value="">Elige una temporada</option>
                        {Array.isArray(dataSeasons) &&
                        dataSeasons.length > 0 ? (
                          dataSeasons.map((season) => (
                            <option key={season.id} value={season.id}>
                              {season.name}
                            </option>
                          ))
                        ) : (
                          <option value="">No hay temporadas</option>
                        )}
                      </select>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="turns"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Turno
                      </label>
                      <select
                        name="turns"
                        id="turns"
                        {...register("turns")}
                        defaultValue={selectedItem ? selectedItem.turns : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      >
                        <option value="">Elige un turno</option>
                        {Array.isArray(dataShifts) && dataShifts.length > 0 ? (
                          dataShifts.map(
                            (turn) =>
                              turn.status != 0 && (
                                <option key={turn.id} value={turn.id}>
                                  {turn.name}
                                </option>
                              )
                          )
                        ) : (
                          <option value="">No hay turnos</option>
                        )}
                      </select>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="contractor"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Contratista
                      </label>
                      <select
                        name="contractor"
                        id="contractor"
                        {...register("contractor")}
                        defaultValue={
                          selectedItem ? selectedItem.contractor : ""
                        }
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      >
                        <option value="">Elige un contratista</option>
                        {Array.isArray(dataContractors) &&
                        dataContractors.length > 0 ? (
                          dataContractors.map(
                            (contractor) =>
                              contractor.status != 0 && (
                                <option
                                  key={contractor.id}
                                  value={contractor.id}
                                >
                                  {contractor.name}
                                </option>
                              )
                          )
                        ) : (
                          <option value="">No hay contratistas</option>
                        )}
                      </select>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="temp"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Temperatura
                      </label>
                      <input
                        type="number"
                        name="temp"
                        id="temp"
                        step="0.01"
                        {...register("temp")}
                        defaultValue={selectedItem ? selectedItem.temp : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="wet"
                        className="text-sm font-semibold text-gray-800 dark:text-white"
                      >
                        Humedad
                      </label>
                      <input
                        type="number"
                        name="wet"
                        id="wet"
                        step="0.01"
                        {...register("wet")}
                        defaultValue={selectedItem ? selectedItem.wet : ""}
                        className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                      />
                    </div>
                  </div>
                  

                  <input
                    type="hidden"
                    name="date_register"
                    {...register("date_register")}
                    defaultValue={today}
                  />

                  <input
                    type="hidden"
                    name="company_id"
                    {...register("company_id")}
                    defaultValue={companyID}
                  />

                  <input
                    type="hidden"
                    name="source"
                    {...register("source")}
                    defaultValue={1}
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
                    <strong>Zona:</strong>{" "}
                    {getNameByKey("zone", selectedItem.zone, dataMap)}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Campo:</strong>{" "}
                    {getNameByKey("ground", selectedItem.ground, dataMap)}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Sector:</strong>{" "}
                    {getNameByKey("sector", selectedItem.sector, dataMap)}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Contratista:</strong>{" "}
                    {getNameByKey(
                      "contractor",
                      selectedItem.contractor,
                      dataMap
                    )}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Cuadrilla:</strong>{" "}
                    {getNameByKey("squad", selectedItem.squad, dataMap)}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Jefe cuadrilla:</strong>{" "}
                    {getNameByKey(
                      "squad_leader",
                      selectedItem.squad_leader,
                      dataMap
                    )}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Lote:</strong>{" "}
                    {getNameByKey("batch", selectedItem.batch, dataMap)}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Cosechero:</strong>{" "}
                    {getNameByKey("worker", selectedItem.worker, dataMap)}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>RUT cosechero:</strong>{" "}
                    {getNameByKey(
                      "worker_rut",
                      selectedItem.worker_rut,
                      dataMap
                    )}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Fecha cosecha:</strong>{" "}
                    {formatDate(selectedItem.harvest_date) || "-"}
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
                    <strong>N. de Cajas:</strong> {selectedItem.boxes || "-"}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Kg Cajas:</strong> {selectedItem.kg_boxes || "-"}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Calidad:</strong>{" "}
                    {getNameByKey("quality", selectedItem.quality, dataMap)}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Hilera:</strong> {selectedItem.hilera || "-"}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Formato cosecha:</strong>{" "}
                    {getNameByKey(
                      "harvest_format",
                      selectedItem.harvest_format,
                      dataMap
                    )}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Pesador:</strong> {selectedItem.weigher_rut || "-"}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Temporada:</strong>{" "}
                    {getNameByKey("season", selectedItem.season, dataMap)}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Turno:</strong>{" "}
                    {getNameByKey("turns", selectedItem.turns, dataMap)}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Tempratura:</strong> {selectedItem.temp || "-"}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Humedad:</strong> {selectedItem.wet || "-"}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Sincronización:</strong> {selectedItem.sync || "-"}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Fecha Sincronización:</strong>{" "}
                    {selectedItem.sync_date
                      ? formatDate(selectedItem.sync_date)
                      : "-"}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    <strong>Fecha registro:</strong>{" "}
                    {selectedItem.date_register
                      ? formatDate(selectedItem.date_register)
                      : "-"}
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
                ¿Seguro que desea {openAlert ? "eliminar" : "clonar"} la cosecha
                del{" "}
                <strong className="font-bold">
                  {openAlert
                    ? itemToDelete.harvest_date
                    : formatDate(itemToClone.harvest_date)}
                </strong>{" "}
                del campo{" "}
                <strong className="font-bold">
                  {openAlert
                    ? getNameByKey("ground", itemToDelete.ground, dataMap)
                    : getNameByKey("ground", itemToClone.ground, dataMap)}
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

export default CardTableManualHarvesting;
