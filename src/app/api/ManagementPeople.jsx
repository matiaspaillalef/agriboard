import jwt from "jsonwebtoken";
import { date } from "zod";

const URLAPI = process.env.NEXT_PUBLIC_API_URL;
const APIKEY = process.env.NEXT_PUBLIC_JWT_SECRET;


const token = jwt.sign({ uid: "agrisoft" }, APIKEY, {
  expiresIn: 30000,
});

// Management People - Contractors

export const getDataContractors = async (id_company) => {
  try {
    //console.log("id_company" , id_company);
    const res = await fetch(
      URLAPI + `/api/v1/management-people/contractors/getContractors/${id_company}`,
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

      const contractorsData = await res.json();

      if (contractorsData.code === "OK") {
        return contractorsData.contractors;
      }
      else if (contractorsData.code === "ERROR") {
        return contractorsData.mensaje;
      }
    }

  } catch (err) {
    console.error(err);
  }
};

export const createContractor = async (data) => {
  try {

    const userDataString = sessionStorage.getItem("userData");
    const userData = JSON.parse(userDataString);

    const res = await fetch(
      URLAPI + "/api/v1/management-people/contractors/createContractor",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          rut: data.rut,
          name: data.name,
          lastname: data.lastname,
          giro: data.giro,
          phone: data.phone,
          email: data.email,
          state: data.state,
          city: data.city,
          status: data.status,
          idCompany: userData.idCompany,
        }),
        cache: "no-store",
      }
    );

    //console.log(res);

    if (res.ok) {

      const contractorsData = await res.json();

      if (contractorsData.code === "OK") {
        return contractorsData.code;
      }
      else if (contractorsData.code === "ERROR") {
        return contractorsData.mensaje;
      }
    }

  } catch (err) {
    console.error(err);
  }
};

export const updateContractor = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/management-people/contractors/updateContractor",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          id: data.id,
          rut: data.rut,
          name: data.name,
          lastname: data.lastname,
          giro: data.giro,
          phone: data.phone,
          email: data.email,
          state: data.state,
          city: data.city,
          status: data.status,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {

      const contractorsData = await res.json();

      if (contractorsData.code === "OK") {
        return contractorsData.code;
      }
      else if (contractorsData.code === "ERROR") {
        return contractorsData.mensaje;
      }
    }

  } catch (err) {
    console.error(err);
  }
};

export const deleteContractor = async (id) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/management-people/contractors/deleteContractor",
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

      const contractorsData = await res.json();

      if (contractorsData.code === "OK") {
        return contractorsData.code;
      }
      else if (contractorsData.code === "ERROR") {
        return contractorsData.mensaje;
      }
    }

  } catch (err) {
    console.error(err);
  }
};

// Management People - Positions

export const getDataPositions = async (id_company) => {
  try {

    const res = await fetch(
      URLAPI + `/api/v1/management-people/positions/getPositions/${id_company}`,
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

      const positionsData = await res.json();

      if (positionsData.code === "OK") {
        return positionsData.positions;
      }
      else if (positionsData.code === "ERROR") {
        return positionsData.mensaje;
      }
    }

  } catch (err) {
    console.error(err);
  }
};

export const createPosition = async (data) => {
  try {

    const userDataString = sessionStorage.getItem("userData");
    const userData = JSON.parse(userDataString);

    const res = await fetch(
      URLAPI + "/api/v1/management-people/positions/createPosition",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          name: data.name,
          status: data.status,
          idCompany: userData.idCompany,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {

      const positionData = await res.json();

      if (positionData.code === "OK") {
        return positionData.code;
      }
      else if (positionData.code === "ERROR") {
        return positionData.mensaje;
      }

    }

  } catch (err) {
    console.error(err);
  }
};

export const updatePosition = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/management-people/positions/updatePosition",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          id: data.id,
          name: data.name,
          status: data.status,
        }),
        cache: "no-store",
      }
    );


    if (res.ok) {

      const positionData = await res.json();

      if (positionData.code === "OK") {
        return positionData.code;
      }
      else if (positionData.code === "ERROR") {
        return positionData.mensaje;
      }

    }
  } catch (err) {
    console.error(err);
  }
};

export const deletePosition = async (id) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/management-people/positions/deletePosition",
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

      const positionData = await res.json();

      if (positionData.code === "OK") {
        return positionData.code;
      }
      else if (positionData.code === "ERROR") {
        return positionData.mensaje;
      }

    }
  } catch (err) {
    console.error(err);
  }
};


// Management People - Groups

export const getDataGroups = async (id_company) => {
  try {

    const res = await fetch(
      URLAPI + `/api/v1/management-people/groups/getGroups/${id_company}`,
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

      const groupsData = await res.json();

      if (groupsData.code === "OK") {
        return groupsData.groups;
      }
      else if (groupsData.code === "ERROR") {
        return groupsData.mensaje;
      }

    }

  } catch (err) {
    console.error(err);
  }
}

export const createGroup = async (data) => {
  try {

    const userDataString = sessionStorage.getItem("userData");
    const userData = JSON.parse(userDataString);

    const res = await fetch(
      URLAPI + "/api/v1/management-people/groups/createGroup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          name: data.name,
          status: data.status,
          idCompany: userData.idCompany,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {

      const groupData = await res.json();

      if (groupData.code === "OK") {
        return groupData.code;
      }
      else if (groupData.code === "ERROR") {
        return groupData.mensaje;
      }
    }

  } catch (err) {
    console.error(err);
  }
}

export const updateGroup = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/management-people/groups/updateGroup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          id: data.id,
          name: data.name,
          status: data.status,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {

      const groupData = await res.json();

      if (groupData.code === "OK") {
        return groupData.code;
      }
      else if (groupData.code === "ERROR") {
        return groupData.mensaje;
      }
    }

  } catch (err) {
    console.error(err);
  }
}

export const deleteGroup = async (id) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/management-people/groups/deleteGroup",
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

      const groupsData = await res.json();

      if (groupsData.code === "OK") {
        return groupsData.code;
      }
      else if (groupsData.code === "ERROR") {
        return groupsData.mensaje;
      }

    }

  } catch (err) {
    console.error(err);
  }
}