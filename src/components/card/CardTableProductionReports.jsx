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
  getDataShifts
} from "@/app/api/ManagementPeople";

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

  console.log("datosCompanies", dataTurns);

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

        const filteredWorkers = fetchedDataWorkers.filter(worker => worker.rut);

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
          getDataHarvestFormat(companyID), // Asegúrate de que esta función esté definida y retorne los datos correctos
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
          const formatData = await Promise.all(
            initialData.map(async (item) => {
              return {
                Zona: item.zone,
                Campo: fetchedDataGround.find(
                  (ground) => ground.id === item.ground
                )?.name,
                Sector: fetchedDataSector.find(
                  (sector) => sector.id === item.sector
                )?.name,
                Cuadrilla: fetchedDataSquads.find(
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
                Contratista: fetchedDataContractors.find(
                  (contractor) => contractor.id === item.contractor
                )?.name,
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
                Pesador: fetchedDataWorkers.find(
                  (worker) => worker.id === item.weigher_rut
                )?.name,
                Temporada: fetchedDataSeasons.find(
                  (season) => season.id === item.season
                )?.name,
                Turno: fetchedDataTurns.find(
                  (turn) => turn.id === item.turns
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
  }, [initialData, companyID]);

  //Nuevos
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [dataReport, setDataReport] = useState([]);

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
    //amount: { checked: false, type: 'number' },
  });

  const handleCheck = (event) => {
    const { id, checked } = event.target;

    setFields((prev) => {
      const newFields = { ...prev };
      if (id === "selectAll") {
        // Seleccionar/Deseleccionar todos los checkboxes
        Object.keys(newFields).forEach((key) => {
          newFields[key].checked = checked;
        });
      } else {
        // Actualizar solo el checkbox específico
        newFields[id].checked = checked;
      }

      return newFields;
    });

    // Actualizar filtros basados en la selección de todos
    const newFilters = checked
      ? Object.keys(fields).reduce((acc, key) => {
          acc[key] = "";
          return acc;
        }, {})
      : {};

    setFilters(newFilters);

    // Mostrar u ocultar el filtro según el estado
    setShowFilter(
      checked || Object.values(fields).some((field) => field.checked)
    );
  };

  const handleFilterChange = (event) => {
    const { id, value } = event.target;
    console.log(`Cambiando ${id} a ${value}`); // Esto te ayudará a verificar que el valor se está capturando correctamente.
    setFilters((prev) => ({
      ...prev,
      [id]: value,
    }));
};



  const handleFilterResults = async () => {
    console.log("filters", filters);
    try {
      const results = await filterResults(filters, companyID); // Pasas los filtros y el ID de la compañía

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

          <div className="flex items-center gap-2">
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
                  <strong>Zona:</strong> {getNameByKey("zone", selectedItem.zone, dataMap)}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  <strong>Campo:</strong> {getNameByKey("ground", selectedItem.ground, dataMap)}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  <strong>Sector:</strong> {getNameByKey("sector", selectedItem.sector, dataMap)}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  <strong>Contratista:</strong> {getNameByKey("contractor", selectedItem.contractor, dataMap)}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  <strong>Cuadrilla:</strong> {getNameByKey("squad", selectedItem.squad, dataMap)}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  <strong>Jefe cuadrilla:</strong> {getNameByKey("squad_leader", selectedItem.squad_leader, dataMap)}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  <strong>Lote:</strong> {getNameByKey("batch", selectedItem.batch, dataMap)}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  <strong>Cosechero:</strong> {getNameByKey("worker", selectedItem.worker, dataMap)}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  <strong>RUT cosechero:</strong> {getNameByKey("worker_rut", selectedItem.worker_rut, dataMap)}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  <strong>Fecha cosecha:</strong> {formatDate(selectedItem.harvest_date) || "-"}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  <strong>Especie:</strong> {getNameByKey("specie", selectedItem.specie, dataMap)}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  <strong>Variedad:</strong> {getNameByKey("variety", selectedItem.variety, dataMap)}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  <strong>N. de Cajas:</strong> {selectedItem.boxes || "-"}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  <strong>Kg Cajas:</strong> {selectedItem.kg_boxes || "-"}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  <strong>Calidad:</strong> {getNameByKey("quality", selectedItem.quality, dataMap)}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  <strong>Hilera:</strong> {selectedItem.hilera || "-"}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  <strong>Formato cosecha:</strong> {getNameByKey("harvest_format", selectedItem.harvest_format, dataMap)}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  <strong>Pesador:</strong> {selectedItem.weigher_rut || "-"}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  <strong>Temporada:</strong> {getNameByKey("season", selectedItem.season, dataMap)}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  <strong>Turno:</strong> {getNameByKey("turns", selectedItem.turns, dataMap)}
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
                  <strong>Fecha Sincronización:</strong> {selectedItem.sync_date ? formatDate(selectedItem.sync_date) : "-"}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  <strong>Fecha registro:</strong> {selectedItem.date_register ? formatDate(selectedItem.date_register) : '-'}
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
