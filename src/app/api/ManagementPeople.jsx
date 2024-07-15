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
        console.log("id_company" , id_company);
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