
const URLAPI = process.env.NEXT_PUBLIC_API_URL;

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