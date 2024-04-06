'use client'

import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {

  const [open, setOpen] = useState(true);
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, [open]);


  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-full w-full">
          <div className="sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 translate-x-0">
            <Sidebar open={open} onClose={() => setOpen(false)} />
          </div>
          <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
            <main className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[333px]`}>
              <div className="h-full min-h-dvh">
                <Navbar onOpenSidenav={() => setOpen(true)} />
                {/* Body dashboard */}
                <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
                  <div className="flex w-full flex-col gap-5 mt-3">
                    {children}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
