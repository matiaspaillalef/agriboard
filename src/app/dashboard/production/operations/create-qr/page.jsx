"use client";

import { getDataWorkers } from "@/app/api/ManagementPeople";
import { useEffect, useState, useCallback } from "react";
import LoadingData from "@/components/loadingData/loadingData";
import CardSelectionQRWorkers from "@/components/qr/CardSelectionQRWorkers";
import CardSelectionQRBarracksVariety from "@/components/qr/CardSelectionQRBarracksVariety";
import CardSelectionQRBach from "@/components/qr/CardSelectionQRBach";
import { getDataAttributesSector, getDataSectorBarracks, getDataVarieties } from "@/app/api/ProductionApi";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const ProductionProductionReports = () => {
    const [dataWorkers, setDataWorkers] = useState([]);
    const [dataBarracks, setDataBarracks] = useState([]);
    const [dataVarieties, setDataVarieties] = useState([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Función para obtener selectedCompanyId desde sessionStorage o userData
    const getCompanyIdFromSessionStorage = useCallback(() => {
        const storedCompanyId = sessionStorage.getItem("selectedCompanyId");
        if (storedCompanyId) {
            return storedCompanyId;
        } else {
            const userData = JSON.parse(sessionStorage.getItem("userData"));
            return userData?.idCompany || "";
        }
    }, []);

    const fetchData = useCallback(async (companyId) => {
        setIsLoading(true);
        try {
            const data = await getDataWorkers(Number(companyId));
            const dataBarracks = await getDataSectorBarracks(Number(companyId));
            const dataVarieties = await getDataVarieties(Number(companyId));
            setDataWorkers(data);
            setDataBarracks(dataBarracks);
            setDataVarieties(dataVarieties);
        } catch (error) {
            console.error("Error al obtener datos:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const companyId = getCompanyIdFromSessionStorage();
        setSelectedCompanyId(companyId);
        if (companyId) {
            fetchData(companyId);
        }
    }, [getCompanyIdFromSessionStorage, fetchData]);

    useEffect(() => {
        if (!selectedCompanyId) return;

        const observer = new MutationObserver(() => {
            const companyId = getCompanyIdFromSessionStorage();
            if (companyId !== selectedCompanyId) {
                setSelectedCompanyId(companyId);
                fetchData(companyId);
            }
        });

        observer.observe(document.body, {
            attributes: true,
            subtree: true,
            attributeFilter: ["class"],
        });

        return () => {
            observer.disconnect();
        };
    }, [selectedCompanyId, fetchData, getCompanyIdFromSessionStorage]);

    return (
        <div className="flex w-full flex-col gap-5 mt-3">
            <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
                <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 w-full">
                        <div className="content-selection p-5 md:p-5 lg:p-10">
                            <h2 className="text-2xl font-bold mb-6" >QR trabajador</h2>
                            <CardSelectionQRWorkers
                                data={dataWorkers}
                            />
                        </div>
                        <div className="content-selection p-5 md:p-5 lg:p-10">
                            <h2 className="text-2xl font-bold mb-6" >QR Sector / Variedad</h2>
                            <CardSelectionQRBarracksVariety
                                dataBarracks={dataBarracks}
                                dataVarieties={dataVarieties}
                            />
                        </div>
                        <div className="content-selection p-5 md:p-5 lg:p-10">
                            <h2 className="text-2xl font-bold mb-6" >QR Lote</h2>
                            <div className="bg-red-600 p-4 rounded-lg mb-2">
                                <p className="text-sm text-white dark:text-white">
                                    <ExclamationTriangleIcon className="h-5 w-5 inline-block mr-1" />
                                    Al generar un QR para un lote, se asignará un correlativo único que aumentará con cada nuevo QR. Si no se guarda, el correlativo se perderá y deberá generarse otro.                                
                                </p>
                            </div>
                            <CardSelectionQRBach
                                companyID={selectedCompanyId}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductionProductionReports;
