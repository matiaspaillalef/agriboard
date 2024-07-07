import jwt from "jsonwebtoken";

const URLAPI = process.env.NEXT_PUBLIC_API_URL;
const APIKEY = process.env.NEXT_PUBLIC_JWT_SECRET;

const token = jwt.sign({ uid: "agrisoft" }, APIKEY, {
  expiresIn: 30000,
});

export const auth = async (usr,pass) => {
    try {

        // En producción, realizar la llamada a la API real
        const res = await fetch(URLAPI + '/api/v1/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                usuario: usr,
                password: pass,
            }),
        });

        if (res.ok) {
        
            const userData = await res.json();

            return userData;

        }else {

            sessionStorage.clear();
            const errorData = await res.json();
            setError(errorData.error);
            console.error("Error al iniciar sesión:", res.status);

          }

    } catch (err) {
        console.error(err);
    }
}

export const menu = async (id_company) => {
    try {
        const res = await fetch(`${URLAPI}/api/v1/getMenubyRol/${id_company}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": token,
            },
            cache: "no-store",
        });

        if (res.ok) {
            const menuData = await res.json();
            if (menuData.code === "OK") {
                return menuData.menus;
            } else {
                throw new Error(menuData.message || "Error al obtener los datos del menú.");
            }
        } else {
            throw new Error("Error en la solicitud al servidor.");
        }
    } catch (err) {
        console.error("Error en la función menu:", err);
        throw err; // Propaga el error para manejarlo en el componente React
    }
};
