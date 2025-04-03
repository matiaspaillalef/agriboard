'use client';

import { QRCodeSVG } from "qrcode.react";
import { useState, useRef, useCallback, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { getDataCorrelative, updateCorrelative } from "@/app/api/ProductionApi";

const CardSelectionQRBach = ({ companyID }) => {
  const [showQR, setShowQR] = useState(false);
  const [correlativeNumber, setCorrelativeNumber] = useState(0);

  const printSectionRef = useRef();

  // Función para asegurarse de que el ID tenga 5 dígitos (completando con ceros a la izquierda si es necesario)
  const formatCompanyID = (id) => {
    if (!id) {
      return '00000';  // Si el companyId está vacío o no se pasa, devolvemos 5 ceros
    }
    return id.toString().padStart(5, '0');
  };

  // Función para generar el año actual (en horario Santiago de Chile)
  const getCurrentYear = () => {
    const date = new Date();
    return date.getFullYear().toString();  // Devuelve el año actual
  };

  // Función para generar el valor correlativo (5 dígitos, comenzando desde 00000)
  const formatCorrelative = (number) => {
    return number.toString().padStart(5, '0');
  };

  // Generar el valor del QR con el formato "companyID + year + correlative"
  const generateQRValue = () => {
    const formattedCompanyID = formatCompanyID(companyID);
    const currentYear = getCurrentYear();
    const formattedCorrelative = formatCorrelative(correlativeNumber);
    //return `${formattedCompanyID}${currentYear}${formattedCorrelative}`;
    return `${formattedCorrelative}`;
  };

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
    documentTitle: "Código QR - Lote",
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
  });


  // Función para incrementar y actualizar el correlativo
  const handleGenerateQR = async () => {
    const newCorrelative = correlativeNumber + 1; // Incrementar el correlativo

    // Actualizar correlativo en la base de datos
    const correlativeUp = await updateCorrelative(companyID, newCorrelative);
    setCorrelativeNumber(correlativeUp.correlative_number); // Establecer el nuevo correlativo

    const correlativeData = await getDataCorrelative(companyID);

    setShowQR(true); // Mostrar el QR generado
  };

  return (
    <div className="card-selection">
      <button
        onClick={handleGenerateQR}
        className="mt-4 w-[170px] rounded-md bg-blueTertiary py-[12px] text-base font-medium text-white transition duration-200 hover:bg-blueQuinary"
      >
        Generar QR
      </button>

      {/* Modal QR */}
      {showQR && (
        <Dialog open={showQR} handler={() => setShowQR(false)}>
          <DialogHeader className="text-center text-2xl font-bold justify-center">
            Código QR Lote
          </DialogHeader>
          <DialogBody className="text-center justify-center">
            <div className="print-container flex justify-center flex-col items-center" ref={printSectionRef}>
              <QRCodeSVG
                value={generateQRValue()}
                size={300}
                level="Q"
                includeMargin={true}
              />
              <p className="text-lg font-semibold tracking-[2px] mt-[-10px]">
                {correlativeNumber}  {/* Aquí se muestra el correlativo actualizado */}
              </p>
            </div>
          </DialogBody>
          <DialogFooter className="flex justify-center items-center">
            <Button
              onClick={printFn}
              className="bg-green-500 text-white"
            >
              Imprimir
            </Button>
            <Button
              onClick={() => { setShowQR(false); }}
              className="bg-red-500 text-white ml-2"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </Dialog>
      )}

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

export default CardSelectionQRBach;
