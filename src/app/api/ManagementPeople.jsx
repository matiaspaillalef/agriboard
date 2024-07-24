import jwt from "jsonwebtoken";
import { date } from "zod";

const URLAPI = process.env.NEXT_PUBLIC_API_URL;
const APIKEY = process.env.NEXT_PUBLIC_JWT_SECRET;


const token = jwt.sign({ uid: "agrisoft" }, APIKEY, {
  expiresIn: 30000,
});

////////// Management People - CONTRACTORS  //////////////////////////

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

////////// Management People - POSITIONS  //////////////////////////

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


////////// Management People - GROUPS  //////////////////////////

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


////////// Management People - SQUADS  //////////////////////////

export const getDataSquads = async (id_company) => {
  try {
    const res = await fetch(
      URLAPI + `/api/v1/management-people/squads/getSquads/${id_company}`,
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
      const SquadsData = await res.json();
      if (SquadsData.code === "OK") {
        return SquadsData.squads;
      }
      else if (SquadsData.code === "ERROR") {
        return SquadsData.mensaje;
      }
    }
  } catch (err) {
    console.error(err);
  }
}


export const createSquad = async (data) => {
  try {

    const userDataString = sessionStorage.getItem("userData");
    const userData = JSON.parse(userDataString);

    const res = await fetch(
      URLAPI + "/api/v1/management-people/Squads/createSquad",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          name: data.name,
          group: data.group,
          status: data.status,
          idCompany: userData.idCompany,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {

      const SquadData = await res.json();

      if (SquadData.code === "OK") {
        return SquadData.code;
      }
      else if (SquadData.code === "ERROR") {
        return SquadData.mensaje;
      }
    }

  } catch (err) {
    console.error(err);
  }
}

export const updateSquad = async (data) => {
  try {
    console.log(data);
    const res = await fetch(
      URLAPI + "/api/v1/management-people/Squads/updateSquad",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          id: data.id,
          name: data.name,
          group: data.group,
          status: data.status,
          workers: data.workers, // Añadimos la nueva propiedad
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {

      const SquadData = await res.json();

      if (SquadData.code === "OK") {
        return SquadData.code;
      }
      else if (SquadData.code === "ERROR") {
        return SquadData.mensaje;
      }
    }

  } catch (err) {
    console.error(err);
  }
};



export const deleteSquad = async (id) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/management-people/Squads/deleteSquad",
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
      const SquadData = await res.json();
      return SquadData.code;
    }
  } catch (err) {
    console.error(err);
  }
}

//Management People - Shifts

export const getDataShifts = async () => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/management-people/shifts/getShifts",
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
      const shiftsData = await res.json();

      if (shiftsData.code === "OK") {
        return shiftsData.shifts;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export const createShift = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/management-people/shifts/createShift",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          name: data.name,
          monday_opening_time: data.monday_opening_time,
          monday_closing_time: data.monday_closing_time,
          tuesday_opening_time: data.tuesday_opening_time,
          tuesday_closing_time: data.tuesday_closing_time,
          wednesday_opening_time: data.wednesday_opening_time,
          wednesday_closing_time: data.wednesday_closing_time,
          thursday_opening_time: data.thursday_opening_time,
          thursday_closing_time: data.thursday_closing_time,
          friday_opening_time: data.friday_opening_time,
          friday_closing_time: data.friday_closing_time,
          saturday_opening_time: data.saturday_opening_time,
          saturday_closing_time: data.saturday_closing_time,
          sunday_opening_time: data.sunday_opening_time,
          sunday_closing_time: data.sunday_closing_time,
          status: data.status,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const shiftData = await res.json();
      return shiftData.code;
    }
  } catch (err) {
    console.error(err);
  }
}

export const updateShift = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/management-people/shifts/updateShift",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          id: data.id,
          name: data.name,
          monday_opening_time: data.monday_opening_time,
          monday_closing_time: data.monday_closing_time,
          tuesday_opening_time: data.tuesday_opening_time,
          tuesday_closing_time: data.tuesday_closing_time,
          wednesday_opening_time: data.wednesday_opening_time,
          wednesday_closing_time: data.wednesday_closing_time,
          thursday_opening_time: data.thursday_opening_time,
          thursday_closing_time: data.thursday_closing_time,
          friday_opening_time: data.friday_opening_time,
          friday_closing_time: data.friday_closing_time,
          saturday_opening_time: data.saturday_opening_time,
          saturday_closing_time: data.saturday_closing_time,
          sunday_opening_time: data.sunday_opening_time,
          sunday_closing_time: data.sunday_closing_time,
          status: data.status,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const shiftData = await res.json();
      return shiftData.code;
    }
  } catch (err) {
    console.error(err);
  }
}

export const deleteShift = async (id) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/management-people/shifts/deleteShift",
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
      const shiftData = await res.json();
      return shiftData.code;
    }
  } catch (err) {
    console.error(err);
  }
}

//Management People - Workers
export const getDataWorkers = async () => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/management-people/workers/getWorkers",
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
      const workersData = await res.json();

      if (workersData.code === "OK") {
        return workersData.workers;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export const createWorker = async (data) => {

  try {
    const res = await fetch(
      URLAPI + "/api/v1/management-people/workers/createWorker",
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
          lastname2: data.lastname2,
          born_date: data.born_date,
          gender: data.gender,
          state_civil: data.state_civil,
          state: data.state,
          city: data.city,
          address: data.address,
          phone: data.phone,
          phone_company: data.phone_company,
          date_admission: data.date_admission,
          status: data.status,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const workerData = await res.json();
      return workerData.code;
    }
  }
  catch (err) {
    console.error(err);
  }
}

export const updateWorker = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/management-people/workers/updateWorker",
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
          lastname2: data.lastname2,
          born_date: data.born_date,
          gender: data.gender,
          state_civil: data.state_civil,
          state: data.state,
          city: data.city,
          address: data.address,
          phone: data.phone,
          phone_company: data.phone_company,
          date_admission: data.date_admission,
          status: data.status,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const workerData = await res.json();
      return workerData.code;
    }
  }
  catch (err) {
    console.error(err);
  }
}

export const deleteWorker = async (id) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/management-people/workers/deleteWorker",
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
      const workerData = await res.json();
      return workerData.code;
    }
  }
  catch (err) {
    console.error(err);
  }
}
