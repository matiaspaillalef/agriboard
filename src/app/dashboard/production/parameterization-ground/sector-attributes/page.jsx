"use client";

import CardTableSectorAttributes from "@/components/card/CardTableSectorAttributes";
import { getDataGround, getDataAttributesSector } from "@/app/api/ProductionApi";
import { getDataCompanies } from "@/app/api/ConfiguracionApi";
import { useEffect, useState, useCallback } from "react";

import LoadingData from "@/components/loadingData/loadingData";
import { set } from "react-hook-form";

const ProductionSectorAttributes = () => {
  const [dataSectorAttributes, setDataSectorAttributes] = useState([]);
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
      const data = await  getDataAttributesSector(companyId);
      const companies = await getDataCompanies();
      
      setDataSectorAttributes(data);
      setDataCompanies(companies);

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

  console.log(dataSectorAttributes);

  return (
    <>
      {isLoading ? (
        <LoadingData />
      ) : (
        <div className="flex w-full flex-col gap-5 mt-3">
          <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
            <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
              <CardTableSectorAttributes
                data={dataSectorAttributes}
                thead="Temporada, Sector, Especie, Variedad, Año Plantación, Ha. Productivas, Cosecha Finalizada, Kg Sector, Kg Hectareas, Kg Plantas"
                downloadBtn={true}
                SearchInput={true}
                actions={true}
                companyID={selectedCompanyId} //PAso esto para tener el id actual para llevarlo oculto en el formulario de edición y creación
                datosCompanies={dataCompanies}
                omitirColumns={["id", "company_id", "hileras", "plants", "min_daily_frecuency", "max_daily_frecuency", "stimation_good", "stimation_regular", "stimation_bad", "stimation_replant_kg", "surface", "interrow_density", "row_density", "quantity_plants_ha", "clasification", "rotation", "porc_regular", "porc_replant"]}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductionSectorAttributes;