'use client'

import CardTableGroups from "@/components/card/CardGroups";
import { getDataGroups } from "@/app/api/ManagementPeople";
import { useEffect, useState, useCallback } from "react";
import LoadingData from "@/components/loadingData/loadingData";

const PeopleManagementGroups = () => {

  const [dataGroups, setDataGroups] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [isLoading, setIsLoading] = useState(true);


  // Función para obtener selectedCompanyId desde sessionStorage o userData
  const getCompanyIdFromSessionStorage = useCallback(() => {

    const storedCompanyId = sessionStorage.getItem("selectedCompanyId");

    if (storedCompanyId) {

      setSelectedCompanyId(storedCompanyId);

    } else {

      const userData = JSON.parse(sessionStorage.getItem("userData"));

      if (userData && userData.idCompany) {
        setSelectedCompanyId(userData.idCompany);
      }
    }
  }, []);

  // Función para obtener datos de Positions
  const fetchData = useCallback(async (companyId) => {

    setIsLoading(true);

    try {

      const data = await getDataGroups(companyId);
      setDataGroups(data);

    } catch (error) {

      console.error("Error al obtener datos:", error);

    } finally {

      setIsLoading(false);

    }
  }, []);

  useEffect(() => { getCompanyIdFromSessionStorage(); }, [getCompanyIdFromSessionStorage]); // Se ejecuta solo una vez al montar el componente

  useEffect(() => {
    // Obtener el companyId inicial para la primera 98/*carga
    const initialFetch = async () => {

      let companyID = selectedCompanyId;

      // Si no hay selectedCompanyId inicial, obtenerlo de userData
      if (!companyID) {

        const userData = JSON.parse(sessionStorage.getItem("userData"));

        if (userData && userData.idCompany) {

          companyID = userData.idCompany;
          setSelectedCompanyId(companyID); // Actualizar selectedCompanyId en el estado

        }
      }

      // Llamar a fetchData con el companyID obtenido
      await fetchData(companyID);

    };

    initialFetch();

  }, [fetchData, selectedCompanyId]); // Ejecutar al iniciar y cuando selectedCompanyId cambie

  useEffect(() => {
    // Observar cambios en las clases del body y actualizar datos si es necesario
    const observer = new MutationObserver((mutations) => {

      mutations.forEach((mutation) => {

        if (mutation.type === "attributes" && mutation.attributeName === "class") {

          const storedCompanyId = sessionStorage.getItem("selectedCompanyId");
          //console.log("storedCompanyId:", storedCompanyId);

          let companyID = selectedCompanyId;

          // Si hay un storedCompanyId en sessionStorage, usarlo
          if (storedCompanyId) {

            companyID = storedCompanyId;

          } else {

            // Si no, obtenerlo de userData si está disponible
            const userData = JSON.parse(sessionStorage.getItem("userData"));

            if (userData && userData.idCompany) {

              companyID = userData.idCompany;

            }
          }
          // Llamar a fetchData con el companyID obtenido
          fetchData(companyID);
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, [fetchData, selectedCompanyId]);



  return (
    <>
      {isLoading ? (
        <LoadingData />
      ) : (
        <div className="flex w-full flex-col gap-5 mt-3">
          <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
            <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
              <CardTableGroups
                data={dataGroups}
                thead="ID, Nombre, Estado"
                downloadBtn={true}
                SearchInput={true}
                actions={true}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PeopleManagementGroups;