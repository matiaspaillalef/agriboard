"use client";

import { useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

import CardTableCompany from "@/components/card/CardTableCompany";
import CardTableRLegal from "../../../../components/card/cardTableRLegal";
import { StateCL } from "@/app/data/dataStates";

import { DataCompany } from "@/app/data/dataCompany";
import { DataRLegal } from "@/app/data/dataRLegal";
import Rut from "@/components/validateRUT";

const EmpresaPage = () => {
  const [openCompanyModal, setOpenCompanyModal] = useState(false);
  const [openRepresentanteModal, setOpenRepresentanteModal] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState("XV"); //Asignamos una región por defecto para que ciudad no aparezca vacio
  const [selectedCity, setSelectedCity] = useState("");

  const [rut, setRut] = useState("");
  const [rutValido, setRutValido] = useState(false);

  const handleOpenCompanyModal = () => setOpenCompanyModal(!openCompanyModal);
  const handleOpenRepresentanteModal = () =>
    setOpenRepresentanteModal(!openRepresentanteModal);

  const handleRegionChange = (event) => {
    const region = event.target.value;
    setSelectedRegion(region);

    // Buscar la región seleccionada en los datos de StateCL
    const selectedRegionData = StateCL.find(
      (state) => state.region_number === region
    );

    // Actualizar las comunas correspondientes a la región seleccionada
    if (selectedRegionData) {
      const { comunas } = selectedRegionData;
      // Establecer la primera comuna como la seleccionada por defecto
      if (comunas && comunas.length > 0) {
        setSelectedCity(comunas[0].name);
      }
    }
  };

  const tabsHeader = [
    {
      label: "Datos Empresa",
      value: "empresa",
    },
    {
      label: "Representante legal",
      value: "representante",
    },
  ];

  return (
    <>
      <div className="flex w-full flex-col gap-5 mt-3">
        <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
          <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
            <Tabs value="empresa">
              <TabsHeader
                className="h-[50px]"
                indicatorProps={{
                  className:
                    "bg-lightPrimary text-white h-[50px] flex items-center justify-center rounded-[60px] dark:bg-navy-900 dark:text-white",
                }}
              >
                {tabsHeader.map(({ label, value }) => (
                  <Tab
                    key={value}
                    value={value}
                    activeClassName="active"
                    className="text-lg font-semibold h-[50px]"
                  >
                    {label}
                  </Tab>
                ))}
              </TabsHeader>
              <TabsBody>
                <TabPanel key="empresa" value="empresa">
                  <Button
                    onClick={handleOpenCompanyModal}
                    variant="gradient"
                    className="max-w-[300px] linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 items-center justify-center flex gap-2 normal-case mb-5"
                  >
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
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    Crear nueva empresa
                  </Button>
                  <Dialog
                    open={openCompanyModal}
                    handler={handleOpenCompanyModal}
                    size="md"
                    className="p-5 lg:max-w-[25%]"
                  >
                    <button
                      type="button"
                      onClick={handleOpenCompanyModal}
                      className="absolute right-[15px] top-[15px] flex items-center justify-center w-10 h-10 bg-lightPrimary dark:bg-navy-900 rounded-md"
                    >
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
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>

                    <DialogHeader>Crea un nueva empresa</DialogHeader>
                    <DialogBody>
                      <form action=" " method="POST">
                        <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
                          <div className="flex flex-col gap-3 ">
                            <label
                              htmlFor="logo"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Logo
                            </label>
                            <input
                              type="file"
                              name="logo"
                              id="logo"
                              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            />
                          </div>
                        </div>
                        <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
                          <div className="flex flex-col gap-3 ">
                            <label
                              htmlFor="rut"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Rut
                            </label>

                            <Rut
                              value={rut}
                              onChange={(e) => setRut(e.target.value)}
                              onValid={setRutValido}
                            >
                              <input
                                type="text"
                                name="rut"
                                id="rut"
                                className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                              />
                            </Rut>
                            {!rutValido && (
                              <span className="text-red-500 text-xs">
                                El rut es inválido
                              </span>
                            )}
                          </div>

                          <div className="flex flex-col gap-3 ">
                            <label
                              htmlFor="razon_social"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Razón social
                            </label>
                            <input
                              type="text"
                              name="razon_social"
                              id="razon_social"
                              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            />
                          </div>
                        </div>
                        <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
                          <div className="flex flex-col gap-3 ">
                            <label
                              htmlFor="giro"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Giro
                            </label>
                            <input
                              type="text"
                              name="giro"
                              id="giro"
                              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            />
                          </div>

                          <div className="flex flex-col gap-3 ">
                            <label
                              htmlFor="address"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Dirección
                            </label>
                            <input
                              type="text"
                              name="address"
                              id="address"
                              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            />
                          </div>
                        </div>
                        <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
                          <div className="flex flex-col gap-3 ">
                            <label
                              htmlFor="region"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Región
                            </label>
                            <select
                              name="region"
                              id="region"
                              value={selectedRegion}
                              onChange={handleRegionChange}
                              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            >
                              {StateCL.map((state) => (
                                <option
                                  key={state.region_number}
                                  value={state.region_number}
                                >
                                  {state.region}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex flex-col gap-3 ">
                            <label
                              htmlFor="ciudad"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Ciudad
                            </label>
                            <select
                              name="ciudad"
                              id="ciudad"
                              value={selectedCity}
                              onChange={(event) =>
                                setSelectedCity(event.target.value)
                              }
                              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            >
                              {selectedRegion &&
                                StateCL.find(
                                  (state) =>
                                    state.region_number === selectedRegion
                                )?.comunas.map((comuna) => (
                                  <option key={comuna.name} value={comuna.name}>
                                    {comuna.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>

                        <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
                          <div className="flex flex-col gap-3 ">
                            <label
                              htmlFor="phone"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Telefóno
                            </label>
                            <input
                              type="text"
                              name="phone"
                              id="phone"
                              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            />
                          </div>
                          <div className="flex flex-col gap-3 ">
                            <label
                              htmlFor="web"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Web
                            </label>
                            <input
                              type="url"
                              name="web"
                              id="web"
                              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
                          <div className="flex flex-col gap-3 ">
                            <label
                              htmlFor="caja"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Caja
                            </label>
                            <select className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white">
                              <option value="Los Andes">Los Andes</option>
                              <option value="La araucana">La Araucana</option>
                              <option value="Los Héroes">Los Héroes</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-3 ">
                            <label
                              htmlFor="estado"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Estado
                            </label>
                            <select className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white">
                              <option value="1">Activo</option>
                              <option value="0">Inactivo</option>
                            </select>
                          </div>
                        </div>
                        <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
                          <div className="flex flex-col gap-3">
                            <button
                              type="submit"
                              className="linear mt-[30px] w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                              onClick={handleOpenCompanyModal} // Aquí va la función que envía los datos al backend para crear el usuario y cerrar el modal
                            >
                              Crear nueva empresa
                            </button>
                          </div>
                        </div>
                      </form>
                    </DialogBody>
                  </Dialog>

                  <CardTableCompany
                    data={DataCompany}
                    thead="Logo, Rut, R. Social, Giro, Dirección, Región, Ciudad, Telefóno, Web, Caja, Estado"
                    actions={true}
                    omitirColumns={["id"]}
                    SearchInput={true}
                    downloadBtn={true}
                    orientation={"landscape"} // Cambiar a portrait si es necesario, pero esto da la orientación de la hoja de descarga
                  />
                </TabPanel>
                <TabPanel key="representante" value="representante">
                  <Button
                    onClick={handleOpenRepresentanteModal}
                    variant="gradient"
                    className="max-w-[300px] linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 items-center justify-center flex gap-2 normal-case mb-5"
                  >
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
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    Crear representante legal
                  </Button>
                  <Dialog
                    open={openRepresentanteModal}
                    handler={handleOpenRepresentanteModal}
                    size="xs"
                    className="p-5 lg:max-w-[25%]"
                  >
                    <button
                      type="button"
                      onClick={handleOpenRepresentanteModal}
                      className="absolute right-[15px] top-[15px] flex items-center justify-center w-10 h-10 bg-lightPrimary dark:bg-navy-900 rounded-md"
                    >
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
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>

                    <DialogHeader>Crea un reprentante legal</DialogHeader>
                    <DialogBody>
                      <form action=" " method="POST">
                        <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
                          <div className="flex flex-col gap-3 ">
                            <label
                              htmlFor="name"
                              className="text-sm font-semibold text-gray-800 dark:text-white"
                            >
                              Nombre
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
                          <div className="flex flex-col gap-3">
                            <button
                              type="submit"
                              className="linear mt-[30px] w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                              onClick={handleOpenRepresentanteModal} // Aquí va la función que envía los datos al backend para crear el usuario y cerrar el modal
                            >
                              Crear representante legal
                            </button>
                          </div>
                        </div>
                      </form>
                    </DialogBody>
                  </Dialog>
                  <CardTableRLegal
                    data={DataRLegal}
                    thead="Rut, Nombre, Email, Telefóno, Estado"
                    actions={true}
                    omitirColumns={["id"]}
                    SearchInpunt={true}
                    downloadBtn={true}
                  />
                </TabPanel>
              </TabsBody>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmpresaPage;
