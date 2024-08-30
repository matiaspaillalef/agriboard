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
      } else if (groundData.code === "ERROR") {
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
          latitude: data.latitude !== "" ? data.latitude : null,
          longitude: data.longitude !== "" ? data.longitude : null,
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
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/updateGround",
      {
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
          latitude: data.latitude !== "" ? data.latitude : null,
          longitude: data.longitude !== "" ? data.longitude : null,
          zone: data.zone,
          company_id: data.company_id,
          status: data.status,
        }),
      }
    );

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
      } else if (groundData.code === "ERROR") {
        return groundData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

// Production - Sector Barracks

export const getDataSectorBarracks = async (id_company) => {
  try {
    const res = await fetch(
      URLAPI +
        `/api/v1/configuracion/production/getSectorsBarracks/${id_company}`,
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
      const sectorBarracksData = await res.json();

      if (sectorBarracksData.code === "OK") {
        return sectorBarracksData.sectors;
      } else if (sectorBarracksData.code === "ERROR") {
        return sectorBarracksData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

export const createSectorBarrack = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/createSectorBarrack",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          name: data.name,
          ground: data.ground,
          company_id: data.company_id,
          status: data.status,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const sectorBarracksData = await res.json();

      if (sectorBarracksData.code === "OK") {
        return "OK"; // Indicar que la creación fue exitosa
      } else if (sectorBarracksData.code === "ERROR") {
        return sectorBarracksData.mensaje; // Manejar el mensaje de error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  } catch (err) {
    console.error("Error al crear el registro:", err);
    throw new Error("Error al intentar crear el registro");
  }
};

export const updateSectorBarrack = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/updateSectorBarrack",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          id: data.id,
          name: data.name,
          ground: data.ground,
          company_id: data.company_id,
          status: data.status,
        }),
      }
    );

    if (res.ok) {
      const sectorBarracksData = await res.json();

      if (sectorBarracksData.code === "OK") {
        return "OK"; // Indicar que la actualización fue exitosa
      } else if (sectorBarracksData.code === "ERROR") {
        return sectorBarracksData.mensaje; // Manejar el error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  } catch (err) {
    console.error(err);
    throw new Error("Error al actualizar los datos del contratista");
  }
};

export const deleteSectorBarrack = async (id) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/deleteSectorBarrack",
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
      const sectorBarracksData = await res.json();

      if (sectorBarracksData.code === "OK") {
        return sectorBarracksData.code;
      } else if (sectorBarracksData.code === "ERROR") {
        return sectorBarracksData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

// Production - Varieties

export const getDataVarieties = async (id_company) => {
  try {
    const res = await fetch(
      URLAPI + `/api/v1/configuracion/production/getVarieties/${id_company}`,
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
      const sectorBarracksData = await res.json();

      if (sectorBarracksData.code === "OK") {
        return sectorBarracksData.varieties;
      } else if (sectorBarracksData.code === "ERROR") {
        return sectorBarracksData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

export const createVariety = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/createVariety",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          name: data.name,
          company_id: data.company_id,
          status: data.status,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const varietyData = await res.json();

      if (varietyData.code === "OK") {
        return "OK"; // Indicar que la creación fue exitosa
      } else if (varietyData.code === "ERROR") {
        return varietyData.mensaje; // Manejar el mensaje de error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  } catch (err) {
    console.error("Error al crear el registro:", err);
    throw new Error("Error al intentar crear el registro");
  }
};

export const updateVariety = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/updateVariety",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          id: data.id,
          name: data.name,
          company_id: data.company_id,
          status: data.status,
        }),
      }
    );

    if (res.ok) {
      const varietyData = await res.json();

      if (varietyData.code === "OK") {
        return "OK"; // Indicar que la actualización fue exitosa
      } else if (varietyData.code === "ERROR") {
        return varietyData.mensaje; // Manejar el error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  } catch (err) {
    console.error(err);
    throw new Error("Error al actualizar los datos del contratista");
  }
};

