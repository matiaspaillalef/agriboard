"use client";

import CardTableBarracks from "@/components/card/CardTableBarracks";
import { getDataGround, getDataSectorBarracks } from "@/app/api/ProductionApi";
import { getDataCompanies } from "@/app/api/ConfiguracionApi";
import { useEffect, useState, useCallback } from "react";

import LoadingData from "@/components/loadingData/loadingData";
import { set } from "react-hook-form";

const PeopleManagementSectorsBarracks = () => {
  const [dataSectors, setDataSectors] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [dataCompanies, setDataCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getCompanyIdFromSessionStorage = useCallback(() => {
    const storedCompanyId = sessionStorage.getItem("selectedCompanyId");
    if (storedCompanyId) {
      return storedCompanyId;
    } else {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      return userData?.idCompany || "";
    }
  }, []);

  const fetchData = useCallback(async (companyId) => {
    setIsLoading(true);
    try {
      const data = await getDataSectorBarracks(companyId);
      const companies = await getDataCompanies();

      console.log("Data de sectores:", data);

      if(data === 'ERROR'){
        console.log("Error al obtener datos de sectores");
        setDataSectors([]);
      }else{
        setDataSectors(data);
      }

     

      
      setDataCompanies(companies);
      console.log("Data de sectores:", data);
      console.log("Data de empresas:", companies);

    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const companyId = getCompanyIdFromSessionStorage();
    setSelectedCompanyId(companyId);
    if (companyId) {
      fetchData(companyId);
    }
  }, [getCompanyIdFromSessionStorage, fetchData]);

  useEffect(() => {
    if (!selectedCompanyId) return;

    const observer = new MutationObserver(() => {
      const companyId = getCompanyIdFromSessionStorage();
      if (companyId !== selectedCompanyId) {
        setSelectedCompanyId(companyId);
        fetchData(companyId);
      }
    });

    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, [selectedCompanyId, fetchData, getCompanyIdFromSessionStorage]);

  console.log(dataSectors.length);

  return (
    <>
      {isLoading ? (
        <LoadingData />
      ) : (
        <div className="flex w-full flex-col gap-5 mt-3">
          <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
            <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
              <CardTableBarracks
                data={dataSectors}
                thead="Nombre, Campo, Estado"
                downloadBtn={true}
                SearchInput={true}
                actions={true}
                companyID={selectedCompanyId} //PAso esto para tener el id actual para llevarlo oculto en el formulario de edición y creación
                datosCompanies={dataCompanies}
                omitirColumns={["id", "company_id"]}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PeopleManagementSectorsBarracks;