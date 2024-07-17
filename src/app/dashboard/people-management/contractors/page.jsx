'use client'

import CardTableContractors from "@/components/card/CardTableContractors";
import { getDataContractors } from "@/app/api/ManagementPeople";
import { useEffect, useState } from "react";

const PeopleManagementContractors = () => {
  const [dataContractors, setDataContractors] = useState([]);
  
  useEffect(() => {
    // Obtener userData desde sessionStorage
    const userDataString = sessionStorage.getItem("userData");
    const userData = JSON.parse(userDataString);
    const idCompany = userData.idCompany;
    
    // Obtener datos de contratistas usando idCompany
    const fetchData = async () => {
      try {
        const data = await getDataContractors(idCompany);
        setDataContractors(data);
      } catch (error) {
        console.error("Error al obtener datos de contratistas:", error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <>
      <div className="flex w-full flex-col gap-5 mt-3">
        <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
          <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
            <CardTableContractors
              data={dataContractors}
              thead="RUT, Nombre, Apellido, Giro, Teléfono, Email, Región, Ciudad, Estado"
              downloadBtn={true}
              SearchInput={true}
              actions={true}
              omitirColumns={"id"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PeopleManagementContractors;