export const deleteVariety = async (id) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/deleteVariety",
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
      const varietyData = await res.json();

      if (varietyData.code === "OK") {
        return varietyData.code;
      } else if (varietyData.code === "ERROR") {
        return varietyData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

// Production - Species

export const getDataSpecies = async (id_company) => {
  try {
    const res = await fetch(
      URLAPI + `/api/v1/configuracion/production/getSpecies/${id_company}`,
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
      const speciesData = await res.json();

      if (speciesData.code === "OK") {
        return speciesData.species;
      } else if (speciesData.code === "ERROR") {
        return speciesData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

export const createSpecies = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/createSpecies",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          name: data.name,
          varieties: data.varieties,
          company_id: data.company_id,
          status: data.status,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const speciesData = await res.json();

      console.log("speciesData", speciesData);
      if (speciesData.code === "OK") {
        return "OK"; // Indicar que la creación fue exitosa
      } else if (speciesData.code === "ERROR") {
        return speciesData.mensaje; // Manejar el mensaje de error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  } catch (err) {
    console.error("Error al crear el registro:", err);
    throw new Error("Error al intentar crear el registro");
  }
};

export const updateSpecies = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/updateSpecies",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          id: data.id,
          name: data.name,
          varieties: data.varieties,
          company_id: data.company_id,
          status: data.status,
        }),
      }
    );

    if (res.ok) {
      const speciesData = await res.json();

      if (speciesData.code === "OK") {
        return "OK"; // Indicar que la actualización fue exitosa
      } else if (speciesData.code === "ERROR") {
        return speciesData.mensaje; // Manejar el error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  } catch (err) {
    console.error(err);
    throw new Error("Error al actualizar los datos del contratista");
  }
};

export const deleteSpecies = async (id) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/deleteSpecies",
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
      const speciesData = await res.json();

      if (speciesData.code === "OK") {
        return speciesData.code;
      } else if (speciesData.code === "ERROR") {
        return speciesData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

// Production - Seasons
export const getDataSeasons = async (id_company) => {
  try {
    const res = await fetch(
      URLAPI + `/api/v1/configuracion/production/getSeasons/${id_company}`,
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
      const seasonsData = await res.json();

      if (seasonsData.code === "OK") {
        return seasonsData.seasons;
      } else if (seasonsData.code === "ERROR") {
        return seasonsData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

export const createSeason = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/createSeason",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          name: data.name,
          period: data.period,
          date_from: data.date_from,
          date_until: data.date_until,
          shifts: data.shifts,
          company_id: data.company_id,
          status: data.status,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const seasonData = await res.json();

      if (seasonData.code === "OK") {
        return "OK"; // Indicar que la creación fue exitosa
      } else if (seasonData.code === "ERROR") {
        return seasonData.mensaje; // Manejar el mensaje de error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  } catch (err) {
    console.error("Error al crear el registro:", err);
    throw new Error("Error al intentar crear el registro");
  }
};

export const updateSeason = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/updateSeason",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          id: data.id,
          name: data.name,
          period: data.period,
          date_from: data.date_from,
          date_until: data.date_until,
          shifts: data.shifts,
          status: data.status,
          company_id: data.company_id,
        }),
      }
    );

    if (res.ok) {
      const seasonData = await res.json();

      if (seasonData.code === "OK") {
        return "OK"; // Indicar que la actualización fue exitosa
      } else if (seasonData.code === "ERROR") {
        return seasonData.mensaje; // Manejar el error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  } catch (err) {
    console.error(err);
    throw new Error("Error al actualizar los datos del contratista");
  }
};

export const deleteSeason = async (id) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/deleteSeason",
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
      const seasonData = await res.json();

      if (seasonData.code === "OK") {
        return seasonData.code;
      } else if (seasonData.code === "ERROR") {
        return seasonData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

// Production - Type Collection
export const getDataTypeCollection = async (id_company) => {
  try {
    const res = await fetch(
      URLAPI +
        `/api/v1/configuracion/production/getCollectionType/${id_company}`,
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
      const typeCollectionData = await res.json();

      if (typeCollectionData.code === "OK") {
        return typeCollectionData.collections;
      } else if (typeCollectionData.code === "ERROR") {
        return typeCollectionData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

export const createTypeCollection = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/createCollectionType",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          name: data.name,
          company_id: data.company_id,
          status: data.status,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const typeCollectionData = await res.json();

      if (typeCollectionData.code === "OK") {
        return "OK"; // Indicar que la creación fue exitosa
      } else if (typeCollectionData.code === "ERROR") {
        return typeCollectionData.mensaje; // Manejar el mensaje de error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  } catch (err) {
    console.error("Error al crear el registro:", err);
    throw new Error("Error al intentar crear el registro");
  }
};

export const updateTypeCollection = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/updateCollectionType",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          id: data.id,
          name: data.name,
          company_id: data.company_id,
          status: data.status,
        }),
      }
    );

    if (res.ok) {
      const typeCollectionData = await res.json();

      if (typeCollectionData.code === "OK") {
        return "OK"; // Indicar que la actualización fue exitosa
      } else if (typeCollectionData.code === "ERROR") {
        return typeCollectionData.mensaje; // Manejar el error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  } catch (err) {
    console.error(err);
    throw new Error("Error al actualizar los datos del contratista");
  }
};

