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
      return  userData;

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
      return userData;

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
          lastname: data.lastname,
          mail: data.mail,
          id_rol: data.id_rol,
          password: data.password,
          id_state: data.id_state,
          id_company: data.id_company,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const userData = await res.json();
      return userData;
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
          id: data.id,
          name: data.name,
          lastname: data.lastname,
          mail: data.mail,
          id_rol: data.id_rol,
          password: data.password,
          id_state: data.id_state,
          id_company: data.id_company,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {

      const userData = await res.json();
      return userData

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
      else if (userData.code === "ERROR") {
        return userData.mensaje;
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
      return companiesData;
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
          logo: data.logo,
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
          system_representative_name: data.system_representative_name,
          system_representative_rut: data.system_representative_rut,
          system_representative_phone: data.system_representative_phone,
          system_representative_email: data.system_representative_email,
          status: data.status,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      
      const companyData = await res.json();
      return companyData;

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
          logo: data.logo,
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
          system_representative_name: data.system_representative_name,
          system_representative_rut: data.system_representative_rut,
          system_representative_phone: data.system_representative_phone,
          system_representative_email: data.system_representative_email,
          status: data.status,
        }),
        cache: "no-store",
      }
    );

    if (res.ok) {
      const companyData = await res.json();

      return companyData;

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
      return companyData;

    }
  } catch (err) {
    console.error(err);
  }
};







