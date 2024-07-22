import CardTableGround from "@/components/card/CardTableGround";
import { getDataCompanies } from "@/app/api/ConfiguracionApi";

const GroundPage = async () => {

  const dataCompanies = await getDataCompanies();

  return (
    <>
      <div className="flex w-full flex-col gap-5 mt-3">
        <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
          <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
            <CardTableGround
              data={dataCompanies}
              thead="Nombre, Región, Ciudad, Zona, Empresa, Estado"
              downloadBtn={true}
              SearchInput={true}
              omitirColumns={["id", "address"]}
              actions={true}
            />
          </div>
        </div>
      </div>
    </>
  );

};

export default GroundPage;
