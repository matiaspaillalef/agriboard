"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HiX } from "react-icons/hi";
import SidebarMenu from "./components/Links";
import Weather from "../weather/Weather";
import "@/assets/css/Sidebar.css";
import {
  ChevronDownIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import CustomImage from "@/components/customImage/CustomImage";

import { getDataCompanies } from "@/app/api/ConfiguracionApi";

const Sidebar = ({ open, onClose }) => {
  const [dataCompanies, setDataCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    sessionStorage.removeItem("isLoggedIn");
    router.push("/");
  }

  useEffect(() => {
    // Función para obtener el idCompany almacenado en sessionStorage o userData
    const getStoredCompanyId = () => {
      const storedCompanyId = sessionStorage.getItem('selectedCompanyId');
      if (storedCompanyId) {
        setSelectedCompanyId(storedCompanyId);
      } else {
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        if (userData && userData.idCompany) {
          setSelectedCompanyId(userData.idCompany);
        }
      }
    };

    // Obtener datos de empresas
    const fetchData = async () => {
      try {
        const data = await getDataCompanies();
        setDataCompanies(data);
      } catch (error) {
        console.error("Error al obtener datos de empresas:", error);
      }
    };

    getStoredCompanyId(); // Obtener el idCompany almacenado
    fetchData(); // Obtener datos de las empresas

  }, []);
  

  const handleChange = (e) => {
    const companyId = e.target.value;
    setSelectedCompanyId(companyId);

    // Actualizar sessionStorage con el nuevo idCompany seleccionado
    sessionStorage.setItem('selectedCompanyId', companyId);

    // Actualizar userData en sessionStorage con el nuevo idCompany seleccionado
    const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
    userData.idCompany = companyId;
    sessionStorage.setItem('userData', JSON.stringify(userData));
    
    //agregar clase con el id company al body
    document.body.classList.add(`company-${companyId}`);
    // Actualizar la página para mostrar los datos de la empresa seleccionada
    //window.location.reload();
  };

  useEffect(() => {
    if (selectedCompanyId) {
      // Agregar clase al body con el id de la empresa seleccionada
      document.body.classList.add(`company-${selectedCompanyId}`);

      // Limpiar la clase al desmontar el componente o cambiar la selección
      return () => {
        document.body.classList.remove(`company-${selectedCompanyId}`);
      };
    }
  }, [selectedCompanyId]);

  return (

    <div id="sidenav" className={`sm:none duration-175 linear fixed !z-50 flex flex-col bg-blueTertiary pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 min-w-[300px] rounded-xl sm:left-0 md:left-[15px] top-1/2 translate-y-[-50%] translate-x-[-130%] ${open ? '!translate-x-0' : ''}`}>
      <span className="absolute top-4 right-4 block cursor-pointer xl:hidden" onClick={onClose}>
        <HiX />
      </span>

      <CustomImage companyID={selectedCompanyId} />

      <div id="sidebar" className="mt-[50px] border-t border-blueQuaternary">
        <div className="px-8 py-8">
          <div className="!z-5 relative flex rounded-[8px] bg-clip-border dark:bg-navy-900 dark:text-white dark:shadow-none !flex-row flex-grow items-center p-5">
            <Weather />
          </div>
        </div>

        {dataCompanies && dataCompanies.length > 0 && (
          <div className="px-8 mb-5">
            <label className="block text-sm font-medium text-white dark:text-white mb-2">
              Empresas
            </label>
            <select
              className="w-full px-8 py-4 rounded-md text-sm font-medium text-white dark:text-white bg-blueQuaternary dark:bg-navy-900 border-t border-blueQuaternary dark:border-navy-800"
              value={selectedCompanyId}
              onChange={handleChange}
            >
              {dataCompanies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name_company}
                </option>
              ))}
            </select>
          </div>
        )}

        <ul className="mb-auto pt-1">
          <SidebarMenu pathname={pathname} />
          <li className="relative mb-3 px-8">
            <button
              onClick={handleLogout}
              className="flex cursor-pointer items-center w-full pb-2 px-8"
            >
              <ArrowLeftStartOnRectangleIcon className="w-6 h-6 font-medium text-blueQuinary" />
              <p className="leading-1 flex justify-between items-center ms-4 font-medium text-white w-full text-sm text-left hover:text-blueQuinary">
                Cerrar Sesión
              </p>
            </button>
          </li>
        </ul>
      </div>
      <p className="px-8 pt-8 text-xs mb-0 text-white dark:text-white">
        &copy; {new Date().getFullYear()} Agrisoft Software
      </p>
      <span className="px-8 text-gray-500 text-xs">v 1.0.0.1</span>
    </div>
  );
};

export default Sidebar;
