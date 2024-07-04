import jwt from "jsonwebtoken";
import { date } from "zod";

const URLAPI = process.env.NEXT_PUBLIC_API_URL;
const APIKEY = process.env.NEXT_PUBLIC_JWT_SECRET;

const token = jwt.sign({ uid: "agrisoft" }, APIKEY, {
  expiresIn: 30000,
});

export const getDataUser = async () => {
  try {
    /*const token = jwt.sign({ uid: "agrisoft" }, APIKEY, {
            expiresIn: 30000
        });*/

    const res = await fetch(
      URLAPI + "/api/v1/configuracion/usuarios/getUsuarios",
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
      const userData = await res.json();

      if (userData.code === "OK") {
        return userData.usuarios;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

export const deleteUser = async (idUser) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/usuarios/eliminarUsuarios",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          id: idUser,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const userData = await res.json();

      return userData.code;
    }
  } catch (err) {
    console.error(err);
  }
};
export const createUser = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/usuarios/crearUsuarios",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          name: data.name,
          lastName: data.lastName,
          userEmail: data.userEmail,
          menuRol: 1,
          userPassword: data.userPassword,
          menuState: 1,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const userData = await res.json();

      return userData.code;
    }
  } catch (err) {
    console.error(err);
  }
};

export const updateUser = async (data) => {
  //console.log(data);
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/usuarios/actualizarUsuarios",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          id: data.userId,
          name: data.name,
          lastName: data.lastName,
          userEmail: data.userEmail,
          menuRol: data.menuRol,
          userPassword: data.userPassword,
          menuState: data.menuState,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const userData = await res.json();

      return userData.code;
    }
  } catch (err) {
    console.error(err);
  }
};

export const getRoles = async () => {
  try {
    const token = jwt.sign({ uid: "agrisoft" }, process.env.JWT_SECRET, {
      expiresIn: 30000,
    });

    const res = await fetch(
      URLAPI + "/api/v1/configuracion/usuarios/getRoles",
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
      const userData = await res.json();

      if (userData.code == "OK") {
        return userData.roles;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

//Empresa

export const getDataCompanies = async () => {
  try {
    /*const token = jwt.sign({ uid: "agrisoft" }, APIKEY, {
            expiresIn: 30000
        });*/

    const res = await fetch(
      URLAPI + "/api/v1/configuracion/empresas/getEmpresas",
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
      const companiesData = await res.json();

      if (companiesData.code === "OK") {
        return companiesData.companies;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

export const createCompany = async (data) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/empresas/createCompany",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          name_company: data.name_company,
          rut: data.rut,
          giro: data.giro,
          state: data.state,
          city: data.city,
          address: data.address,
          phone: data.phone,
          web: data.web,
          compensation_box: data.compensation_box,
          legal_representative_name: data.legal_representative_name,
          legal_representative_rut: data.legal_representative_rut,
          legal_representative_phone: data.legal_representative_phone,
          legal_representative_email: data.legal_representative_email,
          status: data.status,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const companyData = await res.json();
      return companyData.code;
    }
  } catch (err) {
    console.error(err);
  }
};

export const updateCompany = async (data) => {
  //console.log(data);
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/empresas/updateCompany",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify({
          id: data.id,
          name_company: data.name_company,
          rut: data.rut,
          giro: data.giro,
          state: data.state,
          city: data.city,
          address: data.address,
          phone: data.phone,
          web: data.web,
          compensation_box: data.compensation_box,
          legal_representative_name: data.legal_representative_name,
          legal_representative_rut: data.legal_representative_rut,
          legal_representative_phone: data.legal_representative_phone,
          legal_representative_email: data.legal_representative_email,
          status: data.status,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const companyData = await res.json();
      return companyData.code;
    }
  } catch (err) {
    console.error(err);
  }
};

export const deleteCompany = async (id) => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/configuracion/empresas/deleteCompany",
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
      const companyData = await res.json();

      return companyData.code;
    }
  } catch (err) {
    console.error(err);
  }
};

// Management People - Positions

export const getDataPositions = async () => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/management-people/positions/getPositions",
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
    }
  } catch (err) {
    console.error(err);
  }
};

export const createPosition = async (data) => {
  try {
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
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const positionData = await res.json();
      return positionData.code;
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
      return positionData.code;
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
      return positionData.code;
    }
  } catch (err) {
    console.error(err);
  }
};

// Management People - Positions

export const getDataContractors = async () => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/management-people/contractors/getContractors",
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
    }
  } catch (err) {
    console.error(err);
  }
};

export const createContractor = async (data) => {
  try {
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
        }),
        cache: "no-store",
      }
    );

    //console.log(res);

    if (res.ok) {
      const contractorData = await res.json();
      return contractorData.code;
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
      const contractorData = await res.json();
      return contractorData.code;
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
      const contractorData = await res.json();
      return contractorData.code;
    }
  } catch (err) {
    console.error(err);
  }
};

// Management People - Groups

export const getDataGroups = async () => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/management-people/groups/getGroups",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        cache: "no-store",
      }
    );

    //console.log(res);
    if (res.ok) {
      const groupsData = await res.json();

      if (groupsData.code === "OK") {
        return groupsData.groups;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export const createGroup = async (data) => {
  try {
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
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const groupData = await res.json();
      return groupData.code;
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
      return groupData.code;
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
      const groupData = await res.json();
      return groupData.code;
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

// Management People - Squads

export const getDataSquads = async () => {
  try {
    const res = await fetch(
      URLAPI + "/api/v1/management-people/squads/getSquads",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        cache: "no-store",
      }
    );

    console.log(res);
    if (res.ok) {
      const SquadsData = await res.json();
      console.log(SquadsData);
      if (SquadsData.code === "OK") {
        return SquadsData.Squads;
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
          status: data.status,
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

export const updateSquad = async (data) => {
  try {
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
          status: data.status,
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