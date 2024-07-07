import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { primaryMenu } from "@/app/data/dataMenu";
import { menu } from "@/app/api/LoginApi";
import {
  ChevronDownIcon,
  Cog8ToothIcon,
  HomeModernIcon,
  TableCellsIcon,
  UserGroupIcon,
  DocumentChartBarIcon
} from "@heroicons/react/24/outline";

const iconMap = {
  ChevronDownIcon,
  Cog8ToothIcon,
  HomeModernIcon,
  TableCellsIcon,
  UserGroupIcon,
  DocumentChartBarIcon
};

const SidebarMenu = ({ pathname }) => {
  const [subItemsVisible, setSubItemsVisible] = useState(null);
  const [grandSonItemsVisible, setGrandSonItemsVisible] = useState(null);
  const [menuData, setMenuData] = useState([]);

  const isCurrentPage = (url) => {
    const currentUrl = pathname;
    return (
      currentUrl === url ||
      (currentUrl.startsWith(url + "/") &&
        currentUrl.split("/").length === url.split("/").length + 1)
    );
  };

  const toggleSubItemsVisibility = (itemId) => {
    setSubItemsVisible(itemId === subItemsVisible ? null : itemId);
  };

  const toggleGrandSonItemsVisibility = (itemId) => {
    setGrandSonItemsVisible(itemId === grandSonItemsVisible ? null : itemId);
  };

  const userDataString = sessionStorage.getItem("userData");
  const userData = JSON.parse(userDataString);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const menuData = await menu(userData.rol);
        setMenuData(menuData);
      } catch (error) {
        console.log("Error al obtener los datos del menú:", error);
      }
    };

    if (userData.userId) {
      fetchData();
    }
  }, [userData.userId]);

  //console.log(menuData);

  return (
    <>
      {menuData.map((menuItem) => {
        const IconComponent = iconMap[menuItem.icon];

        return (
          <li
            key={menuItem.id}
            className={`relative mb-3 px-8 ${
              subItemsVisible === menuItem.id
                ? "show_submenu"
                : "hidden_submenu"
            }`}
          >
            {menuItem.children ? (
              <>
                <button
                  onClick={() => toggleSubItemsVisibility(menuItem.id)}
                  className={`flex cursor-pointer items-center w-full pb-2 px-8 ${
                    isCurrentPage(menuItem.url) ? "active " : "no-active"
                  }`}
                >
                  <span
                    className={`font-medium text-gray-600 ${
                      subItemsVisible === menuItem.id &&
                      "text-navy-700 dark:text-white"
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </span>
                  <p
                    className={`leading-1 flex justify-between items-center ms-4 font-medium text-gray-600 w-full text-sm text-left hover:text-navy-700 ${
                      isCurrentPage(menuItem.url) && "text-navy-700"
                    } ${
                      subItemsVisible === menuItem.id &&
                      "text-navy-700 dark:text-white"
                    }`}
                  >
                    {menuItem.name}{" "}
                    <ChevronDownIcon
                      className={`w-4 h-4 ml-1 ${
                        subItemsVisible === menuItem.id &&
                        "text-navy-700 dark:text-white"
                      }`}
                    />
                  </p>
                  {isCurrentPage(menuItem.url) && (
                    <div className="absolute top-px h-9 w-1 rounded-lg bg-brand-500 end-0 dark:bg-brand-400"></div>
                  )}
                </button>

                {subItemsVisible === menuItem.id && menuItem.children && (
                  <ul className="px-1 rounded-[8px] bg-lightPrimary bg-clip-border shadow-3xl shadow-shadow-500 dark:bg-navy-900 dark:text-white dark:shadow-none items-center p-5">
                    {menuItem.children.map((subItem) => (
                      <li
                        key={subItem.id}
                        className={`mb-1 leading-8  ${
                          grandSonItemsVisible === subItem.id
                            ? "show_submenu"
                            : "hidden_submenu"
                        }`}
                      >
                        {subItem.children ? (
                          <>
                            <button
                              onClick={() =>
                                toggleGrandSonItemsVisibility(subItem.id)
                              }
                              className="flex cursor-pointer items-center w-full pb-2 px-8"
                            >
                              <p
                                className={`leading-1 flex justify-between items-center font-medium text-gray-600 w-full text-sm text-left hover:text-navy-700 ${
                                  grandSonItemsVisible === subItem.id &&
                                  "text-navy-700 dark:text-white"
                                }`}
                              >
                                {subItem.name}{" "}
                                <ChevronDownIcon className="w-4 h-4 ml-1" />
                              </p>
                            </button>

                            {grandSonItemsVisible === subItem.id &&
                              subItem.children && (
                                <ul className="px-10 rounded-[8px] bg-lightPrimary bg-clip-border dark:bg-navy-900 dark:text-white dark:shadow-none items-center ">
                                  {subItem.children.map((grandSonItem) => (
                                    <li
                                      key={grandSonItem.id}
                                      className="mb-1 leading-8"
                                    >
                                      <Link
                                        href={grandSonItem.url}
                                        className={`text-sm text-gray-700 hover:text-navy-700 dark:hover:text-white ${
                                          isCurrentPage(grandSonItem.url)
                                            ? "font-semibold text-navy-700 dark:text-white"
                                            : ""
                                        }`}
                                      >
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
                          <Link
                            href={subItem.url}
                            className={`flex cursor-pointer items-center w-full pb-2 px-8 text-sm text-left font-medium text-gray-600 hover:text-navy-700 ${
                              isCurrentPage(subItem.url)
                                ? "font-semibold text-navy-700 dark:text-white"
                                : ""
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <Link
                href={menuItem.url}
                className={`flex hover:cursor-pointer items-center px-8 ${
                  isCurrentPage(menuItem.url) ? "active " : "no-active"
                }`}
              >
                <span
                  className={`font-medium text-gray-600 ${
                    isCurrentPage(menuItem.url) && "text-navy-700"
                  }`}
                >
                  <IconComponent className="w-6 h-6" />
                </span>
                <p
                  className={`leading-1 flex ms-4 font-medium text-gray-600 text-sm text-left hover:text-navy-700 ${
                    isCurrentPage(menuItem.url) && "text-navy-700"
                  }`}
                >
                  {menuItem.name}
                </p>
                {isCurrentPage(menuItem.url) && (
                  <div className="absolute top-px h-9 w-1 rounded-lg bg-brand-500 end-0 dark:bg-brand-400"></div>
                )}
              </Link>
            )}
          </li>
        );
      })}
    </>
  );
};

export default SidebarMenu;