export const deleteTypeCollection = async (id) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/deleteCollectionType",
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
      const typeCollectionData = await res.json();

      if (typeCollectionData.code === "OK") {
        return typeCollectionData.code;
      } else if (typeCollectionData.code === "ERROR") {
        return typeCollectionData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

// Production - Calidad

export const getDataQuality = async (id_company) => {
  try {
    const res = await fetch(
      URLAPI + `/api/v1/configuracion/production/getQuality/${id_company}`,
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
      const qualityData = await res.json();

      if (qualityData.code === "OK") {
        return qualityData.qualities;
      } else if (qualityData.code === "ERROR") {
        return qualityData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

export const createQuality = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/createQuality",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          name: data.name,
          abbreviation: data.abbreviation,
          company_id: data.company_id,
          status: data.status,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const qualityData = await res.json();

      if (qualityData.code === "OK") {
        return "OK"; // Indicar que la creación fue exitosa
      } else if (qualityData.code === "ERROR") {
        return qualityData.mensaje; // Manejar el mensaje de error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  } catch (err) {
    console.error("Error al crear el registro:", err);
    throw new Error("Error al intentar crear el registro");
  }
};

export const updateQuality = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/updateQuality",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          id: data.id,
          name: data.name,
          abbreviation: data.abbreviation,
          company_id: data.company_id,
          status: data.status,
        }),
      }
    );

    if (res.ok) {
      const qualityData = await res.json();

      if (qualityData.code === "OK") {
        return "OK"; // Indicar que la actualización fue exitosa
      } else if (qualityData.code === "ERROR") {
        return qualityData.mensaje; // Manejar el error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  } catch (err) {
    console.error(err);
    throw new Error("Error al actualizar los datos del contratista");
  }
};

