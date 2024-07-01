import CardTableShifts from "@/components/card/CardShifts";
import { getDataShifts } from "@/app/api/ConfiguracionApi";

const PeopleManagementShifts = async () => {
  
    const dataShifts = await getDataShifts();
    //console.log(dataShifts);
  
    return (
      <>
        <div className="flex w-full flex-col gap-5 mt-3">
          <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-1">
            <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
              <CardTableShifts
                data={dataShifts}
                thead="ID, Nombre, Estado, Horarios"
                omitirColumns={["monday_opening_time", "monday_closing_time", "tuesday_opening_time", "tuesday_closing_time", "wednesday_opening_time", "wednesday_closing_time", "thursday_opening_time", "thursday_closing_time", "friday_opening_time", "friday_closing_time", "saturday_opening_time", "saturday_closing_time", "sunday_opening_time", "sunday_closing_time"]}
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
  
  export default PeopleManagementShifts;