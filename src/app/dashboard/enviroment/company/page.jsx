import CardTableCompany from "@/components/card/CardTableCompany";
import { getDataCompanies } from "@/app/api/ConfiguracionApi";

const EmpresaPage = async () => {

  const dataCompaniesfetch  = await getDataCompanies();
  var dataCompanies;
  
  if(dataCompaniesfetch.code === 'OK'){

    dataCompanies =  dataCompaniesfetch.companies;

  }

  return (
    <>
      <div className="flex w-full flex-col gap-5 mt-3">
        <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
          <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
            <CardTableCompany
              data={dataCompanies}
              thead="Empresa, RUT, Región, Ciudad, Teléfono, RRLL, Estado"
              downloadBtn={true}
              SearchInput={true}
              omitirColumns={["id", "giro", "logo", "address", "web", "legal_representative_rut", "legal_representative_email", "compensation_box", "legal_representative_phone","system_representative_name","system_representative_rut","system_representative_phone","system_representative_email" ]}
              actions={true}
            />
          </div>
        </div>
      </div>
    </>
  );

};

export default EmpresaPage;
