import jwt from "jsonwebtoken";

const URLAPI = process.env.NEXT_PUBLIC_API_CONFIG_URL;
const APIKEY = process.env.NEXT_PUBLIC_JWT_SECRET;

const token = jwt.sign({ uid: "agrisoft" }, APIKEY, {
    expiresIn: 30000
});

export const getDataUser = async () => {
    try {

        const token = jwt.sign({ uid: "agrisoft" }, process.env.JWT_SECRET, {
            expiresIn: 30000
        });

        const res = await fetch(URLAPI + '/api/v1/configuration/usuarios/getUsuarios', {
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
    
                return userData.usuarios;
    
            }
        }

    } catch (err) {
        console.error(err);
    }
}

export const deleteUser = async (idUser) => {
    try {
                

        const res = await fetch(URLAPI + '/api/v1/configuration/usuarios/deleteUser', {
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

        const res = await fetch(URLAPI + '/api/v1/configuration/usuarios/createUser', {
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
    try {
        
        const res = await fetch(URLAPI + '/api/v1/configuration/usuarios/updateUser', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'x-api-key' : token
              },
            body: JSON.stringify({
                id: data.id,
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

        const res = await fetch(URLAPI + '/api/v1/configuration/usuarios/getRoles', {
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