import jwt from "jsonwebtoken";
import { date } from "zod";

const URLAPI = process.env.NEXT_PUBLIC_API_URL;
const APIKEY = process.env.NEXT_PUBLIC_JWT_SECRET;


const token = jwt.sign({ uid: "agrisoft" }, APIKEY, {
  expiresIn: 30000,
});


// Production - Ground

export const getDataGround = async (id_company) => {
  try {
    //console.log("id_company" , id_company);
    const res = await fetch(
      URLAPI + `/api/v1/configuracion/production/getGround/${id_company}`,
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

      const groundData = await res.json();

      if (groundData.code === "OK") {
        return groundData.grounds;
      }
      else if (groundData.code === "ERROR") {
        return groundData.mensaje;
      }
    }

  } catch (err) {
    console.error(err);
  }
};

export const createGround = async (data) => {
  try {


    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/createGround",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          name: data.name,
          state: data.state,
          city: data.city,
          address: data.address,
          latitude: data.latitude !== '' ? data.latitude : null,
          longitude: data.longitude !== '' ? data.longitude : null,
          zone: data.zone,
          company_id: data.company_id,
          status: data.status,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const groundData = await res.json();

      if (groundData.code === "OK") {
        return "OK"; // Indicar que la creación fue exitosa
      } else if (groundData.code === "ERROR") {
        return groundData.mensaje; // Manejar el mensaje de error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  } catch (err) {
    console.error("Error al crear el registro:", err);
    throw new Error("Error al intentar crear el registro");
  }
};


export const updateGround = async (data) => {
  try {
    const res = await fetch(URLAPI + "/api/v1/configuracion/production/updateGround", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": token,
      },
      body: JSON.stringify({
        id: data.id,
        name: data.name,
        state: data.state,
        city: data.city,
        address: data.address,
        latitude: data.latitude !== '' ? data.latitude : null,
        longitude: data.longitude !== '' ? data.longitude : null,
        zone: data.zone,
        company_id: data.company_id,
        status: data.status,
      }),
    });

    if (res.ok) {
      const groundData = await res.json();
      //console.log("groundData", groundData);

      if (groundData.code === "OK") {
        return "OK"; // Indicar que la actualización fue exitosa
      } else if (groundData.code === "ERROR") {
        return groundData.mensaje; // Manejar el error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  } catch (err) {
    console.error(err);
    throw new Error("Error al actualizar los datos del contratista");
  }
};


export const deleteGround = async (id) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/deleteGround",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          id: id,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {

      const groundData = await res.json();

      if (groundData.code === "OK") {
        return groundData.code;
      }
      else if (groundData.code === "ERROR") {
        return groundData.mensaje;
      }
    }

  } catch (err) {
    console.error(err);
  }
};