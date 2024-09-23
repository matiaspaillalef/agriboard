'use client'

import CardTableSquads from "@/components/card/CardSquads";
import { getDataSquads } from "@/app/api/ManagementPeople";
import { useEffect, useState, useCallback  } from "react";
import LoadingData from "@/components/loadingData/loadingData";

const PeopleManagementSquads = () => {

  const [dataSquads, setDataSquads] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [isLoading, setIsLoading] = useState(true);


   // Función para obtener selectedCompanyId desde sessionStorage o userData
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
      const data = await getDataSquads(companyId);
      setDataSquads(data);

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
  return (
    <>
      {isLoading ? (
        <LoadingData />
      ) : (
        <div className="flex w-full flex-col gap-5 mt-3">
          <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
            <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
              <CardTableSquads
                data={dataSquads}
                thead="ID, Nombre, Grupo, Estado"
                omitirColumns={["workers", "company_id"]}
                downloadBtn={true}
                SearchInput={true}
                actions={true}
                companyID={selectedCompanyId}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PeopleManagementSquads;