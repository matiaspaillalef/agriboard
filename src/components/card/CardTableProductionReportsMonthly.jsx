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
  filterResultsMonthly
} from "@/app/api/ProductionApi";


import { getDataUser } from "@/app/api/ConfiguracionApi";

import {
  getDataWorkers,
  getDataSquads,
  getDataContractors,
  getDataShifts,
} from "@/app/api/ManagementPeople";

import Switch from "@/components/switch";

import { array } from "zod";

const CardTableProductionReports = ({
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
  const [dataUsers, setDataUsers] = useState([]);

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
        const fetchedDataUsers = await getDataUser(companyID);

        let filteredWorkers = [];

        if (Array.isArray(fetchedDataWorkers)) {
          // Filtra los trabajadores que tienen un rut
          filteredWorkers = fetchedDataWorkers.filter(
            (worker) => worker.rut
          );
        }

        console.log("fetchedDataUsers", fetchedDataWorkers);
        setOptions({
          ground: fetchedDataGround.grounds,
          sector: fetchedDataSector,
          squad: fetchedDataSquads.squads,
          worker: fetchedDataWorkers,
          worker_rut: fetchedDataWorkers,
          squad_leader: fetchedDataWorkers,
          variety: fetchedDataVarieties,
          specie: fetchedDataSpecies,
          quality: fetchedDataQuality,
          season: fetchedDataSeasons,
          harvest_format: fetchedDataHarvestFormat,
          contractor: fetchedDataContractors,
          weigher_rut: fetchedDataUsers.usuarios
            .filter(user => user.id_rol == 6 && user.id_company == companyID)  // Filtrar por rol 6 y companyID
            .map(user => ({ id: user.id, name: `${user.name} ${user.lastname}` })),
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

  const currentItems = Array.isArray(initialData) ? initialData.slice(indexOfFirstItem, indexOfLastItem) : [];

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
    weigher_rut: dataUsers,
  };

  const getNameByKey = (key, value) => {
    const data = dataMap[key];
    const item = data?.find((item) => item.id === value);

    if (key === 'weigher_rut') {
      // Buscar el usuario por su id (que es 'value' en este caso)
      const user = dataUsers.find(u => u.id === Number(value));
      if (user) {
        // Si se encuentra, devuelve el nombre completo
        return `${user.name} ${user.lastname}`;
      }

      return '-';
    }

    if ((key === "worker" || key === "squad_leader")) {
      return `${item?.name} ${item?.lastname}`;
    }

    return item?.name || value || "-";
  };

  const formatDate = (isoDate) => {
    //console.log(isoDate);
    // Crear el objeto Date a partir de la fecha UTC recibida
    let dateTime = new Date(isoDate);

    // Formatear la fecha en el formato deseado: DD-MM-YYYY, HH:mm
    let day = String(dateTime.getDate()).padStart(2, '0');
    let month = String(dateTime.getMonth() + 1).padStart(2, '0');
    let year = dateTime.getFullYear();
    let hours = String(dateTime.getHours()).padStart(2, '0');
    let minutes = String(dateTime.getMinutes()).padStart(2, '0');
    let formattedDate = `${day}-${month}-${year}, ${hours}:${minutes}`;
    //console.log(formattedDate);

    return formattedDate;
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
  const [switchState, setSwitchState] = useState(false);
  useEffect(() => {
    if (!companyID) {
      return;
    }
  
    const fetchData = async () => {
      try {
        // Llamamos a las APIs para obtener los datos necesarios
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
          fetchedDataUsers,
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
          getDataUser(companyID),
        ]);
  
        // Guardamos los datos que se obtienen de las APIs
        setDataSector(fetchedDataSector);
        setDataWorkers(fetchedDataWorkers);
        setDataVarieties(fetchedDataVarieties);
        setDataSpecies(fetchedDataSpecies);
        setDataQuality(fetchedDataQuality);
        setDataHarvestFormat(fetchedDataHarvestFormat);
  
        if (fetchedDataGround.code === "OK") {
          const groundData = fetchedDataGround.grounds;
          setDataGround(groundData);
        }
  
        if (fetchedDataSquads.code === "OK") {
          const squadsData = fetchedDataSquads.squads;
          setDataSquads(squadsData);
        }
  
        if (fetchedDataTurns.code === "OK") {
          const turnsData = fetchedDataTurns.shifts;
          setDataTurns(turnsData);
        }
  
        // Procesamos los datos de cosecha
        const workerMap = new Map(fetchedDataWorkers.map(w => [w.id, `${w.name} ${w.lastname}`]));
        const specieMap = new Map(fetchedDataSpecies.map(s => [s.id, s.name]));
        const harvestData = initialData || [];
  
        // Formateamos los datos de cosecha
        const formattedData = harvestData.reduce((acc, item) => {
          const workerName = workerMap.get(item.worker);
  
          // Parsear la fecha correctamente desde 'YYYY-MM-DD HH:MM:SS'
          let harvestDate;
          if (item.harvest_date) {
            // Tomar solo la parte de la fecha antes del espacio
            const dateString = item.harvest_date.split(' ')[0]; // "2024-12-02"
            harvestDate = new Date(dateString); // Convertir en objeto Date
          }
  
          // Si la fecha no es válida, omitir el registro
          if (!harvestDate || isNaN(harvestDate.getTime())) {
            console.error('Fecha de cosecha inválida para:', item);
            return acc; // Si la fecha es inválida, simplemente ignoramos este item
          }
  
          const harvestDay = harvestDate.getDate(); // Obtener el día (1-31) de la fecha de cosecha

          console.log(`Cosechero: ${workerName}, Día: ${harvestDay}`); // Depuración
  
          // Crear una nueva entrada para el trabajador si no existe
          if (!acc[workerName]) {
            acc[workerName] = {
              Cosechero: workerName,
              RUT: item.worker_rut,
              Especie: specieMap.get(item.specie),
              ...Array.from({ length: 31 }, (_, i) => `Día ${i + 1}`).reduce((daysAcc, day) => {
                daysAcc[day] = 0; // Inicializamos todos los días con 0
                return daysAcc;
              }, {})
            };
          }
  
          // Verificar que el campo 'kg_boxes' esté disponible y asignarlo
          const kgBoxes = item.kg_boxes || 0; // Si no hay kg_boxes, asignamos 0
          console.log(`Cosechero: ${workerName}, Día: ${harvestDay}, Kg Cajas: ${kgBoxes}`); // Depuración
  
          // Asignar los kilos al día correspondiente
          const dayKey = `Día ${harvestDay}`;
          acc[workerName][dayKey] = kgBoxes; // Asignar los kg_boxes al día correspondiente
  
          return acc;
        }, {});
  
        // Convertimos los datos a un array para ser renderizado
        const finalData = Object.values(formattedData);
  
        // Guardamos los datos finales formateados
        setFormatInitialData(finalData);
  
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [companyID, initialData]); // Dependencia de companyID y initialData
  
  
  
  
  
  
  /*useEffect(() => {
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
          fetchedDataUsers,
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
          getDataUser(companyID),
        ]);

        // Aquí puedes guardar los datos en el estado si es necesario
        setDataSector(fetchedDataSector);
        setDataWorkers(fetchedDataWorkers);
        setDataVarieties(fetchedDataVarieties);
        setDataSpecies(fetchedDataSpecies);
        setDataQuality(fetchedDataQuality);
        setDataHarvestFormat(fetchedDataHarvestFormat);

        if (fetchedDataGround.code === "OK") {
          const groundData = fetchedDataGround.grounds;
          setDataGround(groundData);
        }

        if (fetchedDataSquads.code === "OK") {
          const squadsData = fetchedDataSquads.squads;
          setDataSquads(squadsData);
        }

        if (fetchedDataTurns.code === "OK") {
          const turnsData = fetchedDataTurns.shifts;
          setDataTurns(turnsData);
        }

        setDataSeasons(fetchedDataSeasons);
        setDataTurns(fetchedDataTurns);
        setDataContractors(fetchedDataContractors);


        if (fetchedDataUsers.code === "OK") {
          const Users = fetchedDataUsers.usuarios;
          setDataUsers(Users);
        }

        //console.log("fetchedDataGround", fetchedDataSeasons);

        if (Array.isArray(initialData) && initialData.length > 0) {
          // Crear mapas para búsquedas rápidas
          let groundMap = new Map();
          let squadMap = new Map();
          let shiftsMap = new Map();
          let userMap = new Map();

          if (fetchedDataGround.code === "OK") {
            const groundData = fetchedDataGround.grounds;
            if (Array.isArray(groundData)) {
              groundMap = new Map(groundData.map(g => [g.id, g.name]));
            } else {
              console.error('La propiedad grounds no es un array:', groundData);
            }
          }

          if (fetchedDataSquads.code === "OK") {
            const squadData = fetchedDataSquads.squads;
            if (Array.isArray(squadData)) {
              squadMap = new Map(squadData.map(s => [s.id, s.name]));
            } else {
              console.error('La propiedad squads no es un array:', squadData);
            }
          }

          if (fetchedDataTurns.code === "OK") {
            const shiftsData = fetchedDataTurns.shifts;
            if (Array.isArray(shiftsData)) {
              shiftsMap = new Map(shiftsData.map(s => [s.id, s.name]));
            } else {
              console.error('La propiedad shifts no es un array:', shiftsData);
            }
          }

          const sectorMap = new Map(fetchedDataSector.map(s => [s.id, s.name]));
          const workerMap = new Map(fetchedDataWorkers.map(w => [w.id, `${w.name} ${w.lastname}`]));
          const contractorMap = new Map(fetchedDataContractors.map(c => [c.id, c.name]));
          const specieMap = new Map(fetchedDataSpecies.map(s => [s.id, s.name]));
          const varietyMap = new Map(fetchedDataVarieties.map(v => [v.id, v.name]));
          const qualityMap = new Map(fetchedDataQuality.map(q => [q.id, q.name]));
          const harvestFormatMap = new Map(fetchedDataHarvestFormat.map(f => [f.id, f.name]));
          const seasonMap = new Map(fetchedDataSeasons.map(s => [s.id, s.name]));


          if (fetchedDataUsers.code === "OK") {
            const Users = fetchedDataUsers.usuarios;
            if (Array.isArray(Users)) {
              userMap = new Map(Users.map(u => [u.id, `${u.name} ${u.lastname}`]));
            } else {
              console.error('La propiedad users no es un array:', Users);
            }
          }


          // Función para filtrar valores undefined o null
          const filterUndefinedValues = (obj) => {
            return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
          };

          // Procesar datos y construir cabeceras dinámicamente
          const rawData = await Promise.all(
            initialData.map(async (item) => {
              return {
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
                "Formato cosecha": harvestFormatMap.get(item.harvest_format) || '',
                Pesador: userMap.get(item.weigher_rut) || '',
                Temporada: seasonMap.get(item.season) || '',
                Turno: shiftsMap.get(item.turns) || '',
              };
            })
          );

          // Determinar cabeceras basadas en datos reales
          const headers = Object.keys(rawData[0]).filter(header => rawData.some(item => item[header]));

          // Crear los datos finales con cabeceras dinámicas
          const formatData = rawData.map(item => {
            const filteredItem = filterUndefinedValues(item);
            return Object.fromEntries(Object.entries(filteredItem).filter(([key]) => headers.includes(key)));
          });

          // Remover las columnas que no se quieren mostrar
          const omitColumns = ["Zona", "Hilera", "Turno"];
          const formData = formatData.map((item) => {
            return Object.fromEntries(Object.entries(item).filter(([key]) => !omitColumns.includes(key)));
          });

          setFormatInitialData(formData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [initialData, companyID]);
  */


  //Nuevos
  const [showFilter, setShowFilter] = useState(true);
  const [filters, setFilters] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [dataReport, setDataReport] = useState([]);
  const [checkedIds, setCheckedIds] = useState([]);
 

  const [fields, setFields] = useState({
    ground: { checked: false, type: "select", label: "Campo" },
    //sector: { checked: false, type: "select", label: "Sector" },
    //squad: { checked: false, type: "select", label: "Cuadrilla" },
    //squad_leader: { checked: false, type: "select", label: "Jefe cuadrilla" },
    worker: { checked: false, type: "select", label: "Cosechero" },
    worker_rut: { checked: false, type: "select", label: "RUT Cosechero" },
    specie: { checked: false, type: "select", label: "Especie" },
    //quality: { checked: false, type: "select", label: "Calidad" },
    //variety: { checked: false, type: "select", label: "Variedad" },
    /*harvest_format: {
      checked: false,
      type: "select",
      label: "Formato cosecha",
    },
    contractor: { checked: false, type: "select", label: "Contratista" },
    harvest_date: { checked: false, type: "date", label: "Fecha Cosecha" },
    weigher_rut: { checked: false, type: "select", label: "Pesador" },
    season: { checked: false, type: "select", label: "Temporada" },
    batch: { checked: false, type: "select", label: "Lote" },*/
  });



  const handleCheck = (event) => {
    const { id, checked } = event.target;

    //console.log("ID:", id, "Checked:", checked);

    // Crea una copia del objeto fields
    setFields((prevFields) => {
      const newFields = { ...prevFields };

      // Desmarcar `worker` cuando se marca `worker_rut`, y viceversa
      if (id === 'worker_rut' && checked) {
        newFields.worker.checked = false;  // Desmarcar `worker`
      }

      if (id === 'worker' && checked) {
        newFields.worker_rut.checked = false;  // Desmarcar `worker_rut`
      }

      // Actualizar el estado del checkbox específico
      newFields[id].checked = checked;

      return newFields;  // Devuelve el nuevo objeto fields
    });

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
  };

  const handleFilterChange = (event) => {
    const { id, value } = event.target;
    //console.log(`Cambiando ${id} a ${value}`); // Verifica el valor capturado
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

  console.log("Switch state:", switchState);

  //console.log("Filtros", filters);

  const handleFilterResults = async () => {

    console.log("Filtros:", filters);

    const filtrosConIds = Object.keys(filters).reduce((acc, key) => {
      if (key === 'totals' || key === 'from' || key == 'to' || checkedIds.includes(key) || key == 'worker_rut') {
        acc[key] = filters[key];
      }
      return acc;
    }, {});

    //console.log("Filtros con IDs:", filtrosConIds);

    try {
      const results = await filterResultsMonthly(filtrosConIds, companyID); // Pasas los filtros y el ID de la compañía

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
            className={`flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white ${!fields[key].checked ? "disabled opacity-70 !bg-gray-200" : ""
              }`}
          >
            <option key="empty" value="">
              Seleccione una opción
            </option>
            {Array.isArray(options[key]) && options[key]?.map((option) => (
              <option
                key={option.id || option}
                value={key === "batch" ? option : option.id} // Cambiar esta línea
              >
                {key === "worker_rut"
                  ? option.rut  // Aquí se está utilizando el 'rut' y no el 'id'
                  : key === "batch"
                    ? option
                    : `${option.name}${key === "worker" || key === "squad_leader"
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
            className={`flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white ${!fields[key].checked ? "disabled opacity-70 !bg-gray-200" : ""
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
            className={`flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white ${!fields[key].checked ? "disabled opacity-70 !bg-gray-200" : ""
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
            className={`flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white ${!fields[key].checked ? "disabled opacity-70 !bg-gray-200 " : ""
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
    //zone: "Zona",
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
    harvest_date: "Fecha Cosecha",
  };

  return (
    <>
      <div className="mb-3 filters">

        <div className={`allFiltersMonthly`}>
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
                    data={formatInitialData}
                    filename="Producción Mensual"
                    sheetname="Producción Mensual"
                    titlebutton="Exportar a excel"
                  />
                )}

              {/*SearchInput && (
                <input
                  type="search"
                  placeholder="Buscar"
                  className="search mt-2 w-[250px] h-[50px] rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-400 dark:border-white dark:text-white"
                  onKeyUp={handlerSearch}
                />
              )*/}
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
                              className={`text-xs tracking-wide text-gray-600 ${columnsClasses[index] || "text-start"
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
                            className={`pt-[14px] pb-3 text-[14px] px-5 min-w-[150px] ${index % 2 !== 0
                              ? "bg-lightPrimary dark:bg-navy-900"
                              : ""
                              } ${columnsClasses[rowIndex] || "text-left"}`}
                          >
                            <div className="text-base font-medium text-navy-700 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis">
                              {key === "harvest_date"
                                ? formatDate(row[key]) // Formatea la fecha aquí
                                : formatNumber(getNameByKey(key, row[key])) ||
                                formatNumber(row[key]) ||
                                "-"}
                            </div>
                          </td>
                        );
                      })}
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


        </>
      )}
    </>
  );
};

export default CardTableProductionReports;
