"use client";

import { Inter } from "next/font/google";
import "../globals.css";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import Link from "next/link";
import { withAuth } from "../middleware/middleware";
import { useRouter, usePathname } from "next/navigation";

import { useState, useEffect } from "react";
import { getDataSeasons } from "@/app/api/ProductionApi";

const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [messages, setMessages] = useState([]);

  const pathname = usePathname();

  const getCompanyIdFromSessionStorage = () => {
    const storedCompanyId = sessionStorage.getItem("selectedCompanyId");
    if (storedCompanyId) {
      return storedCompanyId;
    } else{
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      return userData?.idCompany || "";
    }
  };

  const companyId = getCompanyIdFromSessionStorage();

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, [open]);

  useEffect(() => {
    const checkSeasons = async () => {
      try {
        const seasons = await getDataSeasons(companyId);

        if (Array.isArray(seasons)) {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Empezar el día actual a las 00:00:00
          const endOfToday = new Date(today);
          endOfToday.setHours(23, 59, 59, 999); // Fin del día actual a las 23:59:59.999

          const upcomingSeasons = seasons.filter((season) => {
            if (season.status === 1) { // Solo temporadas activas
              const seasonEndDate = new Date(season.date_until);
              const seasonEndDateWithTime = new Date(season.date_until);
              seasonEndDateWithTime.setHours(23, 59, 59, 999); // Asegurarse de que la fecha de fin tiene la hora final del día

              const isClosingToday = seasonEndDateWithTime >= today && seasonEndDateWithTime <= endOfToday;

              return isClosingToday || (seasonEndDateWithTime > endOfToday && seasonEndDateWithTime <= endOfToday.setDate(endOfToday.getDate() + 10)); // Cierre en los próximos 10 días
            }
            return false;
          });

          // Crear mensajes para cada temporada que está por cerrar
          const messages = upcomingSeasons.map((season) => {
            const seasonEndDate = new Date(season.date_until);
            const seasonEndDateWithTime = new Date(season.date_until);
            seasonEndDateWithTime.setHours(23, 59, 59, 999);

            const daysLeft = Math.ceil(
              (seasonEndDateWithTime.getTime() - today.getTime()) /
                (1000 * 3600 * 24)
            );

            return {
              name: season.name,
              endDate: seasonEndDateWithTime,
              daysLeft,
              isClosingToday: seasonEndDateWithTime.toDateString() === today.toDateString(), // Determina si cierra hoy
            };
          });

          setMessages(messages);
        }
      } catch (error) {
        console.error("Error fetching seasons:", error);
      }
    };

    checkSeasons();
  }, [companyId]);

  const path = "/dashboard/production/parameterization-production/season";

  return (
    <div className="flex h-full w-full">
      <div className="sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 translate-x-0">
        <Sidebar open={open} onClose={() => setOpen(false)} />
      </div>
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[350px]`}
        >
          <div className="h-full min-h-dvh">
            <Navbar onOpenSidenav={() => setOpen(true)} />
            {/* Body dashboard */}
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <div className="flex w-full flex-col gap-2 mt-3">
                {messages.length > 0 && (
                  <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-4">
                    <h2 className="font-semibold mb-2">¡Atención!</h2>
                    <ul>
                    {messages.map((message, index) => (
                        <li key={index}>
                          {message.isClosingToday
                            ? `La temporada "${message.name}" cierra hoy a las ${new Date(message.endDate).toLocaleTimeString()} (cierre: ${new Date(message.endDate).toLocaleDateString()}).`
                            : `La temporada "${message.name}" está por cerrar en ${message.daysLeft} ${message.daysLeft === 1 ? "día" : "días"} (cierre: ${new Date(message.endDate).toLocaleDateString()} a las ${new Date(message.endDate).toLocaleTimeString()}).`
                          }
                        </li>
                      ))}

                      {path !== pathname && (
                        <Link href={path} className="underline">
                          Ir a temporadas
                        </Link>
                      )}
                    </ul>
                  </div>
                )}
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default withAuth(RootLayout);
