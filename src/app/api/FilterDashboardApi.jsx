import jwt from "jsonwebtoken";
import { date } from "zod";

const URLAPI = process.env.NEXT_PUBLIC_API_URL;
const APIKEY = process.env.NEXT_PUBLIC_JWT_SECRET;

const token = jwt.sign({ uid: "agrisoft" }, APIKEY, {
  expiresIn: 30000,
});

export const getDataKgDay = async (company_id, ground) => {
  try {
    const res = await fetch(
      URLAPI + `/api/v1/filter/dashboard/dataKgDay/${company_id}/${ground}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        cache: "no-store",
      }
    );

    if (res.ok) {
      const data = await res.json();

      if (data.code === "OK") {
        return data.data;
      } else if (data.code === "ERROR") {
        return data.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

export const getDataKgDayQlty = async (company_id, ground, quality) => {
  const setQuality = quality && quality === "" ? "" : 1;
  try {
    const res = await fetch(
      URLAPI +
        `/api/v1/filter/dashboard/dataKgDayQlty/${company_id}/${ground}/${setQuality}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        cache: "no-store",
      }
    );

    if (res.ok) {
      const data = await res.json();

      if (data.code === "OK") {
        return data.data;
      } else if (data.code === "ERROR") {
        return data.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

export const getDataKgSeason = async (company_id, ground) => {
    try {
      const res = await fetch(
        `${URLAPI}/api/v1/filter/dashboard/dataKgSeason/${company_id}/${ground}`,
        {
          method: "POST", // Asegúrate de que el método coincide con tu endpoint
          headers: {
            "Content-Type": "application/json",
            "x-api-key": token,
          },
          cache: "no-store",
        }
      );
  
      if (res.ok) {
        const data = await res.json();
  
        if (data.code === "OK") {
          return data.data;
        } else if (data.code === "ERROR") {
          console.error(data.mensaje); // Muestra el mensaje de error
          return {}; // Devuelve un objeto vacío en caso de error
        }
      } else {
        console.error("Network response was not ok:", res.statusText); // Mensaje de error si la respuesta no es correcta
        return {}; // Devuelve un objeto vacío en caso de error de red
      }
    } catch (err) {
      console.error("Error en fetch:", err);
      return {}; // Devuelve un objeto vacío en caso de excepción
    }
  };
  

  export const getDataKgSeasonQlty = async (company_id, ground, quality) => {
    const setQuality = quality && quality === "" ? "" : 1;
    try {
      const res = await fetch(
        `${URLAPI}/api/v1/filter/dashboard/dataKgSeasonQlty/${company_id}/${ground}/${setQuality}`,
        {
          method: "POST", // Asegúrate de que el método coincide con tu endpoint
          headers: {
            "Content-Type": "application/json",
            "x-api-key": token,
          },
          cache: "no-store",
        }
      );
  
      if (res.ok) {
        const data = await res.json();
  
        if (data.code === "OK") {
          return data.data;
        } else if (data.code === "ERROR") {
          console.error(data.mensaje); // Muestra el mensaje de error
          return {}; // Devuelve un objeto vacío en caso de error
        }
      } else {
        console.error("Network response was not ok:", res.statusText); // Mensaje de error si la respuesta no es correcta
        return {}; // Devuelve un objeto vacío en caso de error de red
      }
    } catch (err) {
      console.error("Error en fetch:", err);
      return {}; // Devuelve un objeto vacío en caso de excepción
    }
  }