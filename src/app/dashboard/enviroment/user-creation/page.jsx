//"use client";
//import { useState, useRef } from "react";
import CardTableUsers from "@/components/card/CardTableUsers";

import { getDataUser, getRoles }  from "@/app/api/ApisConfig";
import { BsFileEarmarkCheck } from "react-icons/bs";
import ModalUserCreation from "@/components/modal/ModalUserCreation";

const UserCreationPage = async () => {

  const dataUsers = await getDataUser();
  const roles = await getRoles();
  
  return (
    <>
      <div className="flex w-full flex-col gap-5 mt-3">
        <ModalUserCreation datoscombos={roles}/>

        <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
          <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
            <CardTableUsers
              data={dataUsers}
              thead="ID, Nombre, Apellido, Correo, Rol, Estado, Acciones"
              downloadBtn={true}
              SearchInput={true}
              omitirColumns={["id_rol"]}
              actions={true}
              datoscombos={roles}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCreationPage;
