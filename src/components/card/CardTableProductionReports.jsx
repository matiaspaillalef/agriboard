"use client";

import { useState, useEffect, useRef } from "react";
import { formatNumber } from "@/functions/functions";
import ExportarExcel from "@/components/button/ButtonExportExcel";
import { get, set, useForm } from "react-hook-form";
import "@/assets/css/Table.css";
import {
  XMarkIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  EyeIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
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
  filterResults,
} from "@/app/api/ProductionApi";

import {
  getDataWorkers,
  getDataSquads,
  getDataContractors,
  getDataShifts,
} from "@/app/api/ManagementPeople";

import Switch from "@/components/switch";

import { array } from "zod";

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

  //Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({}); // Guarda los datos del item al editar

  const [dataGround, setDataGround] = useState([]);
  const [dataSector, setDataSector] = useState([]);
  const [dataWorkers, setDataWorkers] = useState([]);
  const [dataSqaads, setDataSquads] = useState([]);
  const [dataSpecies, setDataSpecies] = useState([]);
  const [dataVarieties, setDataVarieties] = useState([]);
  const [dataQuality, setDataQuality] = useState([]);
  const [dataSeasons, setDataSeasons] = useState([]);
  const [dataTurns, setDataTurns] = useState([]);
  const [dataScale, setDataScale] = useState([]);
  const [dataHarvestFormat, setDataHarvestFormat] = useState([]);
  const [dataContractors, setDataContractors] = useState([]);

  const [openShowUser, setOpenShowUser] = useState(false);

  //Checks para el filtro

  const [options, setOptions] = useState({
    ground: [],
    sector: [],
    squad: [],
    worker: [],
    worker_rut: [],
    squad_leader: [],
    variety: [],
    specie: [],
    quality: [],
    season: [],
    harvest_format: [],
    contractor: [],
    weigher_rut: [],
    batch: [],
  });

  useEffect(() => {
    //Con esto control el cambio de empresa y que cuando aún no se carga el company ID, no se llebne de errores la consola
    if (!companyID) {
      //console.log("Company ID is not available yet");
      return;
    }

    const fetchData = async () => {
      try {
        const fetchedDataGround = await getDataGround(companyID);
        const fetchedDataSector = await getDataSectorBarracks(companyID);
        const fetchedDataSquads = await getDataSquads(companyID);
        const fetchedDataWorkers = await getDataWorkers(companyID);
        const fetchedDataVarieties = await getDataVarieties(companyID);
        const fetchedDataSpecies = await getDataSpecies(companyID);
        const fetchedDataQuality = await getDataQuality(companyID);
        const fetchedDataSeasons = await getDataSeasons(companyID);
        const fetchedDataHarvestFormat = await getDataHarvestFormat(companyID);
        const fetchedDataScale = await getDataScale(companyID);
        const fetchedDataContractors = await getDataContractors(companyID);

        //console.log("fetchedDataGround", fetchedDataGround);

        const filteredWorkers = fetchedDataWorkers.filter(
          (worker) => worker.rut
        );

        setOptions({
          ground: fetchedDataGround,
          sector: fetchedDataSector,
          squad: fetchedDataSquads,
          worker: fetchedDataWorkers,
          worker_rut: fetchedDataWorkers,
          squad_leader: fetchedDataWorkers,
          variety: fetchedDataVarieties,
          specie: fetchedDataSpecies,
          quality: fetchedDataQuality,
          season: fetchedDataSeasons,
          harvest_format: fetchedDataHarvestFormat,
          contractor: fetchedDataContractors,
          weigher_rut: filteredWorkers,
          batch: Array.from({ length: 50 }, (_, index) => index + 1), // Array de 1 a 50
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [companyID]);

  const handleOpenShowUser = (user) => {
    setSelectedItem(user);
    setOpenShowUser(true);
    setFormData(user);
    handleOpen(user);
  };

  const handleOpen = (user) => {
    reset();
    setSelectedItem(user); // Actualiza el estado con los datos del usuario seleccionado
    setOpen(!open);
  };

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setLoading(false);
    }
  }, [data]);

  //Buscador especial para la tabla de cosecha manueales
  const handlerSearch = (e) => {
    const value = e.target.value.toLowerCase();

    const filteredData = dataReport
      .map((item) => ({
        ...item,
        ground: getNameByKey("ground", item.ground),
        sector: getNameByKey("sector", item.sector),
        harvest_date: formatDateSearch(item.harvest_date),
        specie: getNameByKey("specie", item.specie),
        variety: getNameByKey("variety", item.variety),
        quality: getNameByKey("quality", item.quality),
        contractor: getNameByKey("contractor", item.contractor),
        worker: getNameByKey("worker", item.worker),
        squad_leader: getNameByKey("squad_leader", item.squad_leader),
        season: getNameByKey("season", item.season),
        harvest_format: getNameByKey("harvest_format", item.harvest_format),
        turns: getNameByKey("turns", item.turns),
        weigher_rut: getNameByKey("weigher_rut", item.weigher_rut),
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

  const currentItems = (Array.isArray(initialData) ? initialData : []).slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const pagination = Array.from({ length: totalPages }, (_, i) => i + 1);

  //Mapero de datos para la tabla
  const dataMap = {
    ground: dataGround,
    sector: dataSector,
    worker: dataWorkers,
    squad: dataSqaads,
    squad_leader: dataWorkers,
    variety: dataVarieties,
    specie: dataSpecies,
    quality: dataQuality,
    scale: dataScale,
    season: dataSeasons,
    harvest_format: dataHarvestFormat,
    turns: dataTurns,
    contractor: dataContractors,
    weigher_rut: dataWorkers,
  };

  const getNameByKey = (key, value) => {
    const data = dataMap[key];
    const item = data?.find((item) => item.id === value);

    if (item && (key === "worker" || key === "squad_leader")) {
      return `${item.name} ${item.lastname}`;
    }

    return item?.name || value || "-";
  };

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
  if (!companyID) {
    //console.log("Company ID is not available yet");
    return;
  }

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
        fetchedDataTurns,
        fetchedDataContractors,
      ] = await Promise.all([
        getDataSectorBarracks(companyID),
        getDataSquads(companyID),
        getDataWorkers(companyID),
        getDataVarieties(companyID),
        getDataSpecies(companyID),
        getDataQuality(companyID),
        getDataHarvestFormat(companyID),
        getDataGround(companyID),
        getDataSeasons(companyID),
        getDataShifts(companyID),
        getDataContractors(companyID),
      ]);

      // Aquí puedes guardar los datos en el estado si es necesario
      setDataSector(fetchedDataSector);
      setDataSquads(fetchedDataSquads);
      setDataWorkers(fetchedDataWorkers);
      setDataVarieties(fetchedDataVarieties);
      setDataSpecies(fetchedDataSpecies);
      setDataQuality(fetchedDataQuality);
      setDataHarvestFormat(fetchedDataHarvestFormat);
      setDataGround(fetchedDataGround);
      setDataSeasons(fetchedDataSeasons);
      setDataTurns(fetchedDataTurns);
      setDataContractors(fetchedDataContractors);

      if (Array.isArray(initialData) && initialData.length > 0) {
        // Crear mapas para búsquedas rápidas
        const groundMap = new Map(fetchedDataGround.map(g => [g.id, g.name]));
        const sectorMap = new Map(fetchedDataSector.map(s => [s.id, s.name]));
        const squadMap = new Map(fetchedDataSquads.map(s => [s.id, s.name]));
        const workerMap = new Map(fetchedDataWorkers.map(w => [w.id, `${w.name} ${w.lastname}`]));
        const contractorMap = new Map(fetchedDataContractors.map(c => [c.id, c.name]));
        const specieMap = new Map(fetchedDataSpecies.map(s => [s.id, s.name]));
        const varietyMap = new Map(fetchedDataVarieties.map(v => [v.id, v.name]));
        const qualityMap = new Map(fetchedDataQuality.map(q => [q.id, q.name]));
        const harvestFormatMap = new Map(fetchedDataHarvestFormat.map(f => [f.id, f.name]));
        const seasonMap = new Map(fetchedDataSeasons.map(s => [s.id, s.name]));
        const turnMap = new Map(fetchedDataTurns.map(t => [t.id, t.name]));

        // Función para filtrar valores undefined o null
        const filterUndefinedValues = (obj) => {
          return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
        };

        // Procesar datos y construir cabeceras dinámicamente
        const rawData = await Promise.all(
          initialData.map(async (item) => {
            return {
              Zona: item.zone || '',
              Campo: groundMap.get(item.ground) || '',
              Sector: sectorMap.get(item.sector) || '',
              Cuadrilla: squadMap.get(item.squad) || '',
              "Jefe cuadrilla": workerMap.get(item.squad_leader) || '',
              Lote: item.batch || '',
              Cosechero: workerMap.get(item.worker) || '',
              "RUT Cosechero": item.worker_rut || '',
              "Fecha cosecha": item.harvest_date ? formatDate(item.harvest_date) : '',
              Contratista: contractorMap.get(item.contractor) || '',
              Especie: specieMap.get(item.specie) || '',
              Variedad: varietyMap.get(item.variety) || '',
              Cajas: item.boxes || '',
              "Kilos Caja": item.kg_boxes || '',
              Calidad: qualityMap.get(item.quality) || '',
              Hilera: item.hilera || '',
              "Formato cosecha": harvestFormatMap.get(item.harvest_format) || '',
              Pesador: workerMap.get(item.weigher_rut) || '',
              Temporada: seasonMap.get(item.season) || '',
              Turno: turnMap.get(item.turns) || '',
            };
          })
        );

        // Determinar cabeceras basadas en datos reales
        const headers = Object.keys(rawData[0]).filter(header => rawData.some(item => item[header]));

        // Crear los datos finales con cabeceras dinámicas
        const formatData = rawData.map(item => {
          const filteredItem = filterUndefinedValues(item);
          // Solo mantener las cabeceras que están en `headers`
          return Object.fromEntries(Object.entries(filteredItem).filter(([key]) => headers.includes(key)));
        });

        //Remover las columnas que no se quieren mostrar, zone e hilera
        const omitColumns = ["Zona", "Hilera", "Turno"]; // Columnas a omitir, se coloca en español ya que son las cabeceras traducidas
        const formData = formatData.map((item) => {
          return Object.fromEntries(Object.entries(item).filter(([key]) => !omitColumns.includes(key)));
        });

        setFormatInitialData(formData);

        //console.log("Datos para exportar:", omitColumns);
        //console.log("Datos para exportar:", formData);
        //console.log("Cabeceras:", headers);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, [initialData, companyID]);


  //Nuevos
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [dataReport, setDataReport] = useState([]);
  const [checkedIds, setCheckedIds] = useState([]);
  const [switchState, setSwitchState] = useState(false);

  const [fields, setFields] = useState({
    ground: { checked: false, type: "select", label: "Campo" },
    sector: { checked: false, type: "select", label: "Sector" },
    squad: { checked: false, type: "select", label: "Cuadrilla" },
    squad_leader: { checked: false, type: "select", label: "Jefe cuadrilla" },
    worker: { checked: false, type: "select", label: "Cosechero" },
    worker_rut: { checked: false, type: "select", label: "RUT Cosechero" },
    specie: { checked: false, type: "select", label: "Especie" },
    quality: { checked: false, type: "select", label: "Calidad" },
    variety: { checked: false, type: "select", label: "Variedad" },
    harvest_format: {
      checked: false,
      type: "select",
      label: "Formato cosecha",
    },
    contractor: { checked: false, type: "select", label: "Contratista" },
    date_register: { checked: false, type: "date", label: "Fecha captura" },
    weigher_rut: { checked: false, type: "select", label: "Pesador" },
    season: { checked: false, type: "select", label: "Temporada" },
    batch: { checked: false, type: "select", label: "Lote" },
  });

  

  const handleCheck = (event) => {
    const { id, checked } = event.target;
  
    // Actualiza los IDs chequeados
    setCheckedIds((prevCheckedIds) => {
      if (id === "selectAll") {
        // Marca todos los checkboxes si "selectAll" está marcado
        return checked ? Object.keys(fields) : [];
      } else {
        // Marca o desmarca el checkbox específico
        if (checked) {
          return [...prevCheckedIds, id];
        } else {
          return prevCheckedIds.filter((checkedId) => checkedId !== id);
        }
      }
    });
  
    // Actualiza el estado de los checkboxes en `fields`
    setFields((prev) => {
      const newFields = { ...prev };
      if (id === "selectAll") {
        // Selecciona/deselecciona todos los checkboxes
        Object.keys(newFields).forEach((key) => {
          newFields[key].checked = checked;
        });
      } else {
        // Actualiza solo el checkbox específico
        if (newFields[id]) {
          newFields[id].checked = checked;
        }
      }
      return newFields;
    });
  
    // Actualiza los filtros basados en la selección de todos
    setFilters((prevFilters) => {
      if (id === "selectAll") {
        // Selecciona/deselecciona todos los filtros
        return checked
          ? Object.keys(fields).reduce((acc, key) => {
              acc[key] = ""; // Asigna valor vacío o el valor deseado
              return acc;
            }, {})
          : {}; // Limpiar todos los filtros si se desmarca "selectAll"
      } else {
        // Actualiza filtros específicos según el ID
        const updatedFilters = { ...prevFilters };
        if (checked) {
          updatedFilters[id] = ""; // Asigna valor vacío o el valor deseado
        } else {
          delete updatedFilters[id]; // Elimina el filtro si se desmarca
        }
        return updatedFilters;
      }
    });
  
    setShowFilter(true);
  };

  const handleFilterChange = (event) => {
    const { id, value } = event.target;
    console.log(`Cambiando ${id} a ${value}`); // Verifica el valor capturado
    setFilters((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSwitchChange = (event) => {
    const isChecked = event.target.checked;
    setSwitchState(isChecked); // Actualiza el estado del switch
    // Actualiza el filtro para el switch
    setFilters((prev) => ({
      ...prev,
      totals: isChecked ? 1 : 0, // Convierte el estado del switch a 1 o 0
    }));

  };

  //console.log("Filtros", filters);

  const handleFilterResults = async () => {

    const filtrosConIds = Object.keys(filters).reduce((acc, key) => {
      if (key === 'totals' || key === 'from' || key == 'to' || checkedIds.includes(key)) {
        acc[key] = filters[key];
      }
      return acc;
    }, {});

    //console.log("Filtros con IDs:", filtrosConIds);

    try {
      const results = await filterResults(filtrosConIds, companyID); // Pasas los filtros y el ID de la compañía

      //console.log("Resultados filtrados:", results);
      setInitialData(results);
      setDataReport(results);
    } catch (error) {
      console.error("Error al filtrar los resultados:", error);
    }
  };

  const generateUniqueId = () => "_" + Math.random().toString(36).substr(2, 9);

  const renderField = (key, type) => {
    switch (type) {
      case "select":
        return (
          <select
            name={key}
            id={key}
            disabled={!fields[key].checked}
            onChange={handleFilterChange}
            className={`flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white ${
              !fields[key].checked ? "disabled opacity-70 !bg-gray-200" : ""
            }`}
          >
            <option key="empty" value="">
              Seleccione una opción
            </option>
            {options[key]?.map((option) => (
              <option
                key={option.id || option}
                value={key === "batch" ? option : option.id}
              >
                {key === "worker_rut"
                  ? option.rut
                  : key === "batch"
                  ? option
                  : `${option.name}${
                      key === "worker" || key === "squad_leader"
                        ? ` ${option.lastname}`
                        : ""
                    }`}
              </option>
            ))}
          </select>
        );

      case "date":
        return (
          <input
            type="date"
            id={key}
            name={key}
            onChange={handleFilterChange}
            className={`flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white ${
              !fields[key].checked ? "disabled opacity-70 !bg-gray-200" : ""
            }`}
            disabled={!fields[key].checked}
          />
        );

      case "text":
        return (
          <input
            type="text"
            id={key}
            name={key}
            className={`flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white ${
              !fields[key].checked ? "disabled opacity-70 !bg-gray-200" : ""
            }`}
            disabled={!fields[key].checked}
          />
        );

      case "number":
        return (
          <input
            type="number"
            id={key}
            name={key}
            className={`flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white ${
              !fields[key].checked ? "disabled opacity-70 !bg-gray-200 " : ""
            }`}
            disabled={!fields[key].checked}
          />
        );

      default:
        return null;
    }
  };

  const translations = {
    season: "Temporada",
    boxes: "Cajas",
    kg_boxes: "Kg Cajas",
    zone: "Zona",
    hilera: "Hilera",
    turns: "Turnos",
    temp: "Temperatura",
    wet: "Humedad",
    sync: "Sincronización",
    sync_date: "Fecha Sincronización",
    harvest_date: "Fecha Cosecha",
    ground: "Campo",
    sector: "Sector",
    squad: "Cuadrilla",
    squad_leader: "Jefe Cuadrilla",
    worker: "Cosechero",
    worker_rut: "RUT Cosechero",
    specie: "Especie",
    variety: "Variedad",
    quality: "Calidad",
    harvest_format: "Formato Cosecha",
    contractor: "Contratista",
    weigher_rut: "Pesador",
    batch: "Lote",
  };

  return (
    <>
      <div className="mb-3 filters">
        <button
          type="button"
          className="align-middle font-sans text-center disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none px-6 shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none max-w-[300px] linear mt-2 w-[170px] rounded-md bg-blueSecondary py-[12px] text-base font-medium text-white transition duration-200 hover:!bg-blueQuinary active:bg-blueTertiary dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 items-center justify-center flex gap-2 normal-case mb-4"
          onClick={() => setShowFilter(!showFilter)}
        >
          <AdjustmentsHorizontalIcon className="w-4 h-4" />
          {showFilter ? "Ocultar filtros" : "Mostrar filtros"}
        </button>

        <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-3 w-full">
          <div className="dates block items-center gap-2">
            <label
              htmlFor="from"
              className="text-sm font-semibold text-gray-800 dark:text-white flex-initial mb-5"
            >
              Fecha Desde:
            </label>
            <input
              type="date"
              id="from"
              name="from"
              onChange={handleFilterChange}
              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
            />
          </div>

          <div className="dates block items-center gap-2">
            <label
              htmlFor="to"
              className="text-sm font-semibold text-gray-800 dark:text-white mb-5"
            >
              Fecha Hasta:
            </label>
            <input
              type="date"
              id="to"
              name="to"
              onChange={handleFilterChange}
              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-[50px]">
            <div className="check flex gap-2">
              <input
                type="checkbox"
                id="selectAll"
                name="selectAll"
                onChange={handleCheck}
                className="rounded-sm"
              />
              <label
                htmlFor="selectAll"
                className="text-sm font-semibold text-gray-800 dark:text-white"
              >
                Seleccionar todo
              </label>
            </div>
          </div>
        </div>

        <div className={`allFilters ${showFilter ? "active-filters" : ""}`}>
          <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-3 w-full mt-5">
            {Object.keys(fields).map((key) => (
              <div key={key} className={`${key} block items-center gap-2`}>
                <div className={`${key}-check flex gap-2`}>
                  <input
                    type="checkbox"
                    id={key}
                    name={key}
                    checked={fields[key].checked}
                    onChange={handleCheck}
                    className="rounded-sm"
                  />
                  <label
                    htmlFor={key}
                    className="text-sm font-semibold text-gray-800 dark:text-white mb-2"
                  >
                    {fields[key].label}
                  </label>
                </div>
                {renderField(key, fields[key].type)}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 px-5 py-2 rounded-md">
          <label
            htmlFor="selectAll"
            className="text-sm font-semibold text-gray-800 dark:text-whitee"
          >
            Filtrar por totales
          </label>
          <Switch id="switchRead" defaultChecked={0} onChange={handleSwitchChange} />
        </div>

        <button
          type="button"
          className="align-middle font-sans text-center disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none px-6 shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none max-w-[300px] linear mt-4 w-[170px] rounded-md bg-blueTertiary py-[12px] text-base font-medium text-white transition duration-200 hover:!bg-blueQuinary active:bg-blueTertiary dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 items-center justify-center flex gap-2 normal-case "
          onClick={handleFilterResults}
        >
          Filtrar resultados
        </button>
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
              id="reporteProduccion"
            >
              {initialData && (
                <thead>
                  <tr role="row">
                    {Array.isArray(initialData) && initialData.length > 0
                      ? Object.keys(initialData[0]).map((header, index) => {
                          if (omitirColumns.includes(header)) {
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
                                }`}
                              >
                                {translations[header] || header}{" "}
                                {/* Usa la traducción o el nombre original */}
                              </p>
                            </th>
                          );
                        })
                      : null}
                    {/* Aquí se renderiza la columna Actions si actions es true y hay datos */}
                    {Array.isArray(initialData) &&
                      initialData.length > 0 &&
                      actions && (
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
                            <div className="text-base font-medium text-navy-700 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis">
                              {key === "harvest_date"
                                ? formatDate(row[key]) // Formatea la fecha aquí
                                : getNameByKey(key, row[key]) ||
                                  formatNumber(row[key]) ||
                                  "-"}
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
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-4" colSpan={5}>
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
              {openShowUser ? "Datos de la cosecha" : ""}
            </DialogHeader>
            <DialogBody>
              {openShowUser && (
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
        </>
      )}
    </>
  );
};

export default CardTableManualHarvesting;
