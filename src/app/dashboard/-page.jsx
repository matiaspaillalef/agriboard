"use client";

import { useState, useEffect, useCallback, use } from "react";
import {
  CalendarDaysIcon,
  ChartBarIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import {
  getDataKgDay,
  getDataKgDayQlty,
  getDataKgSeason,
  getDataWorkers,
  getdataWorkersWeek,
  getDataVaritiesDay,
  getDataVaritiesSeason,
  getDataDispatchDay,
  getDataVarietiesSeasonPercentage,
  getDataHumidityTemperatureSeason,
  getDataCalcKgAvg,
  getDataCalcKgAvgDay,
  getDataDaysOfHarvest,
  getDataAllDaysOfHarvest,
  getDataKgGroundAll,
  getDataKgGroundAllTemp,
  getDataKgGroundAllDay,
} from "@/app/api/FilterDashboardApi";
import { getDataGround } from "../api/ProductionApi";
import MiniCard from "@/components/card/MiniCard";
import CardTable from "@/components/card/cardTableResume";
import PieChart from "@/components/charts/PieChart";
import LineChart from "@/components/charts/LineChart";
import {
  groupedTableDataVariedad,
  tableDataDespachos,
} from "../data/tableData";
import {
  pieChartData,
  pieChartOptions,
  lineChartDataTotalSpent,
  lineChartOptionsTotalSpent,
} from "../data/dataGraphics";
import { dataMiniCardDashboard } from "../data/dataMiniCard";
import { data } from "autoprefixer";
import { set } from "date-fns";
import { formatNumber } from "@/functions/functions";
import { all } from "axios";

const fechaActual = new Date();

const Dashboard = () => {
  const [alreadyFetched, setAlreadyFetched] = useState(false); //Bandera para evitar la llamada a la API
  const [dataKgDay, setDataKgDay] = useState({});
  const [dataKgDayQlty, setDataKgDayQlty] = useState({});
  const [dataKgSeason, setDataKgSeason] = useState({});
  const [dataKgSeasonQlty, setDataKgSeasonQlty] = useState({});
  const [dataWorkers, setDataWorkers] = useState([]);
  const [dataWorkersWeek, setDataWorkersWeek] = useState([]);
  const [dataVaritiesDayState, setDataVaritiesDay] = useState([]);
  const [dataVaritiesSeason, setDataVaritiesSeason] = useState([]);
  const [dataVarietiesSeasonPercentage, setDataVarietiesSeasonPercentage] =
    useState([]);
  const [dataHumidityTemperatureSeason, setDataHumidityTemperatureSeason] =
    useState([]);
  const [dataKgAvg, setDataKgAvg] = useState([]);
  const [dataKgAvgDay, setDataKgAvgDay] = useState([]);
  const [dataDaysOfHarvest, setDataDaysOfHarvest] = useState([]);
  const [dataAllDaysOfHarvest, setDataAllDaysOfHarvest] = useState([]);
  const [dataDispatchGuideDay, setDataDispatchGuideDay] = useState([]);
  const [selectedGround, setSelectedGround] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [idRole, setIdRole] = useState("");
  const [error, setError] = useState("");
  const [dataGrounds, setDataGrounds] = useState([]);
  const [selectedOption, setSelectedOption] = useState('1'); // Inicialmente seleccionado 'Día'
  const [selectedOptionHours, setSelectedOptionHours] = useState('1'); // Inicialmente seleccionado 'Día'

  //Toda las data de los campos
  const [dataAllCountries, setDataAllCountries] = useState(true);
  const [dataKgGroundAllState, setDataKgGroundAll] = useState([]);
  const [dataKgGroundAllStateTemp, setDataKgGroundAllTemp] = useState([]);
  const [dataKgGroundAllStateDay, setDataKgGroundAllDay] = useState([]);
  const [allChangeDataGround, setAllChangeDataGround] = useState([]);
  const [dataSelectedGround, setDataSelectedGround] = useState([]);
  const [allGround, setAllGround] = useState([]);

  //Loading data
  const [loadingDataKgDay, setLoadingDataKgDay] = useState(true);
  const [loadingDataKgSeason, setLoadingDataKgSeason] = useState(true);
  const [loadingDataWorkers, setLoadingDataWorkers] = useState(true);
  const [loadingDataWorkersWeek, setLoadingDataWorkersWeek] = useState(true);
  const [loadingDataVaritiesDay, setLoadingDataVaritiesDay] = useState(true);
  const [loadingDataVaritiesSeason, setLoadingDataVaritiesSeason] = useState(true);
  const [loadingDataDispatchGuideDay, setLoadingDataDispatchGuideDay] = useState(true);
  const [loadingDataVarietiesSeasonPercentage, setLoadingDataVarietiesSeasonPercentage] = useState(true);
  const [loadingDataHumidityTemperatureSeason, setLoadingDataHumidityTemperatureSeason] = useState(true);
  const [loadingDataKgAvg, setLoadingDataKgAvg] = useState(true);
  const [loadingDataKgAvgDay, setLoadingDataKgAvgDay] = useState(true);
  const [loadingDataDaysOfHarvest, setLoadingDataDaysOfHarvest] = useState(true);
  const [loadingDataAllDaysOfHarvest, setLoadingDataAllDaysOfHarvest] = useState(true);
  const [loadingDataKgGroundAll, setLoadingDataKgGroundAll] = useState(true);
  const [loadingDataKgGroundAllTemp, setLoadingDataKgGroundAllTemp] = useState(true);
  const [loadingDataKgGroundAllDay, setLoadingDataKgGroundAllDay] = useState(true);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSelectChangeHours = (event) => {
    setSelectedOptionHours(event.target.value);
  };

  const getSelectedGroundFromSessionStorage = useCallback(() => {
    return sessionStorage.getItem("selectedGround");
  }, []);
  

  //Se hace la llamada a la API para obtener los datos de la empresa al cargar la pagina por promera vez y controlar algunos problemas
  useEffect(() => {

    const userCompantData = JSON.parse(sessionStorage.getItem("selectedCompanyId"));
    

    const body = document.body;
    
    // Verifica si el body ya tiene la clase ground-0
    if (body.classList.contains('ground-0')) {
      return; // Si ya tiene ground-0, no hacer nada
    }

    // Verifica si hay una clase que empieza con 'ground-'
    const groundClass = Array.from(body.classList).find((className) =>
      className.startsWith('ground-') && className !== 'ground-0'
    );

    // Si se encuentra una clase ground-<número>, la eliminamos y agregamos ground-0
    if (groundClass) {
      body.classList.remove(groundClass); // Elimina la clase existente, como ground-8, etc.
    }

    // Finalmente, agregamos la clase ground-0
    body.classList.add('ground-0');
    sessionStorage.setItem("selectedGround", "0");

    const fetchData = async () => {

    if(!document.body.classList.contains('ground-0')){
      document.body.classList.add('ground-0');
    }

      try {
        const dataGround = await getDataGround(Number(companyId ? companyId : userCompantData)); // Aquí haces la llamada a la API
        //console.log(dataGround);
        setDataGrounds(dataGround);

        //console.log('dataGround', dataGround);

        if (dataGround.code === 'OK') {
          if (dataGround.grounds.length > 0) {
            dataGround.grounds.map((item) => {
              const firstGroundId = dataGround.grounds[0].id;
              //console.log('firstGroundId', firstGroundId);
              setSelectedGround(firstGroundId);

            });
          }
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Llamas a la función asincrónica
  }, []); // Este useEffect se ejecutará solo una vez al montar el componente

  const getCompanyIdFromSessionStorage = useCallback(() => {

    const storedCompanyId = sessionStorage.getItem("selectedCompanyId");
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    if (storedCompanyId) {
      setIdRole(userData?.rol);
      return storedCompanyId;
    } else {
      setIdRole(userData?.rol);
      return userData?.idCompany || "";
    }
  }, []);

  const fetchKgDataQlty = useCallback(async (companyId, groundId, quality) => {

    if (!companyId) {
      setError("Company ID is required.");
      return;
    }

    setIsLoading(true);
    setError(""); // Reset error state

    try {
      if (groundId) {
        const data = await getDataKgDayQlty(companyId, groundId, quality);
        const dataKgSeason = await getDataKgSeason(companyId, groundId, quality);

        setDataKgDayQlty(data);
        setDataKgSeasonQlty(dataKgSeason);

        const grounds = await getDataGround(companyId);
        setAllGround(grounds.grounds.map((item) => item.name));

      } else {
        const grounds = await getDataGround(companyId);
        if (grounds.length > 0) {
          const firstGroundId = grounds[0].id;
          setSelectedGround(firstGroundId);
          const data = await getDataKgDayQlty(companyId, firstGroundId, quality);
          setDataKgDayQlty(data);
          setDataKgSeasonQlty(dataKgSeason);
        } else {
          setError("No grounds found for the company.");
        }
      }
    } catch (error) {
      setError("Error al obtener datos: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);


  const fetchDataDay = useCallback(async (companyId, groundId) => {
    if (!companyId || !groundId ) {
      setError("Company ID y Ground ID son requeridos.");
      return;
    }

    if (alreadyFetched) return;
  setAlreadyFetched(true);
  
    // Si ya existen datos, evitar volver a hacer fetch innecesario
    if (dataKgDay?.kg_boxes && dataKgSeason?.kg_boxes && (dataAllCountries !== true)) {
      return;
    }
  
    setIsLoading(true);
    setLoadingDataKgDay(true);
    setLoadingDataKgSeason(true);
    setLoadingDataWorkers(true);
    setLoadingDataVaritiesDay(true);
    setLoadingDataVaritiesSeason(true);
    setLoadingDataHumidityTemperatureSeason(true);
    setLoadingDataKgAvg(true);
    setLoadingDataKgAvgDay(true);
    setLoadingDataDaysOfHarvest(true);
    setLoadingDataAllDaysOfHarvest(true);
    setLoadingDataVarietiesSeasonPercentage(true);
    setLoadingDataKgGroundAll(true);
    setLoadingDataKgGroundAllTemp(true);
    setLoadingDataKgGroundAllDay(true);
  
    setError("");
  
    try {
      const [
        dataDay,
        dataSeason,
        dataWorkers,
        dataWorkersWeek,
        dataVaritiesDay,
        dataVaritiesSeason,
        dataDispatchGuideDay,
        dataVarietiesSeasonPercentage,
        dataHumidityTemperatureSeason,
        dataKgAvg,
        dataKgAvgDay,
        dataDaysOfHarvest,
        dataAllDaysOfHarvest,
        dataKgGroundAll,
        dataKgGroundAllTemp,
        dataKgGroundAllDay
      ] = await Promise.all([
        getDataKgDay(companyId, groundId),
        getDataKgSeason(companyId, groundId),
        getDataWorkers(companyId, groundId),
        getdataWorkersWeek(companyId, groundId),
        getDataVaritiesDay(companyId, groundId),
        getDataVaritiesSeason(companyId, groundId),
        getDataDispatchDay(companyId, groundId),
        getDataVarietiesSeasonPercentage(companyId, groundId),
        getDataHumidityTemperatureSeason(companyId, groundId),
        getDataCalcKgAvg(companyId, groundId),
        getDataCalcKgAvgDay(companyId, groundId),
        getDataDaysOfHarvest(companyId, groundId),
        getDataAllDaysOfHarvest(companyId, groundId),
        getDataKgGroundAll(companyId, groundId),
        getDataKgGroundAllTemp(companyId, 0),
        getDataKgGroundAllDay(companyId, 0)
      ]);
  
      setDataKgDay(dataDay);
      setDataKgSeason(dataSeason);
      setDataWorkers(dataWorkers);
      setDataWorkersWeek(dataWorkersWeek);
  
      const newOrderDataVarietiesDay = Array.isArray(dataVaritiesDay) ?
        dataVaritiesDay.map((item) => ({
          specie: item.specie,
          variety: item.variety,
          sector: item.sector,
          cantidad: item.cantidad,
          cajas: item.cajas
        })) : [];
  
      setDataVaritiesDay(newOrderDataVarietiesDay);
      setDataVaritiesSeason(dataVaritiesSeason);
      setDataDispatchGuideDay(dataDispatchGuideDay);
      setDataVarietiesSeasonPercentage(dataVarietiesSeasonPercentage);
      setDataHumidityTemperatureSeason(dataHumidityTemperatureSeason);
      setDataKgAvg(dataKgAvg);
      setDataKgAvgDay(dataKgAvgDay);
      setDataDaysOfHarvest(dataDaysOfHarvest);
      setDataAllDaysOfHarvest(dataAllDaysOfHarvest);
      setDataKgGroundAll(dataKgGroundAll);
      setDataKgGroundAllTemp(dataKgGroundAllTemp);
      setDataKgGroundAllDay(dataKgGroundAllDay);
  
    } catch (error) {
      setError("Error al obtener datos: " + error.message);
    } finally {
      setIsLoading(false);
      setLoadingDataKgDay(false);
      setLoadingDataKgSeason(false);
      setLoadingDataWorkers(false);
      setLoadingDataVaritiesDay(false);
      setLoadingDataVaritiesSeason(false);
      setLoadingDataHumidityTemperatureSeason(false);
      setLoadingDataKgAvg(false);
      setLoadingDataKgAvgDay(false);
      setLoadingDataDaysOfHarvest(false);
      setLoadingDataAllDaysOfHarvest(false);
      setLoadingDataVarietiesSeasonPercentage(false);
      setLoadingDataKgGroundAll(false);
      setLoadingDataKgGroundAllTemp(false);
      setLoadingDataKgGroundAllDay(false);
    }
  }, []);

  useEffect(() => {
    setAlreadyFetched(false);
  }, [companyId, selectedGround]);

  const checkForCompanyAndGroundChange = async () => {
    const body = document.body;
    const companyClass = Array.from(body.classList).find((className) =>
      className.startsWith("company-")
    );
    const groundClass = Array.from(body.classList).find((className) =>
      className.startsWith("ground-")
    );


    if (!groundClass || groundClass === 'ground-0' || groundClass === 'ground-') {
      setDataAllCountries(true);
    } else {
      setDataAllCountries(false);
    }

    if (companyClass) {
      const newCompanyId = companyClass.split("-")[1];
      if (newCompanyId !== companyId) {
        setCompanyId(newCompanyId);

        const grounds = await getDataGround(newCompanyId);

        if (grounds.code === 'OK') {
          if (grounds.grounds.length > 0) {
            const firstGroundId = grounds.grounds[0].id;

            setSelectedGround(firstGroundId);
            fetchDataDay(newCompanyId, firstGroundId);
            fetchKgDataQlty(newCompanyId, firstGroundId, 1);
          }
        } else {
          setSelectedGround("");
          fetchDataDay(newCompanyId, "");
          fetchKgDataQlty(newCompanyId, "", 1);
        }
      }
    }

    if (groundClass) {
      const newGroundId = groundClass.split("-")[1];
      if (newGroundId !== selectedGround) {
        setSelectedGround(newGroundId);
        if (companyId) {
          fetchDataDay(companyId, newGroundId);
          fetchKgDataQlty(companyId, newGroundId, 1);
        }
      }
    }
  };

  useEffect(() => {
    const initialCompanyId = getCompanyIdFromSessionStorage();
    const initialGroundId = getSelectedGroundFromSessionStorage();

    if (initialCompanyId) {
      setCompanyId(initialCompanyId);
      if (initialGroundId) {
        setSelectedGround(initialGroundId);
        fetchDataDay(initialCompanyId, 0);
        fetchKgDataQlty(initialCompanyId, initialGroundId, 1);
      } else {
        getDataGround(initialCompanyId).then((grounds) => {
          if (grounds.length > 0) {
            const firstGroundId = grounds[0].id;
            setSelectedGround(firstGroundId);
            fetchDataDay(initialCompanyId, 0);
            fetchKgDataQlty(initialCompanyId, firstGroundId, 1);
          } else {
            setError("No grounds found for the company.");
          }
        }).catch(err => setError("Error fetching grounds: " + err.message));
      }
    }
  }, [
    getCompanyIdFromSessionStorage,
    getSelectedGroundFromSessionStorage,
    fetchDataDay,
    fetchKgDataQlty
  ]);

  

  useEffect(() => {
    const body = document.body;

    const observer = new MutationObserver(checkForCompanyAndGroundChange);
    observer.observe(body, { attributes: true, attributeFilter: ["class"] });

    //console.log('companyId', companyId);
    //console.log('selectedGround', selectedGround);

    checkForCompanyAndGroundChange();

    return () => {
      observer.disconnect();
    };
  }, [companyId, selectedGround, checkForCompanyAndGroundChange]);

  /*useEffect(() => {

    if (selectedGround && companyId) {
      fetchDataDay(companyId, selectedGround);
      fetchKgDataQlty(companyId, selectedGround, 1);
    }
  }, [selectedGround, companyId, fetchDataDay]);*/



  function obtenerNumeroDeSemana(fecha) {
    const primerDiaDelAño = new Date(fecha.getFullYear(), 0, 1);
    const diasTranscurridos = Math.floor(
      (fecha - primerDiaDelAño) / (24 * 60 * 60 * 1000)
    );
    const numeroDeSemana = Math.ceil(
      (diasTranscurridos + primerDiaDelAño.getDay() + 1) / 7
    );
    return numeroDeSemana;
  }

  //Acciones para bloque de horas consolidado
  const blocksGround = async (groundId) => {
    setAllChangeDataGround(groundId);
  };

  useEffect(() => {
    // Solo actualizar si `allGround` tiene elementos y `allChangeDataGround` aún no está seteado.
    if (Array.isArray(allGround)) {
      setAllChangeDataGround(allGround[0]);
      allGround.filter((item) => {
        if (item === allChangeDataGround) {
          setAllChangeDataGround(allChangeDataGround);
        }
      });
    }
  }, [allGround, allChangeDataGround]);

  const filteredData = Array.isArray(dataKgGroundAllStateTemp)
    ? dataKgGroundAllStateTemp.filter(item => item.ground_name === allChangeDataGround)
    : [];

  const filteredDataDay = Array.isArray(dataKgGroundAllStateDay)
    ? dataKgGroundAllStateDay.filter(item => item.ground_name === allChangeDataGround)
    : [];

  const [selectedGroundValue, setSelectedGroundValue] = useState(''); // Estado para el valor seleccionado

  const handleSelectChangeGround = (e) => {
    const value = e.target.value;
    //console.log('value', value);
    setSelectedGroundValue(value);  // Actualizar el estado con el valor seleccionado
    blocksGround(value);       // Llamar a tu función (presumiblemente definida en otro lugar)
  };

  

  return (
    <>
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-4">
        <MiniCard
          name="Período"
          icon={CalendarDaysIcon}
          data={[
            {
              id: 1,
              name: "Fecha",
              value: fechaActual
                .toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "2-digit",
                  year: "numeric",
                })
                .replace(/\//g, "-"),
            },
            {
              id: 2,
              name: "Semana",
              value: obtenerNumeroDeSemana(fechaActual),
            },
          ]}
          featured={true}
          isLoading={isLoading}
        />
        <MiniCard
          name="Total kilos"
          icon={ChartBarIcon}
          data={[
            {
              id: 1,
              name: "Día",
              value: dataKgDay?.kg_boxes || 0,
            },
            {
              id: 2,
              name: "Temporada",
              value: dataKgSeason?.kg_boxes || 0,
            },
          ]}
          isLoading={loadingDataKgDay && loadingDataKgSeason}
        />

        <MiniCard
          name="Información Temporada"
          icon={ChartBarIcon}
          data={[
            {
              id: 1,
              name: "Días cos.",
              value: dataAllDaysOfHarvest[0]?.dias_cosecha || 0,
            },
            {
              id: 2,
              name: "Kg. Prom.",
              value:
                (dataKgSeason?.kg_boxes && dataAllDaysOfHarvest[0]?.dias_cosecha)
                  ? Number((dataKgSeason.kg_boxes / dataAllDaysOfHarvest[0].dias_cosecha).toFixed(1))
                  : 0,
            },
          ]}
          isLoading={loadingDataAllDaysOfHarvest && loadingDataKgAvg}
        />

        <MiniCard
          name="N° Cosecheros"
          icon={UsersIcon}
          data={[
            {
              id: 1,
              name: "Total",
              value: dataWorkers.workersCount || 0,
            },
            {
              id: 2,
              name: "Registros",
              value: dataWorkersWeek?.workersWeek || 0,
            },
            {
              id: 3,
              name: "Kg. Prom. Día",
              value:
                (dataKgDay?.kg_boxes && dataWorkers?.workersCount)
                  ? Number((dataKgDay.kg_boxes / dataWorkers.workersCount).toFixed(1))
                  : 0,
            },
          ]}
          isLoading={loadingDataWorkers && loadingDataWorkersWeek && loadingDataKgAvgDay}
        />
      </div>
      {dataAllCountries !== true && (
        <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">

            <div className="ml-auto mr-0 flex items-center gap-4">
              <p>Visualizar Kg por:</p>
              <select className="w-[150px] p-2 border border-gray-300 rounded-md dark:bg-navy-800 dark:text-white ml-auto mr-0"
                value={selectedOption}
                onChange={handleSelectChange}>
                <option value="1">Día</option>
                <option value="2">Temporada</option>
              </select>
            </div>
            {selectedOption === '1' ? (
              <CardTable
                data={dataVaritiesDayState}
                thead="Especie, Variedad, Sector, Cantidad, Cajas"
                columnsClasses={[
                  "text-left",
                  "text-left",
                  "text-left",
                  "text-right",
                  "text-right",
                ]}
                loadingData={loadingDataVaritiesDay}
                title="Kilos variedad día"
              />
            ) : (
              <CardTable
                data={dataVaritiesSeason}
                thead="Especie, Variedad, Cantidad, Cajas"
                omitirColumns={["sector"]}
                columnsClasses={[
                  "text-left",
                  "text-left",
                  //"text-left",
                  "text-right",
                  "text-right",
                  "text-right",
                ]}
                loadingData={loadingDataVaritiesSeason}
                title="Kilos variedad temporada"
              />
            )}
          </div>

          <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
            <CardTable
              data={dataDaysOfHarvest}
              thead="Especie, Variedad, Días de cosecha"
              omitirColumns={["id"]}
              title="Días de cosecha"
              loadingData={loadingDataDaysOfHarvest}
            />
          </div>

        </div>
      )}

      {dataAllCountries !== true ? (
        <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <PieChart
              data={dataVarietiesSeasonPercentage}
              title="Variedad temporada"
              loadingData={loadingDataVarietiesSeasonPercentage}
            />
          </div>

          <div className="lg:col-span-2">
            <LineChart
              data={dataHumidityTemperatureSeason}
              title="Humedad y temperatura"
              loadingData={loadingDataHumidityTemperatureSeason}
            />
          </div>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-2">

          <div className="!z-5 relative flex flex-col rounded-[20px] bg-clip-border dark:!bg-navy-800 dark:text-white gap-5">

            {dataAllCountries !== false && (

              <>
                <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">

                  <div className="ml-auto mr-0 flex items-center gap-4">
                    <p>Visualizar Kg por:</p>
                    <select className="w-[150px] p-2 border border-gray-300 rounded-md dark:bg-navy-800 dark:text-white ml-auto mr-0"
                      value={selectedOption}
                      onChange={handleSelectChange}>
                      <option value="1">Día</option>
                      <option value="2">Temporada</option>
                    </select>
                  </div>
                  {selectedOption === '1' ? (
                    <CardTable
                      data={dataVaritiesDayState}
                      thead="Especie, Variedad, Sector, Cantidad, Cajas"
                      columnsClasses={[
                        "text-left",
                        "text-left",
                        "text-left",
                        "text-right",
                        "text-right",
                      ]}
                      loadingData={loadingDataVaritiesDay}
                      title="Kilos variedad día"
                    />
                  ) : (
                    <CardTable
                      data={dataVaritiesSeason}
                      thead="Especie, Variedad, Cantidad, Cajas"
                      omitirColumns={["sector"]}
                      columnsClasses={[
                        "text-left",
                        "text-left",
                        //"text-left",
                        "text-right",
                        "text-right",
                        "text-right",
                      ]}
                      loadingData={loadingDataVaritiesSeason}
                      title="Kilos variedad temporada"
                    />
                  )}
                </div>


                <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
                  <CardTable
                    data={dataDaysOfHarvest}
                    thead="Especie, Variedad, Días de cosecha"
                    omitirColumns={["id"]}
                    title="Días de cosecha"
                    loadingData={loadingDataDaysOfHarvest}
                  />
                </div>
              </>

            )}

            <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
              <CardTable
                data={dataKgGroundAllState}
                thead="Estado, Campo, Especie, Kg totales"
                omitirColumns={["id"]}
                title="Kilos totales por campo"
                loadingData={loadingDataKgGroundAll}
              />
            </div>
          </div>

          <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
            {allGround && Array.isArray(allGround) && allGround.length > 1 && (
              <div className="ml-auto mr-0 flex items-center gap-4">
                <label htmlFor="ground">Campo:</label>

                <select
                  className="w-[150px] p-2 border border-gray-300 rounded-md dark:bg-navy-800 dark:text-white ml-auto mr-0"
                  //onChange={(e) => blocksGround(e.target.value)}
                  value={selectedGroundValue}
                  onChange={handleSelectChangeGround}
                >
                  {allGround && allGround.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="ml-auto mr-0 flex items-center gap-4">
              <p>Rango de horario por:</p>
              <select className="w-[150px] p-2 border border-gray-300 rounded-md dark:bg-navy-800 dark:text-white ml-auto mr-0"
                value={selectedOptionHours}
                onChange={handleSelectChangeHours}>
                <option value="1">Día</option>
                <option value="2">Temporada</option>
              </select>
            </div>

            {selectedOptionHours === '1' ? (
              <CardTable
                data={filteredDataDay}
                thead="Campo, Horas, Temp. Prom., Hum. Prom., Kg totales"
                omitirColumns={["id", "ground_status"]}
                title="Rango por horarios"
                loadingData={loadingDataKgGroundAllDay}
              />
            ) : (
              <CardTable
                data={filteredData}
                thead="Campo, Horas, Temp. Prom., Hum. Prom., Kg totales"
                omitirColumns={["id", "ground_status"]}
                title="Rango por horarios"
                loadingData={loadingDataKgGroundAllTemp}
              />
            )}
          </div>
        </div>
      )
      }

    </>
  );
};

export default Dashboard;