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

  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    sessionStorage.removeItem("isLoggedIn");
    router.push("/");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDataCompanies();
        setDataCompanies(data);
      } catch (error) {
        console.error("Error al obtener datos de contratistas:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 min-w-[300px] ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <CustomImage />

      <div className="scrolling h-[600px] overflow-y-scroll mt-[50px] border-t border-bg-lightPrimary">
        <div className="px-8 py-8">
          <div className="!z-5 relative flex rounded-[8px] bg-lightPrimary bg-clip-border shadow-3xl shadow-shadow-500 dark:bg-navy-900 dark:text-white dark:shadow-none !flex-row flex-grow items-center p-5">
            <Weather />
          </div>
        </div>

        {dataCompanies.length > 0 && (
          <div className="px-8">
            <label className="block text-sm font-medium text-gray-600 dark:text-white mb-2">
              Empresas
            </label>
            <select className="w-full px-8 py-4 rounded-md text-sm font-medium text-gray-600 dark:text-white bg-lightPrimary dark:bg-navy-900 border-t border-bg-lightPrimary dark:border-navy-800">
              {console.log(dataCompanies)}
              {dataCompanies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name_company}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="px-8 py-4 pb-8">
          <label className="block text-sm font-medium text-gray-600 dark:text-white mb-2">
            Campos
          </label>
          <select className="w-full px-8 py-4 rounded-md text-sm font-medium text-gray-600 dark:text-white bg-lightPrimary dark:bg-navy-900 border-t border-bg-lightPrimary dark:border-navy-800">
            <option value="1">Campo 1</option>
            <option value="2">Campo 2</option>
          </select>
        </div>

        <ul className="mb-auto pt-1">
          <SidebarMenu pathname={pathname} />
          <li className="relative mb-3 px-8">
            <button
              onClick={handleLogout}
              className="flex cursor-pointer items-center w-full pb-2 px-8"
            >
              <ArrowLeftStartOnRectangleIcon className="w-6 h-6 font-medium text-gray-600" />
              <p className="leading-1 flex justify-between items-center ms-4 font-medium text-gray-600 w-full text-sm text-left">
                Cerrar Sesión
              </p>
            </button>
          </li>
        </ul>
      </div>
      <p className="px-8 py-8 text-xs mb-0 text-navy-700 dark:text-white">
        &copy; {new Date().getFullYear()} Agrisoft Software
      </p>
    </div>
  );
};

export default Sidebar;
