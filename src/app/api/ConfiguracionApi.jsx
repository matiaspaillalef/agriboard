import jwt from "jsonwebtoken";

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

// Contractors - Positions

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

    console.log(res);

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
