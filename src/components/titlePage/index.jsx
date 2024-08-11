'use client'

import { usePathname } from "next/navigation";

const TitlePage = () => {

    const path = usePathname();

    const segment = path ? path.split("/").filter(segment => segment.trim() !== "").pop() : '';


    let translatedSegment;

    switch (segment.toLowerCase()) {
        case "dashboard":
            translatedSegment = "Dashboard";
            break;
        case "enviroment":
            translatedSegment = "Configuración";
            break;
        case "company":
            translatedSegment = "Empresa";
            break;
        case "access-control":
            translatedSegment = "Control de acceso";
            break;
        case "geographic-location":
            translatedSegment = "Ubicación geográfica";
            break;
        case "provisional-institutions":
            translatedSegment = "Instituciones previsionales";
            break;
        case "role-creation":
            translatedSegment = "Creación de roles";
            break;
        case "user-creation":
            translatedSegment = "Creación de usuarios";
            break;
        case "menu-creation":
            translatedSegment = "Creación de menú";
            break;
        case "production":
            translatedSegment = "Producción";
            break;
        case "people-management":
            translatedSegment = "Gestión de personas";
            break;
        case "reports":
            translatedSegment = "Reportes";
            break;
        case "positions":
            translatedSegment = "Cargos";
            break;
        case "contractors":
            translatedSegment = "Contratistas";
            break;
        case "groups":
            translatedSegment = "Grupos";
            break;
        case "shifts":
            translatedSegment = "Turnos";
            break;
        case "workers":
            translatedSegment = "Trabajadores";
            break;
        case "squads":
            translatedSegment = "Cuadrillas";
            break;            
        case "ground":
            translatedSegment = "Campos";
            break;
        case "sectors-barracks":
            translatedSegment = "Sectores / Cuarteles";
            break;
        case "varieties":
            translatedSegment = "Variedades";
            break;
        case "species":
            translatedSegment = "Especies";
            break;
        case "sector-attributes":
            translatedSegment = "Atributos de sector";
            break;
        case "season":
            translatedSegment = "Temporada";
            break;
        case "type-collection":
            translatedSegment = "Tipo de recolección";
            break;
        case "scale":
            translatedSegment = "Balanza";
            break;
        case "scale-register":
            translatedSegment = "Registro de balanza";
            break;
        case "harvest-format":
            translatedSegment = "Formato de cosecha";
            break;
        case "deals":
            translatedSegment = "Tratos";
            break;
        default:
            translatedSegment = segment;
            break;
    }

    return (
        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
            <a className="font-bold capitalize hover:text-navy-700 dark:hover:text-white" href="/horizon-tailwind-react/admin/default">
                {translatedSegment}
            </a>
        </p>
    );
};

export default TitlePage;
