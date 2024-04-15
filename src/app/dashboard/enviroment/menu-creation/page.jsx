import { primaryMenu } from "@/app/data/dataMenu";
//import { List } from "@material-tailwind/react";
import ListDrop from "./components/ListDrop";

const MenuCreation = () => {
  return (
    <>
      <div className="flex w-full flex-col gap-5 mt-3">
        <div className="mt-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
            <form action=" " method="POST">
              <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="flex flex-col gap-3 ">
                  <label
                    htmlFor="menuName"
                    className="text-sm font-semibold text-gray-800 dark:text-white"
                  >
                    Titulo menú
                  </label>
                  <input
                    type="text"
                    name="menuName"
                    id="menuName"
                    className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="menuLink"
                    className="text-sm font-semibold text-gray-800 dark:text-white"
                  >
                    Link menú
                  </label>
                  <input
                    type="text"
                    name="menuLink"
                    id="menuLink"
                    className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                  />
                </div>
              </div>
              <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="menuIcon"
                    className="text-sm font-semibold text-gray-800 dark:text-white"
                  >
                    Icono menú
                  </label>
                  <input
                    type="text"
                    name="menuIcon"
                    id="menuIcon"
                    className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="menuIcon"
                    className="text-sm font-semibold text-gray-800 dark:text-white"
                  >
                    Superior
                  </label>
                  <select
                    name="menuStatus"
                    id="menuStatus"
                    className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                  >
                    <option value="active">Active</option>
                  </select>
                </div>
              </div>
              <div className="mb-3 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="menuRol"
                    className="text-sm font-semibold text-gray-800 dark:text-white"
                  >
                    Rol menú
                  </label>
                  <select
                    name="menuRol"
                    id="menuRol"
                    className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                  >
                    <option value="superadmin">Superadmin</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    className="linear mt-[30px] w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                  >
                    Crear menú
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none w-full p-6">
            <ListDrop />
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuCreation;
