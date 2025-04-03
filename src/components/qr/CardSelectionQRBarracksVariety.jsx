'use client';

import { useState, useRef, useCallback } from "react";
import Select from "react-select";
import { QRCodeSVG } from "qrcode.react";
import { useReactToPrint } from "react-to-print";  // Importa el hook useReactToPrint
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

const CardSelectionQRBarracksVariety = ({ dataBarracks, dataVarieties }) => {
  const [selectedBarrack, setSelectedBarrack] = useState(null);
  const [selectedVariety, setSelectedVariety] = useState(null);
  const [showQR, setShowQR] = useState(false);

  // Referencia a la sección de impresión
  const printSectionRef = useRef();

  // Función para generar el QR
  const handleGenerateQR = () => {
    if (selectedBarrack && selectedVariety) {
      setShowQR(true);
    } else {
      alert("Seleccione un sector y una variedad antes de generar el QR.");
    }
  };

  // Funciones de impresión personalizadas
  const handleBeforePrint = useCallback(() => {
    //console.log("`onBeforePrint` llamado");
    return Promise.resolve(); // Retorna una promesa
  }, []);

  const handleAfterPrint = useCallback(() => {
    //console.log("`onAfterPrint` llamado");
  }, []);

  // Hook de react-to-print para manejar la impresión
  const printFn = useReactToPrint({
    contentRef: printSectionRef,
    documentTitle: "Código QR - Sector y Variedad",
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
  });

  // Función para asegurarse de que el ID tenga 6 dígitos (completando con ceros a la izquierda si es necesario)
  const formatID = (id) => {
    return id.toString().padStart(6, '0');
  };

  // Generar el valor del QR con el formato sectorid:variedadid (con ceros a la izquierda)
  const generateQRValue = () => {
    const formattedBarrackID = formatID(selectedBarrack.value);
    const formattedVarietyID = formatID(selectedVariety.value);
    return `${formattedBarrackID}:${formattedVarietyID}`;
  };

  return (
    <div className="card-selection">
      <div className="card-selector">
        <div className="flex items-center flex-col gap-5">
          <div className="input-group w-full">
            <label className="text-sm font-semibold text-gray-700 dark:text-white">
              Seleccione un sector
            </label>
            <Select
              options={dataBarracks.map((item) => ({
                value: item.id,
                label: `${item.name}`,
                id: item.id,
              }))}
              onChange={(selectedOption) => setSelectedBarrack(selectedOption)}
              className="h-12 w-full rounded-xl border bg-white/0 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-blueTertiary"
              classNamePrefix="select"
              isClearable={true}
              placeholder="Seleccione un sector"
            />
          </div>
          <div className="input-group w-full">
            <label className="text-sm font-semibold text-gray-700 dark:text-white">
              Seleccione una variedad
            </label>
            <Select
              options={dataVarieties.map((item) => ({
                value: item.id,
                label: `${item.name}`,
                id: item.id,
              }))}
              onChange={(selectedOption) => setSelectedVariety(selectedOption)}
              className="h-12 w-full rounded-xl border bg-white/0 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-blueTertiary"
              classNamePrefix="select"
              isClearable={true}
              placeholder="Seleccione una variedad"
            />
          </div>
        </div>
        <button
          onClick={handleGenerateQR}
          className="mt-4 w-[170px] rounded-md bg-blueTertiary py-[12px] text-base font-medium text-white transition duration-200 hover:bg-blueQuinary"
        >
          Generar QR
        </button>

        {/* Modal QR */}
        {showQR && selectedBarrack && selectedVariety && (
          <Dialog open={showQR} handler={() => setShowQR(false)}>
            <DialogHeader
              className="text-center text-2xl font-bold justify-center"
            >
              Código QR Sector y Variedad
            </DialogHeader>
            <DialogBody className="text-center justify-center">
              <div className="print-container flex justify-center flex-col items-center" ref={printSectionRef}>
                {/* Generamos el QR con el valor sectorid:variedadid */}
                <QRCodeSVG
                  value={generateQRValue()}
                  size={300}
                  level="Q"
                  includeMargin={true}
                />
                <p className="text-lg font-semibold tracking-[5px] mt-[-10px]">
                  {generateQRValue()}
                </p>
              </div>
            </DialogBody>
            <DialogFooter className="flex justify-center items-center">
              {/* Botón para imprimir */}
              <Button
                onClick={printFn}
                className="bg-green-500 text-white"
              >
                Imprimir
              </Button>
              <Button
                onClick={() => setShowQR(false)}
                className="bg-red-500 text-white ml-2"
              >
                Cerrar
              </Button>
            </DialogFooter>
          </Dialog>
        )}
      </div>

      <style jsx>{`
        /* Estilos específicos para la impresión */
        @media print {
          .print-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100%;
            page-break-before: always; /* Para evitar que el contenido se divida */
          }

          /* Centrar todo el contenido en la página */
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }

          .print-section {
            page-break-before: always;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
          }

          .print-container p{
            margin-top: -10px;
          }
        }
      `}</style>
    </div>
  );
};

export default CardSelectionQRBarracksVariety;
