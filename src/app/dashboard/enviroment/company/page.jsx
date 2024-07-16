import CardTableCompany from "@/components/card/CardTableCompany";
import { getDataCompanies } from "@/app/api/ConfiguracionApi";

const EmpresaPage = async () => {

  const dataCompanies = await getDataCompanies();

  return (
    <>
      <div className="flex w-full flex-col gap-5 mt-3">
        <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
          <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
            <CardTableCompany
              data={dataCompanies}
              thead="Empresa, RUT, Región, Ciudad, Teléfono, Caja, RRLL, Teléfono RRLL, Estado"
              downloadBtn={true}
              SearchInput={true}
              omitirColumns={["id", "giro", "logo", "address", "web", "legal_representative_rut", "legal_representative_email" ]}
              actions={true}
            />
          </div>
        </div>
      </div>
    </>
  );

};

export default EmpresaPage;
