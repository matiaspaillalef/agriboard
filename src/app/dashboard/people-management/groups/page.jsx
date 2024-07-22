'use client'

import CardTableGroups from "@/components/card/CardGroups";
import { getDataGroups } from "@/app/api/ManagementPeople";
import { useEffect, useState } from "react";

const PeopleManagementGroups =  () => {
  
  const [dataGroups, setDataGroups] = useState([]);
  
  useEffect(() => {
    // Obtener userData desde sessionStorage
    const userDataString = sessionStorage.getItem("userData");
    const userData = JSON.parse(userDataString);
    const idCompany = userData.idCompany;

    console.log("userData:", userData);
    
    // Obtener datos de contratistas usando idCompany
    const fetchData = async () => {
      try {
        const data = await getDataGroups(idCompany);
        
        setDataGroups(data);
      } catch (error) {
        console.error("Error al obtener registros: ", error);
      }
    };
    
    fetchData();
  }, []);
  
    return (
      <>
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
      </>
    );
  }
  
  export default PeopleManagementGroups;