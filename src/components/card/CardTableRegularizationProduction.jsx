"use client";

import { useState, useEffect, useRef } from "react";
import { formatNumber } from "@/functions/functions";
import ExportarExcel from "@/components/button/ButtonExportExcel";
import { get, set, useForm } from "react-hook-form";
import Select from 'react-select';
//import SwitchTailwind from "@material-tailwind/react";
import "@/assets/css/Table.css";
import {
    XMarkIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    EyeIcon,
    AdjustmentsHorizontalIcon,
    PencilSquareIcon,
    TrashIcon,
    DocumentDuplicateIcon,
    ExclamationTriangleIcon
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
    filterRegularizationResults,
    getDataRegularizationProduction,
    updateRegularizationProduction,
    deleteRegularizationProduction,
    updateBulkRegularizationProduction,
    deleteBulkRegularizationProduction
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
    const [updateMessage, setUpdateMessage] = useState(null);

    const [dataChangeZone, setDataChangeZone] = useState("");
    const [dataChangeGround, setDataChangeGround] = useState("");
    const [dataChangeSector, setDataChangeSector] = useState("");
    const [dataChangeSquad, setDataChangeSquad] = useState("");
    const [dataChangeWorker, setDataChangeWorker] = useState("");
    const [dataChangeSpecie, setDataChangeSpecie] = useState("");

    //Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const [dataUserExcel, setDataUserExcel] = useState([]);

    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState({}); // Guarda los datos del item al editar

    const [rut, setRut] = useState("");
    const [rutValido, setRutValido] = useState(false);

    const [dataGround, setDataGround] = useState([]);
    const [dataSector, setDataSector] = useState([]);
    const [dataWorkers, setDataWorkers] = useState([]);
    const [dataSqaads, setDataSquads] = useState([]);
    const [dataSpecies, setDataSpecies] = useState([]);
    const [dataVarieties, setDataVarieties] = useState([]);
    const [selectedVarieties, setSelectedVarieties] = useState([]);
    const [dataQuality, setDataQuality] = useState([]);
    const [dataSeasons, setDataSeasons] = useState([]);
    const [dataTurns, setDataTurns] = useState([]);
    const [dataScale, setDataScale] = useState([]);
    const [dataHarvestFormat, setDataHarvestFormat] = useState([]);
    const [dataContractors, setDataContractors] = useState([]);
    const [dataUsers, setDataUsers] = useState([]);
    const [dataShifts, setDataShifts] = useState([]);
    const [dataUser, setDataUser] = useState([]);

    const [rol, setRol] = useState("");

    const [openShowUser, setOpenShowUser] = useState(false);

    const [dates, setDates] = useState({ from: "", to: "" });

    const [filtrosIds, setFiltrosIds] = useState({});
    const [clearSelect, setClearSelect] = useState();

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

        const userDataString = sessionStorage.getItem("userData");
        const userData = JSON.parse(userDataString);
        const userRol = userData.rol;

        setRol(userRol);
    }, [])

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

    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            setLoading(false);
        }
    }, [data]);

    const handlerRemove = async () => {
        const { index, id } = itemToDelete;
        try {
            //if (userConfirmed) {
            const deleteItem = await deleteRegularizationProduction(id);

            // Elimina la fila del front-end si la eliminación fue exitosa
            if (deleteItem === "OK") {
                //const dataNew = await getDataRegularizationProduction(companyID);

                const results = await filterRegularizationResults(filtrosIds, companyID);

                const filteredData = results.map((item) => {
                    const date = new Date(item.harvest_date);
                    let formattedDate = '';
                    let formattedTime = '';

                    if (item.harvest_date && !isNaN(date)) {
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        formattedDate = `${day}-${month}-${year}`; // Formato DD-MM-YYYY

                        // Extraer la hora y los minutos respetando la zona horaria original
                        const originalHours = item.harvest_date.substring(11, 16); // "14:27"
                        formattedTime = originalHours;
                    }

                    const resultItem = { ...item, harvest_date: formattedDate };

                    if (formattedTime) {
                        resultItem.harvest_time = formattedTime;
                    }

                    //console.log("Result Item:", resultItem);
                    return resultItem;
                });



                //console.log(dataNew);
                const updatedData = [...initialData];
                updatedData.splice(index, 1);
                setInitialData(updatedData);
                setInitialData(filteredData);
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
            const cloneItem = await createRegularizationProduction(itemToClone);
            const dataNew = await getDataRegularizationProduction(companyID);

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
        //console.log(data);
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
            const createItem = await createRegularizationProduction(transformedData);
            const dataNew = await getDataRegularizationProduction(companyID);

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

    // Exportar Excel datas de front
    useEffect(() => {
        if (!companyID) {
            return;
        }

        const fetchData = async () => {
            try {
                // Llamadas a las funciones para obtener los datos
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

                // Validación de datos y almacenamiento en estado
                setDataSector(Array.isArray(fetchedDataSector) ? fetchedDataSector : []);
                setDataWorkers(Array.isArray(fetchedDataWorkers) ? fetchedDataWorkers : []);
                setDataVarieties(Array.isArray(fetchedDataVarieties) ? fetchedDataVarieties : []);
                setDataSpecies(Array.isArray(fetchedDataSpecies) ? fetchedDataSpecies : []);
                setDataQuality(Array.isArray(fetchedDataQuality) ? fetchedDataQuality : []);
                setDataHarvestFormat(Array.isArray(fetchedDataHarvestFormat) ? fetchedDataHarvestFormat : []);

                if (fetchedDataGround.code === "OK" && Array.isArray(fetchedDataGround.grounds)) {
                    setDataGround(fetchedDataGround.grounds);
                }

                if (fetchedDataSquads.code === "OK" && Array.isArray(fetchedDataSquads.squads)) {
                    setDataSquads(fetchedDataSquads.squads);
                }

                if (fetchedDataTurns.code === "OK" && Array.isArray(fetchedDataTurns.shifts)) {
                    setDataTurns(fetchedDataTurns.shifts);
                }

                setDataSeasons(Array.isArray(fetchedDataSeasons) ? fetchedDataSeasons : []);
                setDataContractors(Array.isArray(fetchedDataContractors) ? fetchedDataContractors : []);

                if (fetchedDataUsers.code === "OK" && Array.isArray(fetchedDataUsers.usuarios)) {
                    setDataUsers(fetchedDataUsers.usuarios);
                }

                // Validación adicional para initialData
                if (Array.isArray(initialData) && initialData.length > 0) {
                    // Crear mapas para búsquedas rápidas
                    const groundMap = fetchedDataGround.code === "OK" && Array.isArray(fetchedDataGround.grounds)
                        ? new Map(fetchedDataGround.grounds.map(g => [g.id, g.name]))
                        : new Map();

                    const squadMap = fetchedDataSquads.code === "OK" && Array.isArray(fetchedDataSquads.squads)
                        ? new Map(fetchedDataSquads.squads.map(s => [s.id, s.name]))
                        : new Map();

                    const shiftsMap = fetchedDataTurns.code === "OK" && Array.isArray(fetchedDataTurns.shifts)
                        ? new Map(fetchedDataTurns.shifts.map(s => [s.id, s.name]))
                        : new Map();

                    const userMap = fetchedDataUsers.code === "OK" && Array.isArray(fetchedDataUsers.usuarios)
                        ? new Map(fetchedDataUsers.usuarios.map(u => [u.id, `${u.name} ${u.lastname}`]))
                        : new Map();

                    const sectorMap = new Map(fetchedDataSector.map(s => [s.id, s.name]));
                    const workerMap = new Map(fetchedDataWorkers.map(w => [w.id, `${w.name} ${w.lastname}`]));
                    const contractorMap = new Map(fetchedDataContractors.map(c => [c.id, c.name]));
                    const specieMap = new Map(fetchedDataSpecies.map(s => [s.id, s.name]));
                    const varietyMap = new Map(fetchedDataVarieties.map(v => [v.id, v.name]));
                    const qualityMap = Array.isArray(fetchedDataQuality)
                        ? new Map(fetchedDataQuality.map(q => [q.id, q.name]))
                        : new Map();
                    const harvestFormatMap = new Map(fetchedDataHarvestFormat.map(f => [f.id, f.name]));
                    const seasonMap = new Map(fetchedDataSeasons.map(s => [s.id, s.name]));
                    const weigherMap = userMap;

                    // Función para filtrar valores undefined o null
                    const filterUndefinedValues = (obj) => {
                        return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
                    };

                    // Procesar datos y construir cabeceras dinámicamente
                    const rawData = await Promise.all(
                        initialData.map(async (item) => {


                            // Convertir la fecha (si existe) al formato adecuado para Excel
                            const formattedHarvestDate = item.harvest_date
                                ? item.harvest_date.replace(/-/g, "/")
                                : '';

                            // Convertir la hora (si existe) al formato adecuado para Excel (como HH:mm)
                            const formattedHarvestTime = item.harvest_time
                                ? `${item.harvest_time.padStart(5, '0')}:00`
                                : '';

                            const splitRut = (rut) => {
                                if (typeof rut !== 'string') {
                                    return { rutNumber: '', dv: '' }; // Retorna valores vacíos si el RUT no es válido
                                }

                                const cleanedRut = rut.replace(/[.\-]/g, '');
                                const rutNumber = cleanedRut.slice(0, -1); // Todo menos el último carácter
                                const dv = cleanedRut.slice(-1); // Último carácter
                                return { rutNumber, dv };
                            };


                            return {
                                "Fecha cosecha": formattedHarvestDate || '',
                                "Hora cosecha": formattedHarvestTime || '',
                                Campo: groundMap.get(item.ground) || '',
                                Sector: sectorMap.get(item.sector) || '',
                                Cuadrilla: squadMap.get(item.squad) || '',
                                "Jefe cuadrilla": workerMap.get(item.squad_leader) || '',
                                Lote: item.batch || '',
                                Cosechero: workerMap.get(item.worker) || '',
                                "RUT": item.worker_rut || '',
                                "RUT": splitRut(item.worker_rut).rutNumber || '',
                                "DV": splitRut(item.worker_rut).dv || '',
                                Contratista: contractorMap.get(item.contractor) || '',
                                Especie: specieMap.get(item.specie) || '',
                                Variedad: varietyMap.get(item.variety) || '',
                                Cajas: item.boxes || '',
                                "Kilos Caja": item.kg_boxes || '',
                                Calidad: qualityMap.get(item.quality) || '',
                                "Formato cosecha": harvestFormatMap.get(item.harvest_format) || '',
                                Pesador: weigherMap.get(Number(item.weigher_rut)) || '',
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

                    // Remover columnas no deseadas
                    const omitColumns = ["Zona", "Hilera", "Turno"];
                    const formData = formatData.map((item) => {
                        return Object.fromEntries(Object.entries(item).filter(([key]) => !omitColumns.includes(key)));
                    });

                    //console.log("Format Data:", formData);
                    setFormatInitialData(formData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [initialData, companyID]);


    //Nuevos
    const [showFilter, setShowFilter] = useState(true);
    const [filters, setFilters] = useState({});
    const [filteredData, setFilteredData] = useState([]);
    const [dataReport, setDataReport] = useState([]);
    const [checkedIds, setCheckedIds] = useState([]);
    const [switchState, setSwitchState] = useState(false);

    const [openAlert, setOpenAlert] = useState(false);
    const [openAlertClone, setOpenAlertClone] = useState(false);
    const [itemToDelete, setItemToDelete] = useState({
        index: null,
        id: null,
        name_item: "",
        harvest_date: "",
        harvest_time: "",
        ground: "",
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

    const onUpdateItem = async (data) => {

        try {
            if (!data || !data.id) {
                throw new Error(
                    "Los datos para actualizar son inválidos o incompletos."
                );
            }

            const localDate = new Date(data.harvest_date);
            const offset = localDate.getTimezoneOffset(); // Diferencia con UTC en minutos
            const adjustedDate = new Date(localDate.getTime() - offset * 60000);

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
                harvest_date: adjustedDate.toISOString(), // Guardar en formato UTC
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

            const updateItemApi = await updateRegularizationProduction(updateData);
            //const dataNew = await getDataRegularizationProduction(companyID);
            const results = await filterRegularizationResults(filtrosIds, companyID);

            const filteredData = results.map((item) => {
                const date = new Date(item.harvest_date);
                let formattedDate = '';
                let formattedTime = '';

                if (item.harvest_date && !isNaN(date)) {
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    formattedDate = `${day}-${month}-${year}`; // Formato DD-MM-YYYY

                    // Extraer la hora y los minutos respetando la zona horaria original
                    const originalHours = item.harvest_date.substring(11, 16); // "14:27"
                    formattedTime = originalHours;
                }

                const resultItem = { ...item, harvest_date: formattedDate };

                if (formattedTime) {
                    resultItem.harvest_time = formattedTime;
                }

                //console.log("Result Item:", resultItem);
                return resultItem;
            });

            if (updateItemApi === "OK") {
                const updatedList = initialData.map((item) =>
                    item.id === Number(data.id) ? { ...item, ...updateData } : item
                );

                setInitialData(updatedList);
                setInitialData(filteredData)
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


    const handleOpenAlert = (index, id, harvest_date, harvest_time, ground) => {
        setItemToDelete({ index, id, harvest_date, harvest_time, ground });
        setOpenAlert(true);
        setOpenAlertClone(false);
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

    const today = new Date().toISOString().split('T')[0]

    const [fields, setFields] = useState({
        //ground: { checked: false, type: "select", label: "Campo" },
        sector: { checked: false, type: "select", label: "Sector" },
        //squad: { checked: false, type: "select", label: "Cuadrilla" },
        //squad_leader: { checked: false, type: "select", label: "Jefe cuadrilla" },
        //worker: { checked: false, type: "select", label: "Cosechero" },
        worker_rut: { checked: false, type: "select", label: "RUT Cosechero" },
        //specie: { checked: false, type: "select", label: "Especie" },
        quality: { checked: false, type: "select", label: "Calidad" },
        variety: { checked: false, type: "select", label: "Variedad" },
        /*harvest_format: {
            checked: false,
            type: "select",
            label: "Formato cosecha",
        },*/
        //contractor: { checked: false, type: "select", label: "Contratista" },
        harvest_date: { checked: false, type: "date", label: "Fecha Cosecha" },
        //weigher_rut: { checked: false, type: "select", label: "Pesador" },
        //season: { checked: false, type: "select", label: "Temporada" },
        //batch: { checked: false, type: "select", label: "Lote" },
    });


    const handleCheck = (event) => {
        const { id, checked } = event.target;

        // Actualiza los IDs seleccionados
        setCheckedIds((prevCheckedIds) => {
            if (id === "selectAll") {
                return checked ? Object.keys(fields) : [];
            } else {
                return checked
                    ? [...prevCheckedIds, id]
                    : prevCheckedIds.filter((checkedId) => checkedId !== id);
            }
        });

        // Actualiza el estado de los checkboxes en `fields`
        setFields((prev) => {
            const newFields = { ...prev };

            if (id === "selectAll") {
                Object.keys(newFields).forEach((key) => {
                    newFields[key].checked = checked;
                });
            } else {
                if (newFields[id]) {
                    newFields[id].checked = checked;
                }
            }

            // Lógica para desmarcar `worker` cuando se selecciona `worker_rut` y viceversa
            /*if (id === 'worker_rut' && checked) {
                newFields.worker.checked = false;  // Desmarcar `worker`
                setFilters((prev) => ({
                    ...prev,
                    worker: undefined,  // Asegurar que se borra correctamente
                    worker_rut: "",     // Agregar `worker_rut`
                }));

                setClearSelect(id);
            }

            if (id === 'worker' && checked) {
                newFields.worker_rut.checked = false;  // Desmarcar `worker_rut`
                setFilters((prev) => ({
                    ...prev,
                    worker_rut: undefined,  // Asegurar que se borra correctamente
                    worker: "",             // Agregar `worker`
                }));

                setClearSelect(id);
            }*/

            return newFields;
        });

        // Actualiza los filtros correctamente
        setFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };

            if (id === "selectAll") {
                const preservedFilters = { from: prevFilters.from, to: prevFilters.to };

                return checked
                    ? {
                        ...preservedFilters,
                        ...Object.keys(fields).reduce((acc, key) => {
                            acc[key] = ""; // Asignar valor vacío a cada filtro
                            return acc;
                        }, {}),
                        harvest_date: "",
                    }
                    : preservedFilters;
            } else {
                if (checked) {
                    updatedFilters[id] = ""; // Agregar el filtro marcado con valor vacío
                } else {
                    updatedFilters[id] = undefined; // Eliminar el filtro desmarcado
                    setClearSelect(id);  // 💡 Limpiar el select cuando el checkbox se desmarca
                }

                // Asegurar que `harvest_date` siempre exista si están `from` y `to`
                if (updatedFilters.from && updatedFilters.to) {
                    updatedFilters.harvest_date = "";
                }

                return updatedFilters;
            }
        });

        setShowFilter(true);
    };



    const handleFilterChange = (selectedOption, actionMeta) => {
        // Para inputs normales (event.target)
        if (selectedOption.target) {
            const { name, value } = selectedOption.target;

            if (value !== undefined && value !== '') {
                setFilters((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        }
        // Para Select de react-select
        else {
            const { name } = actionMeta;  // `actionMeta` contiene el `name` del Select
            const { value } = selectedOption;  // `value` es el valor seleccionado

            if (value !== undefined && value !== '') {
                setFilters((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        }
    };

    const handleSwitchChange = (event) => {
        const isChecked = event.target.checked;
        setSwitchState(isChecked); // Actualiza el estado del switch
        // Actualiza el filtro para el switch
        setFilters((prev) => ({
            ...prev,
            totals: isChecked ? 1 : 0, // Convierte el estado del switch a 1 o 0
            harvest_date: "", // Asegura que harvest_date esté vacío
        }));


    };

    const handleFilterResults = async () => {
        //console.log("Filtros:", filters);

        // Filtrar los filtros para evitar valores vacíos o no definidos
        const filtrosConIds = Object.keys(filters).reduce((acc, key) => {
            // Evitar que el 'undefined' o valores vacíos se incluyan

            //console.log(filtrosConIds);

            if (
                key === 'totals' ||
                key === 'from' ||
                key === 'to' ||
                checkedIds.includes(key) ||
                key === 'harvest_date' ||
                (filters[key] && filters[key] !== '')
            ) {
                acc[key] = filters[key];
            }

            return acc;
        }, {});

        setFiltrosIds(filtrosConIds);

        try {
            const results = await filterRegularizationResults(filtrosConIds, companyID); // Pasas los filtros y el ID de la compañía

            const filteredData = results.map((item) => {
                const date = new Date(item.harvest_date);
                let formattedDate = '';
                let formattedTime = '';

                if (item.harvest_date && !isNaN(date)) {
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    formattedDate = `${day}-${month}-${year}`; // Formato DD-MM-YYYY

                    // Extraer la hora y los minutos respetando la zona horaria original
                    const originalHours = item.harvest_date.substring(11, 16); // "14:27"
                    formattedTime = originalHours;
                }

                const resultItem = { ...item, harvest_date: formattedDate };

                if (formattedTime) {
                    resultItem.harvest_time = formattedTime;
                }

                //console.log("Result Item:", resultItem);
                return resultItem;
            });


            setInitialData(filteredData);
            setDataReport(filteredData);
        } catch (error) {
            console.error("Error al filtrar los resultados:", error);
            setInitialData("No se encontraron resultados");
        } finally {
            setCurrentPage(1);
        }
    };


    const generateUniqueId = () => "_" + Math.random().toString(36).substr(2, 9);

    const renderField = (key, type) => {
        switch (type) {
            case "select":
                return (
                    <Select
                        name={key}
                        id={key}
                        isDisabled={!fields[key].checked}
                        onChange={handleFilterChange}

                        options={Array.isArray(options[key])
                            ? options[key].map(option => ({
                                value: key === "batch" ? option : option.id,
                                label: key === "worker_rut"
                                    ? option.rut
                                    : key === "batch"
                                        ? option
                                        : `${option.name}${key === "worker" || key === "squad_leader" ? ` ${option.lastname}` : ""}`,
                            }))
                            : []}
                        className={`h-12 w-full rounded-xl border bg-white/0 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-blueTertiary ${!fields[key].checked ? "disabled opacity-70 !bg-gray-200" : ""}`}
                        placeholder="Seleccione una opción"
                        //onReset={!fields[key].checked && ""}
                        menuPortalTarget={document.body} // Renderiza el menú en el body
                        //menuPosition="fixed" // Asegura que no se recorte dentro del contenedor
                        styles={{
                            menuPortal: base => ({ ...base, zIndex: 9 }) // Ajusta el z-index
                        }}
                        isClearable
                    />
                );

            case "date":
                const today = new Date().toISOString().split("T")[0]; // Obtenemos la fecha de hoy en formato yyyy-mm-dd
                return (
                    <input
                        type="date"
                        id={key}
                        name={key}
                        onChange={handleFilterChange}
                        className={`flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white ${!fields[key].checked ? "disabled opacity-70 !bg-gray-200" : ""
                            }`}
                        disabled={!fields[key].checked}
                        max={today} // Limitar la fecha a hoy
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
        harvest_date: "Fecha Cosecha",
        harvest_time: "Hora Cosecha",
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

    const formatDateForInputFix = (date, time) => {
        if (!date || !time) return "";

        // Convertir "23-11-2024" a "2024-11-23"
        const [day, month, year] = date.split("-");
        const formattedDate = `${year}-${month}-${day}`;

        // Asegurar que la hora está en formato correcto (HH:mm)
        const formattedTime = time.length === 5 ? time : time.slice(0, 5);

        return `${formattedDate}T${formattedTime}`;
    };


    //Switch Bulk Update
    const [bulkUpdate, setBulkUpdate] = useState(false);
    const [bulkDelete, setBulkDelete] = useState(false);

    const [bulkValues, setBulkValues] = useState({
        bulkVariety: null,
        bulkQuality: null,
        bulkWorker: null,
    });


    const handleBulkUpdateSwitch = () => {
        setBulkUpdate(!bulkUpdate);
        setBulkDelete(false);
    };

    const handleBulkDeleteSwitch = () => {
        setBulkDelete(!bulkDelete);
        setBulkUpdate(false);
    };

    const handleBulkChange = (selectedOption, actionMeta) => {
        setBulkValues(prev => ({
            ...prev,
            [actionMeta.name]: selectedOption ? selectedOption.value : null
        }));
    };

    const handleBulkUpdate = async () => {
        const { bulkVariety, bulkQuality, bulkWorker } = bulkValues;
        const selectedIds = checkedIds;

        //setBulkUpdate(!bulkUpdate);

        if (selectedIds.length === 0) {
            return;
        }

        const updateData = {
            variety: bulkVariety,
            quality: bulkQuality,
            worker: bulkWorker,
        };

        try {
            const updateBulk = await updateBulkRegularizationProduction(companyID, filtrosIds, updateData);

            if (updateBulk === "OK") {
                const results = await filterRegularizationResults(filtrosIds, companyID) || [];

                const updatedList = initialData.map((item) =>
                    selectedIds.includes(item.id)
                        ? {
                            ...item,
                            variety: bulkVariety,
                            quality: bulkQuality,
                            worker: bulkWorker,
                        }
                        : item
                );

                const filteredData = results && results.map((item) => {
                    const date = new Date(item.harvest_date);
                    let formattedDate = '';
                    let formattedTime = '';

                    if (item.harvest_date && !isNaN(date)) {
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        formattedDate = `${day}-${month}-${year}`; // Formato DD-MM-YYYY

                        // Extraer la hora y los minutos respetando la zona horaria original
                        const originalHours = item.harvest_date.substring(11, 16); // "14:27"
                        formattedTime = originalHours;
                    }

                    const resultItem = { ...item, harvest_date: formattedDate };

                    if (formattedTime) {
                        resultItem.harvest_time = formattedTime;
                    }

                    return resultItem;
                });

                setInitialData(updatedList);
                setInitialData(filteredData || []);
                //setBulkUpdate(false);
                setUpdateMessage("Registros masivos actualizados con correctamente.");
            }
        } catch (error) {
            console.error("Error al actualizar en bloque:", error);
            setUpdateMessage("No se pudo actualizar los registros masivamente.");
        }
    };

    const handleBulkDelete = async () => {

        const selectedIds = checkedIds;

        if (selectedIds.length === 0) {
            return;
        }

        try {
            const deleteBulk = await deleteBulkRegularizationProduction(companyID, filtrosIds);

            if (deleteBulk === "OK") {
                const results = await filterRegularizationResults(filtrosIds, companyID) || [];

                const updatedList = initialData.filter((item) => !selectedIds.includes(item.id));

                const filteredData = results && results.map((item) => {
                    const date = new Date(item.harvest_date);
                    let formattedDate = '';
                    let formattedTime = '';

                    if (item.harvest_date && !isNaN(date)) {
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        formattedDate = `${day}-${month}-${year}`; // Formato DD-MM-YYYY

                        // Extraer la hora y los minutos respetando la zona horaria original
                        const originalHours = item.harvest_date.substring(11, 16); // "14:27"
                        formattedTime = originalHours;
                    }

                    const resultItem = { ...item, harvest_date: formattedDate };

                    if (formattedTime) {
                        resultItem.harvest_time = formattedTime;
                    }

                    return resultItem;
                });

                setInitialData(updatedList);
                setInitialData(filteredData || []);
                //setBulkUpdate(false);
                setUpdateMessage("Registros masivos eliminados correctamente.");
            }

        } catch (error) {
            console.error("Error al eliminar en bloque:", error);
            setUpdateMessage("No se pudo eliminar los registros masivamente.");
        }
    };

    return (
        <>
            <div className="mb-3 filters">
                {updateMessage && ( // Mostrar el mensaje si updateMessage no es null
                    <div
                        className={`bg-${updateMessage.includes("correctamente") ? "green" : "red"
                            }-500 text-white text-center py-2 fixed top-0 left-0 right-0 z-50`}
                        style={{ zIndex: 999999 }}
                    >
                        {updateMessage}
                    </div>
                )}
                {/*
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
                */}

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

                {/*
                <div className="flex flex-col gap-2 px-5 py-2 rounded-md">
                    <label
                        htmlFor="selectAll"
                        className="text-sm font-semibold text-gray-800 dark:text-whitee"
                    >
                        Filtrar por totales
                    </label>
                    <Switch id="switchRead" defaultChecked={0} onChange={handleSwitchChange} />
                </div>
                */}

                <button
                    type="button"
                    className="align-middle font-sans text-center disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none px-6 shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none max-w-[300px] linear mt-4 w-[170px] rounded-md bg-blueTertiary py-[12px] text-base font-medium text-white transition duration-200 hover:!bg-blueQuinary active:bg-blueTertiary dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 items-center justify-center flex gap-2 normal-case "
                    onClick={handleFilterResults}
                >
                    Filtrar resultados
                </button>
            </div>

            {Array.isArray(initialData) &&
                initialData.length > 0 && (
                    <div className="bulkActions">
                        <div className="flex items-center gap-5">
                            <div className="bulkUpdate my-5">
                                <h2 className="text-md font-semibold text-gray-800 dark:text-white mb-1">Editar masivamente</h2>
                                <Switch id="switchRead" defaultChecked={0} onChange={handleBulkUpdateSwitch} checked={bulkUpdate} />

                            </div>

                            <div className="bulkDelete my-5">
                                <h2 className="text-md font-semibold text-gray-800 dark:text-white mb-1">Eliminar masivamente</h2>
                                <Switch id="switchRead" defaultChecked={0} onChange={handleBulkDeleteSwitch} checked={bulkDelete} />
                            </div>
                        </div>

                        {bulkUpdate && (
                            <div className="mb-3 mt-5 bg-lightPrimary dark:bg-navy-900 p-[35px] rounded-md">
                                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 w-full">
                                    <div className="dates block items-center gap-5">
                                        <label
                                            htmlFor="bulkVariety"
                                            className="text-sm block font-semibold mb-3 text-gray-800 dark:text-white"
                                        >
                                            Variedad
                                        </label>
                                        <Select
                                            name="bulkVariety"

                                            options={Array.isArray(options.variety)
                                                ? options.variety.map(option => ({
                                                    value: option.id,
                                                    label: option.name,
                                                }))
                                                : []}
                                            className="h-12 w-full rounded-xl border bg-white/0 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                                            placeholder="Seleccione una opción"
                                            onChange={handleBulkChange}
                                            isClearable
                                        />
                                    </div>
                                    <div className="dates block items-center gap-5">
                                        <label
                                            htmlFor="bulkQuality"
                                            className="text-sm block font-semibold mb-3 text-gray-800 dark:text-white"
                                        >
                                            Calidad
                                        </label>
                                        <Select
                                            name="bulkQuality"
                                            options={Array.isArray(options.quality)
                                                ? options.quality.map(option => ({
                                                    value: option.id,
                                                    label: option.name,
                                                }))
                                                : []}
                                            className="h-12 w-full rounded-xl border bg-white/0 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                                            placeholder="Seleccione una opción"
                                            onChange={handleBulkChange}
                                            isClearable
                                        />
                                    </div>
                                    <div className="dates block items-center gap-5">
                                        <label
                                            htmlFor="bulkWorker"
                                            className="text-sm block font-semibold mb-3 text-gray-800 dark:text-white"
                                        >
                                            Cosechero
                                        </label>
                                        <Select
                                            name="bulkWorker"
                                            options={Array.isArray(options.worker)
                                                ? options.worker.map(option => ({
                                                    value: option.id,
                                                    label: `${option.rut} (${option.name} ${option.lastname})`,
                                                }))
                                                : []}
                                            className="h-12 w-full rounded-xl border bg-white/0 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                                            placeholder="Seleccione una opción"
                                            onChange={handleBulkChange}
                                            isClearable
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 w-full">

                                    <div className="dates block items-center gap-5">

                                        <input
                                            type="submit"
                                            value="Actualizar"
                                            className="align-middle font-sans text-center disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none px-6 shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none max-w-[300px] linear mt-4 w-[170px] rounded-md bg-blueTertiary py-[12px] text-base font-medium text-white transition duration-200 hover:!bg-blueQuinary active:bg-blueTertiary dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 items-center justify-center flex gap-2 normal-case "
                                            onClick={handleBulkUpdate}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5 w-full">
                                    <div className="dates block items-center gap- bg-orange-500 p-3 mt-4 rounded-md text-white block5">
                                        <ul>
                                            <li className="text-[12px] "><ExclamationTriangleIcon className="w-5 h-5 inline-block" />  Esta acción modificará los registros seleccionados.</li>

                                            <li className="text-[12px] "><ExclamationTriangleIcon className="w-5 h-5 inline-block" />  Una vez actualice ya no podrá deshacer los cambios, si actualiza por error deberá corregir manualmente. </li>
                                            <li className="text-[12px] "><ExclamationTriangleIcon className="w-5 h-5 inline-block" />  Si actualiza el cosechero, se actualizará el RUT del cosechero en todos los registros seleccionados y debera generar una nueva buqueda en los filtros para visualizar los cambios.</li>

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                        {bulkDelete && (
                            <div className="mb-3 mt-5 bg-lightPrimary dark:bg-navy-900 p-[35px] rounded-md">

                                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 w-full">

                                    <div className="dates block items-center gap-5">

                                        <input
                                            type="submit"
                                            value="Borrar registros"
                                            className="align-middle font-sans text-center disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none px-6 shadow-md shadow-red-500/10 hover:shadow-lg hover:shadow-red-500/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none max-w-[300px] linear mt-4 w-[170px] rounded-md bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:!bg-red-700 active:bg-red-500 dark:bg-red-500 dark:text-white dark:hover:bg-red-700 dark:active:bg-red-500 items-center justify-center flex gap-2 normal-case "
                                            onClick={handleBulkDelete}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5 w-full">
                                    <div className="dates block items-center gap- bg-red-500 p-3 mt-4 rounded-md text-white block5">
                                        <ul>
                                            <li className="text-[12px] "><ExclamationTriangleIcon className="w-5 h-5 inline-block" />  Esta acción eliminará los registros seleccionados (filtrados).</li>
                                            <li className="text-[12px] "><ExclamationTriangleIcon className="w-5 h-5 inline-block" />  Una vez elimine los registros, ya no podrá deshacer los cambios. </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                )}

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
                                        filename="regularizacion_de_produccion"
                                        sheetname="Regularización de recolección"
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
                                                            {formatNumber(getNameByKey(key, row[key]))}
                                                        </div>
                                                    </td>
                                                );
                                            })}

                                            {actions && (
                                                <td
                                                    colSpan={columnLabels.length}
                                                    className={`pt-[14px] pb-3 text-[14px] px-5 min-w-[100px] ${index % 2 !== 0
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

                                                    {(rol == 1 || rol == 2) && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                className="text-sm font-semibold text-gray-800 dark:text-white"
                                                                //onClick={() => handleOpen(row)}
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
                                                                        row.harvest_date,
                                                                        row.harvest_time,
                                                                        row.ground
                                                                            ? getNameByKey("groud", row.ground)
                                                                            : ""
                                                                    );
                                                                }}
                                                            >
                                                                <TrashIcon className="w-6 h-6" />
                                                            </button>
                                                        </>
                                                    )}
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
                                        className={`mb-3 grid gap-3 ${isEdit
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
                                                    dataGround.filter((ground) => ground.status != '0' && ground.status != 0).length > 0 ? (
                                                        dataGround
                                                            .filter((ground) => ground.status != 0)
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
                                                    <option value="" disabled>No hay sectores</option>
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
                                                <option value="" disabled>Elige una cuadrilla</option>
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
                                                    <option value="" disabled>No hay cuadrillas</option>
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
                                                <option value="" disabled>Elige un lote</option>

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
                                                            <option value="" disabled>Elige cosechero</option>
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
                                                                        <option value="" disabled>
                                                                            No hay trabajadores
                                                                        </option>
                                                                    )
                                                                )}
                                                        </>
                                                    ) : (
                                                        <option value="" disabled>No hay trabajadores</option>
                                                    )
                                                ) : (
                                                    <option value="" disabled>No hay trabajadores</option>
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
                                                type="datetime-local"
                                                name="harvest_date"
                                                id="harvest_date"
                                                required={true}
                                                {...register("harvest_date")}
                                                defaultValue={
                                                    selectedItem
                                                        ? formatDateForInputFix(selectedItem.harvest_date, selectedItem.harvest_time)
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
                                                <option value="" disabled>Elige una especie</option>
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
                                                    <option value="" disabled>No hay especies</option>
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
                                                <option key="empty" value="">
                                                    Elige una variedad
                                                </option>
                                                {Array.isArray(dataSpecies) && dataSpecies.length > 0 ? (
                                                    dataSpecies
                                                        .filter((specie) => specie.id == dataChangeSpecie)
                                                        .map((specie) =>
                                                            Array.isArray(specie.varieties) && specie.varieties.length > 0 ? (
                                                                specie.varieties.map((variety) =>
                                                                    dataVarieties
                                                                        .filter((varietySelect) => varietySelect.id == variety)
                                                                        .map((varietySelect) => (
                                                                            <option key={varietySelect.id} value={varietySelect.id}>
                                                                                {varietySelect.name}
                                                                            </option>
                                                                        ))
                                                                )
                                                            ) : (
                                                                <option key={`no-varieties-${specie.id}`} value="">
                                                                    No hay variedades
                                                                </option>
                                                            )
                                                        )
                                                ) : (
                                                    <option key="no-species" value="">
                                                        No hay variedades
                                                    </option>
                                                )}
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
                                                    <option value="" disabled>Elige una calidad</option>
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
                                                        <option value="" disabled>No hay calidades</option>
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
                                                    <option value="" disabled>Elige un formato de cosecha</option>
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
                                                        <option value="" disabled>No hay formatos de cosecha</option>
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
                                                            <option value="" disabled>Elige pesador</option>
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
                                                                        <option value="" disabled>No hay pesadores</option>
                                                                    )
                                                                )}
                                                        </>
                                                    ) : (
                                                        <option value="" disabled>No hay pesadores</option>
                                                    )
                                                ) : (
                                                    <option value="" disabled>No hay pesadores</option>
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
                                                <option value="" disabled>Elige una temporada</option>
                                                {Array.isArray(dataSeasons) &&
                                                    dataSeasons.length > 0 ? (
                                                    dataSeasons.map((season) => (
                                                        <option key={season.id} value={season.id}>
                                                            {season.name}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="" disabled>No hay temporadas</option>
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
                                                <option value="" disabled>Elige un turno</option>
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
                                                    <option value="" disabled>No hay turnos</option>
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
                                                <option value="" disabled>Elige un contratista</option>
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
                                                    <option value="" disabled>No hay contratistas</option>
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
                                        {selectedItem.squad_leader ? getNameByKey(
                                            "squad_leader",
                                            selectedItem.squad_leader,
                                            dataMap
                                        ) : '-'}
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
                                        {selectedItem.harvest_date || "-"}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                        <strong>Hora cosecha:</strong>{" "}
                                        {selectedItem.harvest_time || "-"}
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
                                        <strong>Pesador:</strong> {" "}

                                        {dataUserExcel.filter(
                                            (user) => user.id == selectedItem.weigher_rut
                                        ).map((user) => (
                                            <span key={user.id}>
                                                {user.name} {user.lastname}
                                            </span>
                                        ))}

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
                        className="p-5 lg:max-w-[40%] dark:bg-navy-900"
                    >
                        <>
                            <h2 className="text-center mb-7 text-xl mt-5 dark:text-white">
                                ¿Seguro que desea {openAlert ? "eliminar" : "clonar"} la cosecha
                                del{" "}
                                <strong className="font-bold">
                                    {openAlert
                                        ? itemToDelete.harvest_date + ' ' + itemToDelete.harvest_time
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
                                className={`${openAlert ? "bg-red-500" : "bg-blueTertiary"
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

export default CardTableProductionReports;
