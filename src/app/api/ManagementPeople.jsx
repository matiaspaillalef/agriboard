import { data } from "autoprefixer";

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
  console.log(data);
  try {
    const res = await fetch(
      `${URLAPI}/api/v1/management-people/positions/createPosition`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': token,
        },
        body: JSON.stringify({
          name: data.name,
          status: data.status,
          company_id: data.company_id,
        }),
        cache: 'no-store',
      }
    );

    console.log(res);

    if (res.ok) {
      const positionData = await res.json();
      console.log(positionData);

      return positionData;
    } else {
      const errorData = await res.json();
      return errorData;
    }

  } catch (err) {
    console.error(err);
    return { code: 'ERROR', mensaje: 'Error al realizar la solicitud.' };
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
          company_id: data.company_id,
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

      //console.log('groupsData:', groupsData)
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
          id_company: data.company_id,
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
          id_company: data.company_id,
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
          workers: data.workers,
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
  console.log(data);
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
          workers: data.workers, 
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

export const getDataShifts = async (id_company) => {
  try {
    const res = await fetch(
      URLAPI + `/api/v1/management-people/shifts/getShifts/${id_company}`,
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

      else if (shiftsData.code === "ERROR") {
        
        return shiftsData.code;

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
          id_company: data.id_company
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
          monday_opening_time: data.monday_opening_time ? data.monday_opening_time : null,
          monday_closing_time: data.monday_closing_time ? data.monday_closing_time : null,
          tuesday_opening_time: data.tuesday_opening_time ? data.tuesday_opening_time : null,
          tuesday_closing_time: data.tuesday_closing_time ? data.tuesday_closing_time : null,
          wednesday_opening_time: data.wednesday_opening_time ? data.wednesday_opening_time : null,
          wednesday_closing_time: data.wednesday_closing_time ? data.wednesday_closing_time : null,
          thursday_opening_time: data.thursday_opening_time ? data.thursday_opening_time : null,
          thursday_closing_time: data.thursday_closing_time ? data.thursday_closing_time : null,
          friday_opening_time: data.friday_opening_time ? data.friday_opening_time : null,
          friday_closing_time: data.friday_closing_time ? data.friday_closing_time : null,
          saturday_opening_time: data.saturday_opening_time ? data.saturday_opening_time : null,
          saturday_closing_time: data.saturday_closing_time ? data.saturday_closing_time : null,
          sunday_opening_time: data.sunday_opening_time ? data.sunday_opening_time : null,
          sunday_closing_time: data.sunday_closing_time ? data.sunday_closing_time : null,
          status: data.status,
          id_company: Number(data.id_company)
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
export const getDataWorkers = async (id_company) => {
  try {
    const response = await fetch(
      `${URLAPI}/api/v1/management-people/workers/getWorkers/${id_company}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        cache: "no-store",
      }
    );

    if (response.ok) {
      const workersData = await response.json();

      if (workersData.code === "OK") {
        return workersData.workers;
      } else {
        //console.error('Error code from API:', workersData.code);
        throw new Error(workersData.mensaje || 'Error desconocido');
      }
    } else {
      console.error('HTTP error:', response.status);
      throw new Error('Error HTTP: ' + response.status);
    }
  } catch (err) {
    //console.error('Fetch error:', err);
    throw err; // Re-throw error to handle it further up the call stack
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
          email: data.email,
          //phone_company: data.phone_company,
          date_admission: data.date_admission,
          status: data.status,
          position: data.position,
          contractor: data.contractor,
          squad: data.squad,
          leader_squad: data.leader_squad,
          shift: data.shift,
          wristband: data.wristband,
          observation: data.observation,
          bank: data.bank,
          account_type: data.account_type,
          account_number: data.account_number,
          afp: data.afp,
          health: data.health,
          company_id: Number(data.company_id),
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const workerData = await res.json();
      return workerData;
    }
  }
  catch (err) {
    console.error(err);
  }
}

export const updateWorker = async (data) => {
  console.log('Datos enviados al backend:', data);

  try {
    const res = await fetch(
      URLAPI + "/api/v1/management-people/workers/updateWorker",
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

    console.log('Respuesta del backend:', res);

    if (res.ok) {
      const workerData = await res.json();
      console.log('Datos del trabajador actualizado:', workerData);
      return workerData;
    } else {
      const errorData = await res.json();
      console.error('Error en la respuesta del backend:', errorData);
      return errorData;
    }
  } catch (err) {
    console.error('Error en la solicitud:', err);
  }
};


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
