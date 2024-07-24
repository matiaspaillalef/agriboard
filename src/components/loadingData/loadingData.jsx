import Image from "next/image";
import Logo from "@/assets/img/layout/agrisoft_logo.png";

const LoadingData = () => {
  return (
    <div className="loadingData">
      <Image src={Logo} alt="Logo" width={100} height={100} />
      <p className="text-blueTertiary font-semibold">Cargando...</p>
    </div>
  );
};

export default LoadingData;
