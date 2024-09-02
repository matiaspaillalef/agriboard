"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Avatar from "@/assets/img/avatars/avatar7.png";

import { getDataGround } from "@/app/api/ProductionApi";

import WeatherMini from "../weather/WatherMini";
import Breadcrumb from "../breadcrumbs";
import TitlePage from "../titlePage";

const Navbar = (props) => {
  const { onOpenSidenav } = props;
  const [darkmode, setDarkmode] = useState(false);

  const [dataGrounds, setDataGrounds] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedGround, setSelectedGround] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const path = usePathname();

  useEffect(() => {
    const darkmodeSession = sessionStorage.getItem("darkmode");
    if (darkmodeSession) {
      setDarkmode(JSON.parse(darkmodeSession));
    }
  }, []);

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
      const data = await getDataGround(companyId);
      setDataGrounds(data);
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

  const toggleDarkMode = () => {
    if (darkmode) {
      document.body.classList.remove("dark");
      sessionStorage.setItem("darkmode", JSON.stringify(false));
      setDarkmode(false);
    } else {
      document.body.classList.add("dark");
      sessionStorage.setItem("darkmode", JSON.stringify(true));
      setDarkmode(true);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

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

  // Obtener el valor almacenado en sessionStorage
  const userDataString = sessionStorage.getItem("userData");
  const userData = JSON.parse(userDataString);

  const handleGroundChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedGround(selectedValue);
    sessionStorage.setItem("selectedGround", selectedValue);
    // Añadir clase al body
    document.body.classList.forEach((className) => {
      if (className.startsWith("ground-")) {
        document.body.classList.remove(className);
      }
    });
    if (selectedValue) {
      document.body.classList.add(`ground-${selectedValue}`);
    }
  };

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <div className="h-6 lg:w-[224px] pt-1">
          <Breadcrumb />
        </div>

        <TitlePage />
      </div>

      <div className="flex items-center justify-center gap-2">
        {path === "/dashboard" && (
          <div className="relative mt-[3px] flex h-[61px] w-[255px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[255px] md:flex-grow-0 md:gap-1 xl:w-[255px] xl:gap-2">
            <select
              className="flex h-full w-[250px] items-center justify-start rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px] px-5 gap-3 border-none text-[14px]"
              name="ground"
              id="ground"
              value={selectedGround}
              onChange={handleGroundChange}
            >
              {dataGrounds && dataGrounds.length > 0 ? (
                dataGrounds.map((ground) => (
                  <option key={ground.id} value={ground.id}>
                    {ground.name}
                  </option>
                ))
              ) : (
                <option value="">No hay datos</option>
              )}
            </select>
          </div>
        )}

        <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[395px] md:flex-grow-0 md:gap-1 xl:w-[395px] xl:gap-2">
          <div className="flex h-full items-center justify-start rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px] leading-3 px-5 gap-3">
            👋
            <div className="flex flex-col">
              <p className="font-dm text-xs font-medium text-gray-600">
                Bienvenido
              </p>
              <h4 className="text-l font-bold text-navy-700 dark:text-white">
                {userData
                  ? userData.nombre + " " + userData.apellido
                  : "No identificado"}
              </h4>
            </div>
          </div>

          <span className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden">
            <WeatherMini />
          </span>

          <span
            className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
            onClick={onOpenSidenav}
          >
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="21" y1="10" x2="3" y2="10"></line>
              <line x1="21" y1="6" x2="3" y2="6"></line>
              <line x1="21" y1="14" x2="3" y2="14"></line>
              <line x1="21" y1="18" x2="3" y2="18"></line>
            </svg>
          </span>
          <div
            className="cursor-pointer text-gray-600"
            /*onClick={() => {
            if (darkmode) {
              document.body.classList.remove("dark");
              setDarkmode(false);
            } else {
              document.body.classList.add("dark");
              setDarkmode(true);
            }
          }}*/
            onClick={toggleDarkMode}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              className="h-4 w-4 text-gray-600 dark:text-white"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11.3807 2.01904C9.91573 3.38786 9 5.33708 9 7.50018C9 11.6423 12.3579 15.0002 16.5 15.0002C18.6631 15.0002 20.6123 14.0844 21.9811 12.6195C21.6613 17.8539 17.3149 22.0002 12 22.0002C6.47715 22.0002 2 17.523 2 12.0002C2 6.68532 6.14629 2.33888 11.3807 2.01904Z"></path>
            </svg>
          </div>
          <div className="relative flex">
            <div className="flex">
              <div className="flex items-center justify-center w-10 h-10 bg-lightPrimary rounded-full shadow-xl shadow-shadow-500 dark:bg-navy-900 dark:text-white">
                {getInitials(
                  userData
                    ? userData.nombre + " " + userData.apellido
                    : "Agrisoft Software"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
