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
