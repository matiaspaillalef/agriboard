import { useState } from "react";

import Image from "next/image";
import Avatar from "@/assets/img/avatars/avatar7.png"

import WeatherMini from "../weather/WatherMini";


const Navbar = (props) => {

  const { onOpenSidenav } = props;
  const [darkmode, setDarkmode] = useState(false);

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">

        <div className="h-6 w-[224px] pt-1">
          <a className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white" href=" ">
            Páginas
            <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
              /
            </span></a>

          <a className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white" href="/horizon-tailwind-react/admin/default">Inicio Dashboard</a>
        </div>

        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
          <a className="font-bold capitalize hover:text-navy-700 dark:hover:text-white" href="/horizon-tailwind-react/admin/default">
            Inicio Dashboard
          </a>
        </p>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[395px] md:flex-grow-0 md:gap-1 xl:w-[395px] xl:gap-2">
        <div className="flex h-full items-center justify-start rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px] leading-3 px-5 gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"
            />
          </svg>
          <div className="flex flex-col">
            <p className="font-dm text-xs font-medium text-gray-600">Bienvenido</p>
            <h4 className="text-l font-bold text-navy-700 dark:text-white">Matias Paillalef</h4>
          </div>
        </div>

        <span className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden">
          <WeatherMini />
        </span>

        <span className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden" onClick={onOpenSidenav}>
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
          onClick={() => {
            if (darkmode) {
              document.body.classList.remove("dark");
              setDarkmode(false);
            } else {
              document.body.classList.add("dark");
              setDarkmode(true);
            }
          }}
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
            <Image src={Avatar} alt="Elon Musk" width={40} height={40} className="rounded-full" />
          </div>
          <div className="py-2 top-8 -left-[180px] w-max absolute z-10 origin-top-right transition-all duration-300 ease-in-out scale-0">
            <div className="flex h-48 w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="mt-3 ml-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">👋 Hey, Adela</p>
                </div>
              </div>
              <div className="mt-3 h-px w-full bg-gray-200 dark:bg-white/20 ">
              </div>
              <div className="mt-3 ml-4 flex flex-col">
                <a href=" " className="text-sm text-gray-800 dark:text-white hover:dark:text-white">Profile Settings</a><a href=" " className="mt-3 text-sm text-gray-800 dark:text-white hover:dark:text-white">Newsletter Settings</a><a href=" " className="mt-3 text-sm font-medium text-red-500 hover:text-red-500">Log Out</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
