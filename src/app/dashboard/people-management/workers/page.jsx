import CardTableWorkers from "@/components/card/CardTableWorkers";
import { getDataWorkers } from "@/app/api/ConfiguracionApi";

const PeopleManagementWorkers = async () => {
  
    const dataWorkers = await getDataWorkers();
    console.log(dataWorkers);
  
    return (
      <>
        <div className="flex w-full flex-col gap-5 mt-3">
          <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
            <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
              <CardTableWorkers
                data={dataWorkers}
                thead="RUT, Nombre, Apellido, Región, Ciudad, Teléfono, Estado"
                omitirColumns={["id", "lastname2", "born_date", "gender", "state_civil", "address", "phone_company", "date_admission"]}
                downloadBtn={true}
                SearchInput={true}
                actions={true}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
  
  export default PeopleManagementWorkers;