import React, { useEffect, useState } from 'react';

const ExportarExcelLib = ({ initialData, fetchedData }) => {
  const handleExport = () => {
    generateExcel(initialData, fetchedData);
  };

  return (
    <button onClick={handleExport}>Exportar a Excel</button>
  );
};

export default ExportarExcelLib;