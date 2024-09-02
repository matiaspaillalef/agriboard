'use client'

import { usePathname } from "next/navigation";

const Breadcrumb = () => {

const path = usePathname();

  const segments = path ? path.split("/").filter(segment => segment.trim() !== "") : [];

  const translatedSegments = segments.map(segment => {
    switch (segment.toLowerCase()) {
        case "dashboard":
          return "Dashboard";
        case "enviroment":
          return "Configuración";
        case "company":
          return "Empresa";
        case "access-control":
          return "Control de acceso";
        case "geographic-location":
          return "Ubicación geográfica";
        case "provisional-institutions":
          return "Instituciones previsionales";
        case "role-creation":
          return "Creación de roles";
        case "user-creation":
          return "Creación de usuarios";
        case "menu-creation":
          return "Creación de menú";
        case "production":
          return "Producción";
        case "people-management":
          return "Gestión de personas";
        case "reports":
          return "Reportes";
        case "positions":
          return "Cargos";
        case "contractors":
          return "Contratistas";
        case "groups":
          return "Grupos";
        case "shifts":
          return "Turnos";
        case "workers":
          return "Trabajadores";
        case "squads":
          return "Cuadrillas";
        case "ground":
          return "Campos";
        case "sectors-barracks":
          return "Sectores y cuarteles";
        case "varieties":
          return "Variedades";
        case "species":
          return "Especies";
        case "sector-attributes":
          return "Atributos de sector";
        case "parameterization-ground":
          return "Parametrización de campo";
          case "parameterization-production":
          return "Parametrización de producción";
        case "season":
          return "Temporada";
        case "type-collection":
          return "Tipo de recolección";
        case "scale":
          return "Balanza";
        case "scale-register":
          return "Registro de balanza";
        case "harvest-format":
          return "Formato de cosecha";
        case "deals":
          return "Tratos";
        case "quality":
          return "Calidad";
        case "manual-upload":
          return "Carga de producción manual";
        case "dispatch-guide":
          return "Guía de despacho";
        case "operations":
          return "Operaciones";
        case "production-report":
          return "Reporte de producción";
        case "regularization-production":
          return "Regularización de producción";
        default:
          return segment;
      }
  });

  return (
    <div className="h-6 lg:w-[555px] pt-1">
      {translatedSegments.map((item, index) => (
        <span key={index} className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white">
          {index !== translatedSegments.length - 1 ? (
            <>
              {item}
              <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">/</span>
            </>
          ) : (
            <span className="font-bold">{item}</span>
          )}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;



