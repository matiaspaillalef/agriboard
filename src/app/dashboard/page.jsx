"use client";

import { useState, useEffect, useCallback } from "react";
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
  getDataDispatchDay,
  getDataVarietiesSeasonPercentage,
  getDataHumidityTemperatureSeason,
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
import { set } from "date-fns";

const fechaActual = new Date();

const Dashboard = () => {
  const [dataKgDay, setDataKgDay] = useState({});
  const [dataKgDayQlty, setDataKgDayQlty] = useState({});
  const [dataKgSeason, setDataKgSeason] = useState({});
  const [dataKgSeasonQlty, setDataKgSeasonQlty] = useState({});
  const [dataWorkers, setDataWorkers] = useState([]);
  const [dataWorkersWeek, setDataWorkersWeek] = useState([]);
  const [dataVaritiesDay, setDataVaritiesDay] = useState([]);
  const [dataVarietiesSeasonPercentage, setDataVarietiesSeasonPercentage] =
    useState([]);
  const [dataHumidityTemperatureSeason, setDataHumidityTemperatureSeason] =
    useState([]);
  const [dataDispatchGuideDay, setDataDispatchGuideDay] = useState([]);
  const [selectedGround, setSelectedGround] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [idRole, setIdRole] = useState("");

  // Función para obtener el ID del ground seleccionado del sessionStorage
  const getSelectedGroundFromSessionStorage = useCallback(() => {
    return sessionStorage.getItem("selectedGround");
  }, []);

  // Función para obtener el ID de la compañía desde el sessionStorage
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

  // Función para realizar el fetch y actualizar los datos
  const fetchDataDay = useCallback(async (companyId, groundId) => {
    setIsLoading(true);

    try {
      if (groundId) {
        // Si groundId está definido, obtén los datos de kg para ese groundId
        const dataDay = await getDataKgDay(companyId, groundId);
        const dataSeason = await getDataKgSeason(companyId, groundId);
        const dataWorkers = await getDataWorkers(companyId, groundId);
        const dataWorkersWeek = await getdataWorkersWeek(companyId, groundId);
        const dataVaritiesDay = await getDataVaritiesDay(companyId, groundId);
        const dataDispatchGuideDay = await getDataDispatchDay(companyId, groundId);
        const dataVarietiesSeasonPercentage = await getDataVarietiesSeasonPercentage(companyId, groundId);
        const dataHumidityTemperatureSeason = await getDataHumidityTemperatureSeason(companyId, groundId);

        setDataKgDay(dataDay);
        setDataKgSeason(dataSeason);
        setDataWorkers(dataWorkers);
        setDataWorkersWeek(dataWorkersWeek);
        setDataVaritiesDay(dataVaritiesDay);
        setDataDispatchGuideDay(dataDispatchGuideDay);
        setDataVarietiesSeasonPercentage(dataVarietiesSeasonPercentage);
        setDataHumidityTemperatureSeason(dataHumidityTemperatureSeason);
      } else {
        const grounds = await getDataGround(companyId);
        if (grounds.length > 0) {
          const firstGroundId = grounds[0].id;
          setSelectedGround(firstGroundId);
          // Realiza las solicitudes de datos para el primer groundId
          const dataDay = await getDataKgDay(companyId, firstGroundId);
          const dataSeason = await getDataKgSeason(companyId, firstGroundId);
          const dataWorkers = await getDataWorkers(companyId, firstGroundId);
          const dataWorkersWeek = await getdataWorkersWeek(companyId, firstGroundId);
          const dataVaritiesDay = await getDataVaritiesDay(companyId, firstGroundId);
          const dataDispatchGuideDay = await getDataDispatchDay(companyId, firstGroundId);
          const dataVarietiesSeasonPercentage = await getDataVarietiesSeasonPercentage(companyId, firstGroundId);
          const dataHumidityTemperatureSeason = await getDataHumidityTemperatureSeason(companyId, firstGroundId);

          setDataKgDay(dataDay);
          setDataKgSeason(dataSeason);
          setDataWorkers(dataWorkers);
          setDataWorkersWeek(dataWorkersWeek);
          setDataVaritiesDay(dataVaritiesDay);
          setDataDispatchGuideDay(dataDispatchGuideDay);
          setDataVarietiesSeasonPercentage(dataVarietiesSeasonPercentage);
          setDataHumidityTemperatureSeason(dataHumidityTemperatureSeason);
        } else {
          console.error("No grounds found for the company.");
        }
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      //Retraso la carga de la animación de carga para que no se vea tan rápido
    }
  }, []);

  const fetchKgDataQlty = useCallback(async (companyId, groundId, quality) => {
    setIsLoading(true);

    try {
      if (groundId) {
        // Si groundId está definido, obtén los datos de kg para ese groundId

        const data = await getDataKgDayQlty(companyId, groundId, quality);
        const dataKgSeason = await getDataKgSeason(
          companyId,
          groundId,
          quality
        );

        setDataKgDayQlty(data);
        setDataKgSeasonQlty(dataKgSeason);
      } else {
        // Si groundId no está definido, obtén los datos de grounds para encontrar el primer id
        const grounds = await getDataGround(companyId);
        if (grounds.length > 0) {
          const firstGroundId = grounds[0].id;
          setSelectedGround(firstGroundId);
          const data = await getDataKgDayQlty(
            companyId,
            firstGroundId,
            quality
          );
          setDataKgDayQlty(data);
          setDataKgSeasonQlty(dataKgSeason);
        } else {
          console.error("No grounds found for the company.");
        }
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para verificar y actualizar el companyId y selectedGround
  const checkForCompanyAndGroundChange = async () => {
    const body = document.body;
    const companyClass = Array.from(body.classList).find((className) =>
      className.startsWith("company-")
    );
    const groundClass = Array.from(body.classList).find((className) =>
      className.startsWith("ground-")
    );

    if (companyClass) {
      const newCompanyId = companyClass.split("-")[1]; // Extraer el ID de la clase
      if (newCompanyId !== companyId) {
        setCompanyId(newCompanyId);
        const grounds = await getDataGround(newCompanyId);
        if (grounds.length > 0) {
          const firstGroundId = grounds[0].id;
          setSelectedGround(firstGroundId);
          fetchDataDay(newCompanyId, firstGroundId);
          fetchKgDataQlty(newCompanyId, firstGroundId, 1);
        }
      }
    }

    if (groundClass) {
      const newGroundId = groundClass.split("-")[1]; // Extraer el ID de la clase
      if (newGroundId !== selectedGround) {
        setSelectedGround(newGroundId);
        if (companyId) {
          fetchDataDay(companyId, newGroundId);
          fetchKgDataQlty(companyId, newGroundId, 1);
        }
      }
    }
  };

  // Efecto para inicializar companyId y hacer fetch inicial
  useEffect(() => {
    const initialCompanyId = getCompanyIdFromSessionStorage();
    const initialGroundId = getSelectedGroundFromSessionStorage();

    if (initialCompanyId) {
      setCompanyId(initialCompanyId);
      if (initialGroundId) {
        setSelectedGround(initialGroundId);
        fetchDataDay(initialCompanyId, initialGroundId);
        fetchKgDataQlty(initialCompanyId, initialGroundId, 1);
      } else {
        getDataGround(initialCompanyId).then((grounds) => {
          if (grounds.length > 0) {
            const firstGroundId = grounds[0].id;
            setSelectedGround(firstGroundId);
            fetchDataDay(initialCompanyId, firstGroundId);
            fetchKgDataQlty(initialCompanyId, firstGroundId, 1);
          } else {
            console.error("No grounds found for the company.");
          }
        });
      }
    }
  }, [
    getCompanyIdFromSessionStorage,
    getSelectedGroundFromSessionStorage,
    fetchDataDay,
  ]);

  // Efecto para observar cambios en el body y actualizar el estado
  useEffect(() => {
    const body = document.body;

    // Crear un MutationObserver para observar cambios en el body
    const observer = new MutationObserver(checkForCompanyAndGroundChange);
    observer.observe(body, { attributes: true, attributeFilter: ["class"] });

    // Inicializar el estado con el valor actual del sessionStorage
    checkForCompanyAndGroundChange();

    // Limpiar el observer al desmontar el componente
    return () => {
      observer.disconnect();
    };
  }, [companyId, selectedGround, fetchDataDay]);

  // Efecto para hacer fetch cuando selectedGround cambia
  useEffect(() => {
    if (selectedGround && companyId) {
      fetchDataDay(companyId, selectedGround);
    }
  }, [selectedGround, companyId, fetchDataDay]);

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
          name="Total kilos día"
          icon={ChartBarIcon}
          data={[
            {
              id: 1,
              name: "Fresco",
              value: dataKgDay?.kg_boxes || 0,
            },
            {
              id: 2,
              name: "IQF",
              value: dataKgDayQlty?.kg_boxes || 0,
            },
          ]}
          isLoading={isLoading}
        />

        <MiniCard
          name="Kilos temporada"
          icon={ChartBarIcon}
          data={[
            {
              id: 1,
              name: "Fresco",
              value: dataKgSeason?.kg_boxes || 0,
            },
            {
              id: 2,
              name: "IQF",
              value: dataKgSeasonQlty?.kg_boxes || 0,
            },
          ]}
          isLoading={isLoading}
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
              name: "Semana",
              value: dataWorkersWeek?.workersWeek || 0,
            },
          ]}
          isLoading={isLoading}
        />
      </div>
      <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
          <CardTable
            data={dataVaritiesDay}
            thead="Variedad, Cantidad, Cajas"
            columnsClasses={[
              "text-left",
              "text-right",
              "text-right",
              "text-right",
              "text-right",
            ]}
            title="Kilos variedad día"
          />
        </div>

        <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
          <CardTable
            data={dataDispatchGuideDay}
            thead="Guía, Exportadora, Cajas, Kilos, Abbreviación"
            omitirColumns={["id"]}
            title="Despachos del día"
          />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <PieChart
            data={dataVarietiesSeasonPercentage}
            title="Variedad temporada"
          />
        </div>



        <div className="lg:col-span-2">
          <LineChart
            data={dataHumidityTemperatureSeason}
            title="Humedad y temperatura"
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