export const deleteQuality = async (id) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/deleteQuality",
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
      const qualityData = await res.json();

      if (qualityData.code === "OK") {
        return qualityData.code;
      } else if (qualityData.code === "ERROR") {
        return qualityData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

// Production - Harvest format
export const getDataHarvestFormat = async (id_company) => {
  try {
    const res = await fetch(
      URLAPI + `/api/v1/configuracion/production/getHarvestFormat/${id_company}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
      }
    );

    if (res.ok) {
      const harvestFormatData = await res.json();

      if (harvestFormatData.code === "OK") {
        return harvestFormatData.formats;
      } else if (harvestFormatData.code === "ERROR") {
        return harvestFormatData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

export const createHarvestFormat = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/createHarvestFormat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          name: data.name,
          tara_base: data.tara_base,
          specie: data.specie,
          min_weight: data.min_weight,
          max_weight: data.max_weight,
          average_weight: data.average_weight,
          quantity_trays: data.quantity_trays,
          collection: data.collection,
          status: data.status,
          company_id: data.company_id, 
        }),

      }
    );

    if (res.ok) {
      const harvestFormatData = await res.json();

      if (harvestFormatData.code === "OK") {
        return "OK"; // Indicar que la creación fue exitosa
      } else if (harvestFormatData.code === "ERROR") {
        return harvestFormatData.mensaje; // Manejar el mensaje de error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  } catch (err) {
    console.error("Error al crear el registro:", err);
    throw new Error("Error al intentar crear el registro");
  }
};

export const updateHarvestFormat = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/updateHarvestFormat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          id: data.id,
          name: data.name,
          tara_base: data.tara_base,
          specie: data.specie,
          min_weight: data.min_weight,
          max_weight: data.max_weight,
          average_weight: data.average_weight,
          quantity_trays: data.quantity_trays,
          collection: data.collection,
          status: data.status,
          company_id: data.company_id,
        }),
      }
    );

    if (res.ok) {
      const harvestFormatData = await res.json();

      if (harvestFormatData.code === "OK") {
        return "OK"; // Indicar que la actualización fue exitosa
      } else if (harvestFormatData.code === "ERROR") {
        return harvestFormatData.mensaje; // Manejar el error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  }
  catch (err) {
    console.error(err);
    throw new Error("Error al actualizar el registro");
  }
};

export const deleteHarvestFormat = async (id) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/deleteHarvestFormat",

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({ id: id }),
        cache: "no-store",
      }

    );

    if (res.ok) {
      const harvestFormatData = await res.json();

      if (harvestFormatData.code === "OK") {
        return harvestFormatData.code;
      } else if (harvestFormatData.code === "ERROR") {
        return harvestFormatData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

// Production - Balanzas

export const getDataScale = async (id_company) => {
  try {
    const res = await fetch(
      URLAPI + `/api/v1/configuracion/production/getScale/${id_company}`,
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
      const scaleData = await res.json();

      if (scaleData.code === "OK") {
        return scaleData.scales;
      } else if (scaleData.code === "ERROR") {
        return scaleData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export const createScale = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/createScale",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          name: data.name,
          location: data.location,
          company_id: data.company_id,
          status: data.status,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const scaleData = await res.json();

      if (scaleData.code === "OK") {
        return "OK"; // Indicar que la creación fue exitosa
      } else if (scaleData.code === "ERROR") {
        return scaleData.mensaje; // Manejar el mensaje de error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  } catch (err) {
    console.error("Error al crear el registro:", err);
    throw new Error("Error al intentar crear el registro");
  }
}

export const updateScale = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/updateScale",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          id: data.id,
          name: data.name,
          location: data.location,
          company_id: data.company_id,
          status: data.status,
        }),
      }
    );

    if (res.ok) {
      const scaleData = await res.json();

      if (scaleData.code === "OK") {
        return "OK"; // Indicar que la actualización fue exitosa
      } else if (scaleData.code === "ERROR") {
        return scaleData.mensaje; // Manejar el error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  }
  catch (err) {
    console.error(err);
    throw new Error("Error al actualizar los registros");
  }
}

export const deleteScale = async (id) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/deleteScale",
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
      const scaleData = await res.json();

      if (scaleData.code === "OK") {
        return scaleData.code;
      } else if (scaleData.code === "ERROR") {
        return scaleData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Production - Register Scale

export const getDataScaleRegister = async (id_company) => {
  try {
    const res = await fetch(
      URLAPI + `/api/v1/configuracion/production/getScaleRegister/${id_company}`,
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
      const scaleRegisterData = await res.json();

      if (scaleRegisterData.code === "OK") {
        return scaleRegisterData.registers;
      } else if (scaleRegisterData.code === "ERROR") {
        return scaleRegisterData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export const createScaleRegister = async (data) => {

  console.log("data", data);
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/createScaleRegister",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          scale: data.scale,
          quality: data.quality,
          date: data.date,
          boxes: data.boxes,
          kg_boxes: data.kg_boxes,
          specie: data.specie,
          variety: data.variety,
          season: data.season,
          company_id: data.company_id,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const scaleRegisterData = await res.json();

      if (scaleRegisterData.code === "OK") {
        return "OK"; // Indicar que la creación fue exitosa
      } else if (scaleRegisterData.code === "ERROR") {
        return scaleRegisterData.mensaje; // Manejar el mensaje de error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  } catch (err) {
    console.error("Error al crear el registro:", err);
    throw new Error("Error al intentar crear el registro");
  }
}

export const updateScaleRegister = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/updateScaleRegister",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          id: data.id,
          scale: data.scale,
          quality: data.quality,
          date: data.date,
          boxes: data.boxes,
          kg_boxes: data.kg_boxes,
          specie: data.specie,
          variety: data.variety,
          season: data.season,
          company_id: data.company_id,
        }),
      }
    );

    if (res.ok) {
      const scaleRegisterData = await res.json();

      if (scaleRegisterData.code === "OK") {
        return "OK"; // Indicar que la actualización fue exitosa
      } else if (scaleRegisterData.code === "ERROR") {
        return scaleRegisterData.mensaje; // Manejar el error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  }
  catch (err) {
    console.error(err);
    throw new Error("Error al actualizar los registros");
  }
}

export const deleteScaleRegister = async (id) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/deleteScaleRegister",
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
      const scaleRegisterData = await res.json();

      if (scaleRegisterData.code === "OK") {
        return scaleRegisterData.code;
      } else if (scaleRegisterData.code === "ERROR") {
        return scaleRegisterData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

//Production - Deals

export const getDataDeals = async (id_company) => {
  try {
    const res = await fetch(
      URLAPI + `/api/v1/configuracion/production/getDeals/${id_company}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
      }
    );

    if (res.ok) {
      const dealsData = await res.json();

      if (dealsData.code === "OK") {
        return dealsData.deals;
      } else if (dealsData.code === "ERROR") {
        return dealsData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export const createDeal = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/createDeal",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify(data),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const dealData = await res.json();

      if (dealData.code === "OK") {
        return "OK"; // Indicar que la creación fue exitosa
      } else if (dealData.code === "ERROR") {
        return dealData.mensaje; // Manejar el mensaje de error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  }
  catch (err) {
    console.error("Error al crear el registro:", err);
    throw new Error("Error al intentar crear el registro");
  }
}

export const updateDeal = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/updateDeal",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify(data),
      }
    );

    if (res.ok) {
      const dealData = await res.json();

      if (dealData.code === "OK") {
        return "OK"; // Indicar que la actualización fue exitosa
      } else if (dealData.code === "ERROR") {
        return dealData.mensaje; // Manejar el error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  }
  catch (err) {
    console.error(err);
    throw new Error("Error al actualizar los registros");
  }
}

export const deleteDeal = async (id) => {

  try {
    const response = await fetch(
      URLAPI + "/api/v1/configuracion/production/deleteDeal",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({ id: id }),
        cache: "no-store",
      }
    );

    if (response.ok) {
      const dealData = await response.json();

      if (dealData.code === "OK") {
        return dealData.code;
      } else {
        throw new Error(dealData.mensaje);
      }
    } else {
      const errorText = await response.text();
      throw new Error(`Error en la respuesta del servidor: ${errorText}`);
    }
  } catch (err) {
    console.error("Error en la función deleteDeal:", err.message);
    return `Error: ${err.message}`;
  }
}


//Production - Exporters

export const getDataExporters = async (id_company) => {
  try {
    const res = await fetch(
      URLAPI + `/api/v1/configuracion/production/getExporters/${id_company}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
      }
    );

    if (res.ok) {
      const exportersData = await res.json();

      if (exportersData.code === "OK") {
        return exportersData.exporters;
      } else if (exportersData.code === "ERROR") {
        return exportersData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export const createExporter = async (data) => {
  console.log("data", data);
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/createExporter",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify(data),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const exporterData = await res.json();

      if (exporterData.code === "OK") {
        return "OK"; // Indicar que la creación fue exitosa
      } else if (exporterData.code === "ERROR") {
        return exporterData.mensaje; // Manejar el mensaje de error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  }
  catch (err) {
    console.error("Error al crear el registro:", err);
    throw new Error("Error al intentar crear el registro");
  }
}

export const updateExporter = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/updateExporter",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify(data),
      }
    );

    if (res.ok) {
      const exporterData = await res.json();

      if (exporterData.code === "OK") {
        return "OK"; // Indicar que la actualización fue exitosa
      } else if (exporterData.code === "ERROR") {
        return exporterData.mensaje; // Manejar el error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  }
  catch (err) {
    console.error(err);
    throw new Error("Error al actualizar los registros");
  }
}

export const deleteExporter = async (id) => {

  try {
    const response = await fetch(
      URLAPI + "/api/v1/configuracion/production/deleteExporter",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({ id: id }),
        cache: "no-store",
      }
    );

    if (response.ok) {
      const exporterData = await response.json();

      if (exporterData.code === "OK") {
        return exporterData.code;
      } else {
        throw new Error(exporterData.mensaje);
      }
    } else {
      const errorText = await response.text();
      throw new Error(`Error en la respuesta del servidor: ${errorText}`);
    }
  } catch (err) {
    console.error("Error en la función deleteExporter:", err.message);
    return `Error: ${err.message}`;
  }
}

//Production - Carga Manual

export const getDataManualHarvesting = async (id_company) => {
  try {
    const res = await fetch(
      URLAPI + `/api/v1/configuracion/production/getManualHarvesting/${id_company}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
      }
    );

    if (res.ok) {
      const manualHarvestingData = await res.json();

      if (manualHarvestingData.code === "OK") {
        return manualHarvestingData.manualHarvesting;
      } else if (manualHarvestingData.code === "ERROR") {
        return manualHarvestingData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export const createManualHarvesting = async (data) => {
  console.log(data);
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/createManualHarvesting",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify(data),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const manualHarvestingData = await res.json();

      if (manualHarvestingData.code === "OK") {
        return "OK"; // Indicar que la creación fue exitosa
      } else if (manualHarvestingData.code === "ERROR") {
        return manualHarvestingData.mensaje; // Manejar el mensaje de error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  }
  catch (err) {
    console.error("Error al crear el registro:", err);
    throw new Error("Error al intentar crear el registro");
  }
}

export const updateManualHarvesting = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/updateManualHarvesting",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify(data),
      }
    );

    if (res.ok) {
      const manualHarvestingData = await res.json();

      if (manualHarvestingData.code === "OK") {
        return "OK"; // Indicar que la actualización fue exitosa
      } else if (manualHarvestingData.code === "ERROR") {
        return manualHarvestingData.mensaje; // Manejar el error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  }
  catch (err) {
    console.error(err);
    throw new Error("Error al actualizar los registros");
  }
}

export const deleteManualHarvesting = async (id) => {

  try {
    const response = await fetch(
      URLAPI + "/api/v1/configuracion/production/deleteManualHarvesting",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({ id: id }),
        cache: "no-store",
      }
    );

    if (response.ok) {
      const manualHarvestingData = await response.json();

      if (manualHarvestingData.code === "OK") {
        return manualHarvestingData.code;
      } else {
        throw new Error(manualHarvestingData.mensaje);
      }
    } else {
      const errorText = await response.text();
      throw new Error(`Error en la respuesta del servidor: ${errorText}`);
    }
  } catch (err) {
    console.error("Error en la función deleteManualHarvesting:", err.message);
    return `Error: ${err.message}`;
  }
}


// Production - Dispatch Guide
export const getDataDispatchGuide = async (id_company) => {
  try {
    const res = await fetch(
      URLAPI + `/api/v1/configuracion/production/getDispatchGuide/${id_company}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
      }
    );

    if (res.ok) {
      const dispatchGuideData = await res.json();

      if (dispatchGuideData.code === "OK") {
        return dispatchGuideData.dispatchGuide;
      } else if (dispatchGuideData.code === "ERROR") {
        return dispatchGuideData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export const createDispatchGuide = async (data) => {
  console.log(data);
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/createDispatchGuide",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify(data),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const dispatchGuideData = await res.json();

      if (dispatchGuideData.code === "OK") {
        return "OK"; // Indicar que la creación fue exitosa
      } else if (dispatchGuideData.code === "ERROR") {
        return dispatchGuideData.mensaje; // Manejar el mensaje de error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  }
  catch (err) {
    console.error("Error al crear el registro:", err);
    throw new Error("Error al intentar crear el registro");
  }
}

export const updateDispatchGuide = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/production/updateDispatchGuide",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify(data),
      }
    );

    if (res.ok) {
      const dispatchGuideData = await res.json();

      if (dispatchGuideData.code === "OK") {
        return "OK"; // Indicar que la actualización fue exitosa
      } else if (dispatchGuideData.code === "ERROR") {
        return dispatchGuideData.mensaje; // Manejar el error desde la API
      }
    } else {
      throw new Error("Error en la solicitud HTTP");
    }
  }
  catch (err) {
    console.error(err);
    throw new Error("Error al actualizar los registros");
  }
}

export const deleteDispatchGuide = async (id) => {

  try {
    const response = await fetch(
      URLAPI + "/api/v1/configuracion/production/deleteDispatchGuide",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({ id: id }),
        cache: "no-store",
      }
    );

    if (response.ok) {
      const dispatchGuideData = await response.json();

      if (dispatchGuideData.code === "OK") {
        return dispatchGuideData.code;
      } else {
        throw new Error(dispatchGuideData.mensaje);
      }
    } else {
      const errorText = await response.text();
      throw new Error(`Error en la respuesta del servidor: ${errorText}`);
    }
  } catch (err) {
    console.error("Error en la función deleteDispatchGuide:", err.message);
    return `Error: ${err.message}`;
  }
}


//Results Filter
export const filterResults = async (filters, id_company) => {
  try {
    const res = await fetch(
      URLAPI + `/api/v1/configuracion/production/filterResults/${id_company}`, // Asumiendo que tu endpoint para filtrar es similar
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify(filters), // Envía los filtros como cuerpo de la solicitud
      }
    );

    if (res.ok) {
      const data = await res.json();

      if (data.code === "OK") {
        return data.results; // Devuelve los resultados filtrados
      } else if (data.code === "ERROR") {
        return data.mensaje; // Maneja el error según tu lógica
      }
    }
  } catch (err) {
    console.error(err);
  }
};
