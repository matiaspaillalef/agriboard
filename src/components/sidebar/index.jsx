"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HiX } from "react-icons/hi";
import Image from "next/image";
import Link from "next/link";
import Weather from "../weather/Weather";
import "@/assets/css/Sidebar.css";
import { primaryMenu } from "@/app/data/dataMenu";
import {
  ChevronDownIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import CustomImage from "@/components/customImage/CustomImage";

const Sidebar = ({ open, onClose }) => {
  const [subItemsVisible, setSubItemsVisible] = useState(null);
  const [grandSonItemsVisible, setGrandSonItemsVisible] = useState(null);

  const pathname = usePathname();
  const router = useRouter();

  const isCurrentPage = (url) => {
    const currentUrl = pathname;
    return currentUrl === url || currentUrl.startsWith(url + '/') && currentUrl.split('/').length === url.split('/').length + 1;

  };

  const toggleSubItemsVisibility = (itemId) => {
    setSubItemsVisible(itemId === subItemsVisible ? null : itemId);
  };

  const toggleGrandSonItemsVisibility = (itemId) => {
    setGrandSonItemsVisible(itemId === grandSonItemsVisible ? null : itemId);
  };

  function handleLogout() {
    sessionStorage.removeItem("isLoggedIn");
    router.push("/");
  }

  return (
    <div className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 min-w-[300px] ${open ? "translate-x-0" : "-translate-x-96"}`}>
      <span className="absolute top-4 right-4 block cursor-pointer xl:hidden" onClick={onClose}>
        <HiX />
      </span>

      <CustomImage />

      <div className="scrolling h-[600px] overflow-y-scroll mt-[50px] border-t border-bg-lightPrimary">
        <div className="px-8 py-8">
          <div className="!z-5 relative flex rounded-[8px] bg-lightPrimary bg-clip-border shadow-3xl shadow-shadow-500 dark:bg-navy-900 dark:text-white dark:shadow-none !flex-row flex-grow items-center p-5">
            <Weather />
          </div>
        </div>

        <ul className="mb-auto pt-1">
          {primaryMenu.map((menuItem) => (
            <li key={menuItem.id} className={`relative mb-3 px-8 ${subItemsVisible === menuItem.id ? "show_submenu" : "hidden_submenu"} `}>
              {menuItem.children ? (
                <>
                  <button onClick={() => toggleSubItemsVisibility(menuItem.id)} className={`flex cursor-pointer items-center w-full pb-2 px-8 ${isCurrentPage(menuItem.url) ? "active " : "no-active"}`}>
                    <span className={`font-medium text-gray-600 ${subItemsVisible === menuItem.id && "text-navy-700 dark:text-white"}`}>
                      <menuItem.icon className="w-6 h-6" />
                    </span>
                    <p className={`leading-1 flex justify-between items-center ms-4 font-medium text-gray-600 w-full text-sm text-left hover:text-navy-700 ${isCurrentPage(menuItem.url) && "text-navy-700"} ${subItemsVisible === menuItem.id && "text-navy-700 dark:text-white"}`}>
                      {menuItem.name} <ChevronDownIcon className={`w-4 h-4 ml-1 ${subItemsVisible === menuItem.id && "text-navy-700 dark:text-white"}`} />
                    </p>
                    {isCurrentPage(menuItem.url) && (
                    <div className="absolute top-px h-9 w-1 rounded-lg bg-brand-500 end-0 dark:bg-brand-400"></div>
                  )}
                  </button>

                  {subItemsVisible === menuItem.id && menuItem.children && (
                    <ul className="px-1 rounded-[8px] bg-lightPrimary bg-clip-border shadow-3xl shadow-shadow-500 dark:bg-navy-900 dark:text-white dark:shadow-none items-center p-5">
                      {menuItem.children.map((subItem) => (
                        <li key={subItem.id} className={`mb-1 leading-8  ${grandSonItemsVisible === subItem.id ? "show_submenu" : "hidden_submenu"} `}>
                          {subItem.children ? (
                            <>
                              <button onClick={() => toggleGrandSonItemsVisibility(subItem.id)} className="flex cursor-pointer items-center w-full pb-2 px-8">
                                <p className={`leading-1 flex justify-between items-center font-medium text-gray-600 w-full text-sm text-left hover:text-navy-700 ${grandSonItemsVisible === subItem.id && "text-navy-700 dark:text-white"}`}>
                                  {subItem.name} <ChevronDownIcon className="w-4 h-4 ml-1" />
                                </p>
                              </button>

                              {grandSonItemsVisible === subItem.id && subItem.children && (
                                <ul className="px-10 rounded-[8px] bg-lightPrimary bg-clip-border dark:bg-navy-900 dark:text-white dark:shadow-none items-center ">
                                  {subItem.children.map((grandSonItem) => (
                                    <li key={grandSonItem.id} className="mb-1 leading-8">
                                      <Link href={grandSonItem.url} className={`text-sm text-gray-700 hover:text-navy-700 dark:hover:text-white ${isCurrentPage(grandSonItem.url) ? "font-semibold text-navy-700 dark:text-white" : ""}`}>
                                        {grandSonItem.name}
                                      </Link>
                                      {isCurrentPage(grandSonItem.url) && (
                                        <div className="absolute top-px h-9 w-1 rounded-lg bg-brand-500 end-0 dark:bg-brand-400"></div>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </>
                          ) : (
                            <Link href={subItem.url} className={`flex cursor-pointer items-center w-full pb-2 px-8 text-sm text-left font-medium text-gray-600 hover:text-navy-700 ${isCurrentPage(subItem.url) ? "font-semibold text-navy-700 dark:text-white" : ""}`}>
                              {subItem.name}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link href={menuItem.url} className={`flex hover:cursor-pointer items-center px-8 ${isCurrentPage(menuItem.url) ? "active " : "no-active"}`}>
                  <span className={`font-medium text-gray-600 ${isCurrentPage(menuItem.url) && "text-navy-700"}`}>
                    <menuItem.icon className="w-6 h-6" />
                  </span>
                  <p className={`leading-1 flex ms-4 font-medium text-gray-600 text-sm text-left hover:text-navy-700 ${isCurrentPage(menuItem.url) && "text-navy-700"}`}>
                    {menuItem.name}
                  </p>
                  {isCurrentPage(menuItem.url) && (
                    <div className="absolute top-px h-9 w-1 rounded-lg bg-brand-500 end-0 dark:bg-brand-400"></div>
                  )}
                </Link>
              )}
            </li>
          ))}

          <li className="relative mb-3 px-8">
            <button onClick={handleLogout} className="flex cursor-pointer items-center w-full pb-2 px-8">
              <ArrowLeftStartOnRectangleIcon className="w-6 h-6 font-medium text-gray-600" />
              <p className="leading-1 flex justify-between items-center ms-4 font-medium text-gray-600 w-full text-sm text-left">
                Cerrar Sesión
              </p>
            </button>
          </li>
        </ul>
      </div>
      <p className="px-8 py-8 text-xs mb-0">&copy; {new Date().getFullYear()} Agrisoft Software</p>
    </div>
  );
};

export default Sidebar;
