import { formatNumber } from "@/functions/functions";

const MiniCard = ({ name, icon: Icon, data, featured, isLoading }) => {
  const cardClasses = `!z-5 relative rounded-[20px] ${
    featured ? "bg-blueSecondary " : "bg-white dark:bg-navy-800"
  } bg-clip-border shadow-3xl shadow-shadow-500 dark:text-white dark:shadow-none px-5 py-3`;

  return (
    <div className={cardClasses}>
      <h4
        className={`text-lg font-bold ${
          featured ? "text-white" : "text-navy-700"
        } dark:text-white`}
      >
        {name}
      </h4>
      <div className="flex !flex-row flex-grow items-center justify-start">
        <div className="flex h-[70px] w-auto flex-row items-center">
          <div
            className={`rounded-full bg-lightPrimary p-3 ${
              featured ? "" : "dark:bg-navy-700"
            }`}
          >
            <span className="flex items-center text-brand-500 dark:text-white">
              <Icon
                className={`w-6 h-6 ${
                  featured ? "text-navy-700" : "text-navy-700 dark:text-white"
                }`}
              />
            </span>
          </div>
        </div>
        <div className="h-50 ml-4 flex w-auto gap-4 justify-center">
          {isLoading ? (
            <div className="flex gap-5">
              <div
                role="status"
                className="max-w-full animate-pulse flex flex-col gap-1"
              >
                <div
                  className={`h-[10px] w-[50px] dark:bg-gray-200 bg-gray-400 rounded-sm`}
                ></div>
                <div
                  className={`h-[22px] w-[100px] dark:bg-gray-200 bg-gray-400 rounded-sm`}
                ></div>
              </div>
              <div
                role="status"
                className="max-w-full animate-pulse flex flex-col gap-1"
              >
                <div
                  className={`h-[10px] w-[50px] dark:bg-gray-200 bg-gray-400 rounded-sm`}
                ></div>
                <div
                  className={`h-[22px] w-[100px] dark:bg-gray-200 bg-gray-400 rounded-sm`}
                ></div>
              </div>
            </div>
          ) : (
            data.map((item) => (
              <div
                key={item.id}
                className="h-50 ml-4 flex w-auto flex-col justify-center"
              >
                <p className="font-dm text-sm font-medium text-gray-600">
                  {item.name}
                </p>
                <h4
                  className={`text-lg font-bold ${
                    featured ? "text-white" : "text-navy-700"
                  } dark:text-white`}
                >
                  {formatNumber(item.value)}
                </h4>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniCard;
