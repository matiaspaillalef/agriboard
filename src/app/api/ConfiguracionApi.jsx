import jwt from "jsonwebtoken";

const URLAPI = process.env.NEXT_PUBLIC_API_URL;
const APIKEY = process.env.NEXT_PUBLIC_JWT_SECRET;

const token = jwt.sign({ uid: "agrisoft" }, APIKEY, {
    expiresIn: 30000
});

export const getDataUser = async () => {
    try {

        /*const token = jwt.sign({ uid: "agrisoft" }, APIKEY, {
            expiresIn: 30000
        });*/

        const res = await fetch(URLAPI + '/api/v1/configuracion/usuarios/getUsuarios', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'x-api-key' : token
              },
            cache: 'no-store'
        });
        
        
        if (res.ok) {
            const userData = await res.json();

            if (userData.code === 'OK') {
           
                return userData.usuarios;
            }
        }

    } catch (err) {
        console.error(err);
    }
}

export const deleteUser = async (idUser) => {
    try {
                

        const res = await fetch(URLAPI + '/api/v1/configuracion/usuarios/eliminarUsuarios', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'x-api-key' : token
            },
            body: JSON.stringify({
                id: idUser
            }),
            cache: 'no-store'
        });
        
        if (res.ok) {
        
            const userData = await res.json();
    
            return userData.code;

        }

    } catch (err) {
        console.error(err);
    }
}
export const createUser = async (data) => {
    try {

        const res = await fetch(URLAPI + '/api/v1/configuracion/usuarios/crearUsuarios', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'x-api-key' : token
              },
            body: JSON.stringify({
                name: data.name,
                lastName: data.lastName,
                userEmail: data.userEmail,
                menuRol: 1,
                userPassword: data.userPassword,
                menuState: 1,
            }),
            cache: 'no-store'
        });
        
        if (res.ok) {
        
            const userData = await res.json();
    
            return userData.code;

        }

    } catch (err) {
        console.error(err);
    }
}

export const updateUser = async (data) => {

    //console.log(data);
    try {
        
        const res = await fetch(URLAPI + '/api/v1/configuracion/usuarios/actualizarUsuarios', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'x-api-key' : token
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
            cache: 'no-store'
        });
        
        if (res.ok) {
        
            const userData = await res.json();
    
            return userData.code;

        }

    } catch (err) {
        console.error(err);
    }
}

export const getRoles = async () => {
    try {

        const token = jwt.sign({ uid: "agrisoft" }, process.env.JWT_SECRET, {
            expiresIn: 30000
        });

        const res = await fetch(URLAPI + '/api/v1/configuracion/usuarios/getRoles', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'x-api-key' : token
              },
            cache: 'no-store'
        });
        
        if (res.ok) {
        
            const userData = await res.json();
    
            if(userData.code == 'OK') {
    
                return userData.roles;
    
            }
        }

    } catch (err) {
        console.error(err);
    }
}

//Empresa

export const getDataCompanies = async () => {
    try {

        /*const token = jwt.sign({ uid: "agrisoft" }, APIKEY, {
            expiresIn: 30000
        });*/

        const res = await fetch(URLAPI + '/api/v1/configuracion/empresas/getEmpresas', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'x-api-key' : token
              },
            cache: 'no-store'
        });
        
        
        if (res.ok) {
            const companiesData = await res.json();

            if (companiesData.code === 'OK') {
           
                return companiesData.companies;
            }
        }

    } catch (err) {
        console.error(err);
    }
}



export const deleteCompany = async (id) => {
    try {
                

        const res = await fetch(URLAPI + '/api/v1/configuracion/empresas/deleteCompany', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'x-api-key' : token
            },
            body: JSON.stringify({
                id: id
            }),
            cache: 'no-store'
        });
        
        if (res.ok) {
        
            const companyData = await res.json();
    
            return companyData.code;

        }

    } catch (err) {
        console.error(err);
    }
}