"use client";

import { useEffect, useState } from "react";
import CardTableProductionReports from "@/components/card/CardTableProductionReports";

const ProductionProductionReports = () => {
    const [companyId, setCompanyId] = useState("");

    useEffect(() => {
        const getCompanyIdFromSessionStorage = () => {
            const storedCompanyId = sessionStorage.getItem("selectedCompanyId");
            if (storedCompanyId) {
                return storedCompanyId;
            } else {
                const userData = JSON.parse(sessionStorage.getItem("userData"));
                return userData?.idCompany || "";
            }
        };

        const companyIdFromSessionStorage = getCompanyIdFromSessionStorage();
        setCompanyId(companyIdFromSessionStorage);
    }, []);

    return (
        <div className="flex w-full flex-col gap-5 mt-3">
            <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
                <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
                    <CardTableProductionReports
                        data="[]"
                        thead=""
                        downloadBtn={true}
                        SearchInput={true}
                        actions={false}
                        companyID={companyId}
                        omitirColumns={["id", "company_id", "sync", "sync_date", "turns", "temp", "wet", "harvest_date", "date_register", "contractor", "source", 'zone', 'hilera']}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductionProductionReports;
