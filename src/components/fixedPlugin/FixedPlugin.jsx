import React, { useState, useEffect } from "react";
import { RiMoonFill, RiSunFill } from "react-icons/ri";

export default function FixedPlugin(props) {
  const { ...rest } = props;
  const [darkmode, setDarkmode] = useState(false);

  useEffect(() => {
    // Verificar si el body tiene la clase "dark" al cargar el componente
    setDarkmode(document.body.classList.contains("dark"));
  }, []); // El segundo parámetro [] asegura que este efecto solo se ejecute una vez después del montaje inicial

  const handleDarkModeToggle = () => {
    if (darkmode) {
      document.body.classList.remove("dark");
      setDarkmode(false);
      sessionStorage.setItem("darkmode", JSON.stringify(false));
    } else {
      document.body.classList.add("dark");
      setDarkmode(true);
      sessionStorage.setItem("darkmode", JSON.stringify(true));
    }
  };

  return (
    <button
      className="border-px fixed bottom-[30px] right-[35px] !z-[99] flex h-[60px] w-[60px] items-center justify-center rounded-full border-[#6a53ff] bg-gradient-to-br from-brandLinear to-blueSecondary p-0"
      onClick={handleDarkModeToggle}
      {...rest}
    >
      <div className="cursor-pointer text-gray-600">
        {darkmode ? (
          <RiSunFill className="h-4 w-4 text-white" />
        ) : (
          <RiMoonFill className="h-4 w-4 text-white" />
        )}
      </div>
    </button>
  );
}
