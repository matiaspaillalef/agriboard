import CardTablePositions from "@/components/card/cardPositions";
import { getDataPositions } from "@/app/api/ConfiguracionApi";

const PeopleManagementPositions = async () => {
  
    const dataPositions = await getDataPositions();
    console.log(dataPositions);
  
    return (
      <>
        <div className="flex w-full flex-col gap-5 mt-3">
          <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
            <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
              <CardTablePositions
                data={dataPositions}
                thead="ID, Nombre cargo, Estado"
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
  
  export default PeopleManagementPositions;