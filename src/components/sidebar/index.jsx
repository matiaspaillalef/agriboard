"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { HiX } from "react-icons/hi";
import Image from "next/image";
import Link from "next/link";

import Weather from "../weather/Weather";
//import styles from "./Sidebar.module.css";
import "@/assets/css/Sidebar.css";

import { primaryMenu } from "@/app/data/dataMenu";

//Icons
import { ChevronDownIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";

// Components
import CustomImage from "@/components/customImage/CustomImage";

const Sidebar = ({ open, onClose }) => {
  const [subItemsVisible, setSubItemsVisible] = useState(null);

  const pathname = usePathname();
  const router = useRouter();

  const isCurrentPage = (url) => {
    return pathname === url;
  };

  const toggleSubItemsVisibility = (itemId) => {
    setSubItemsVisible(itemId === subItemsVisible ? null : itemId);
  };

  function handleLogout() {
    sessionStorage.removeItem('isLoggedIn');
    router.push('/'); 
  }

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

      <div className="px-8">
        <form action="#" method="POST" className="mb-7">
          <label
            htmlFor="grid-camp"
            className="block text-sm font-medium text-gray-700 dark:text-white mb-2"
          >
            Seleccionar campo
          </label>
          <select
            className="block appearance-none w-full bg-gray-200 border dark:bg-navy-900 border-gray-200 dark:border-navy-900 text-gray-700 dark:text-gray-50 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-camp"
          >
            <option>Campo 1</option>
            <option>Campo 2</option>
            <option>Campo 3</option>
          </select>
        </form>
      </div>

      <ul className="mb-auto pt-1">
        {primaryMenu.map((menuItem) => (
          <li
            key={menuItem.id}
            className={`relative mb-3 px-8 ${
              subItemsVisible === menuItem.id
                ? "show_submenu"
                : "hidden_submenu"
            }`}
          >
            {menuItem.children ? (
              <button
                onClick={() => toggleSubItemsVisibility(menuItem.id)}
                className={`flex cursor-pointer items-center w-full pb-2 px-8 `}
              >
                <span className="font-medium text-gray-600">
                  <menuItem.icon className="w-6 h-6" />
                </span>
                <p className="leading-1 flex justify-between items-center ms-4 font-medium text-gray-600 w-full">
                  {menuItem.name} <ChevronDownIcon className="w-5 h-5 ml-1" />
                </p>
              </button>
            ) : (
              <>
                <Link
                  href={menuItem.url}
                  className={`flex hover:cursor-pointer items-center px-8 ${
                    isCurrentPage(menuItem.url) ? "active" : "no-active"
                  }`}
                >
                  <span className="font-medium text-gray-600">
                    <menuItem.icon className="w-6 h-6" />
                  </span>
                  <p className="leading-1 flex ms-4 font-medium text-gray-600">
                    {menuItem.name}
                  </p>
                </Link>

                {isCurrentPage(menuItem.url) && (
                  <div className="absolute top-px h-9 w-1 rounded-lg bg-brand-500 end-0 dark:bg-brand-400"></div>
                )}
              </>
            )}

            {subItemsVisible === menuItem.id && menuItem.children && (
              <ul className="px-8 rounded-[8px] bg-lightPrimary bg-clip-border shadow-3xl shadow-shadow-500 dark:bg-navy-900 dark:text-white dark:shadow-none items-center p-5">
                {menuItem.children.map((subItem) => (
                  <li key={subItem.id} className="mb-1 leading-8">
                    <Link
                      href={subItem.url}
                      className={`text-sm text-gray-700 hover:text-navy-700 dark:hover:text-white ${
                        isCurrentPage(subItem.url)
                          ? "font-semibold text-navy-700 dark:text-white"
                          : ""
                      }`}
                    >
                      {subItem.name}
                    </Link>
                    {isCurrentPage(subItem.url) && (
                      <div className="absolute top-px h-9 w-1 rounded-lg bg-brand-500 end-0 dark:bg-brand-400"></div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
        <li className="relative mb-3 px-8">
          <button
            onClick={handleLogout}
            className="flex cursor-pointer items-center w-full pb-2 px-8 "
          >
            <ArrowLeftStartOnRectangleIcon className="w-6 h-6 font-medium text-gray-600" />
            <p className="leading-1 flex justify-between items-center ms-4 font-medium text-gray-600 w-full">
              Cerrar Sesión
            </p>
          </button>
        </li>
      </ul>
      </div>
      <p className="px-8 py-8 text-xs mb-0">
        &copy; {new Date().getFullYear()} Agrisoft Software
      </p>
    </div>
  );
};

export default Sidebar;
