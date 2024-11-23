import { Router } from 'express'
const router = Router()
//import Usuario from '../models/usuario.model.js'
import validateToken from '../middleware/validateToken.js'
import mysql from 'mysql';
import bcrypt from 'bcrypt';

//Management People - Positions

router.get('/management-people/positions/getPositions/:companyID', validateToken, (req, res) => {
    /*  
        #swagger.tags = ['Management People - Positions']

        #swagger.security = [{
               "apiKeyAuth": []
        }]

        #swagger.parameters['companyID'] = {
            in: 'path',
            required: true,
            type: "integer",
        } 
        
        #swagger.responses[200] = {
            schema: {
                "code": "OK",
                "id": 1,
                "name": "Harvesters",
                "status": 1
            }
        } 
    */
    try {

        var positions = [];
        let { companyID } = req.params;
        //console.log("aqui", companyID);

        var mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

        mysqlConn.connect(function (err) {

            if (err) {

                console.error('error connecting: ' + err.sqlMessage);
                const jsonResult = {
                    "code": "ERROR",
                    "mensaje": err.sqlMessage
                }
                res.json(jsonResult);

            }
            else {

                var queryString = "SELECT * FROM positions where id_company = " + companyID;

                ////console.log(queryString);
                mysqlConn.query(queryString, function (error, results, fields) {

                    if (error) {

                        console.error('error ejecutando query: ' + error.sqlMessage);
                        const jsonResult = {
                            "code": "ERROR",
                            "mensaje": error.sqlMessage
                        }

                        res.json(jsonResult);

                    } else {

                        if (results && results.length > 0) {

                            results.forEach(element => {

                                const jsonResult = {
                                    "id": element.id,
                                    "name": element.name,
                                    "status": element.status,
                                };

                                positions.push(jsonResult);

                            });

                            const jsonResult = {
                                "code": "OK",
                                "positions": positions
                            }

                            res.json(jsonResult);

                        } else {

                            const jsonResult = {
                                "code": "ERROR",
                                "mensaje": "No se encontraron registros"
                            }

                            res.json(jsonResult);

                        }
                    }
                });

                mysqlConn.end();

            }
        });

    } catch (e) {
        console.log(e);
        res.json({ error: e })
    }
});

router.post('/management-people/positions/createPosition', validateToken, (req, res) => {
    /*
        #swagger.tags = ['Management People - Positions']
        #swagger.security = [{
            "apiKeyAuth": []
        }]
        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Create Position',
            required: true,
            schema: {name: "Harvesters", status: 1, company_id: 1}
        }
        #swagger.responses[200] = {
            schema: {
                "code": "OK",
                "mensaje": "Registro creado"
            }
        }
    */
    const { name, status, company_id } = req.body;

    if (!name || !status || !company_id) {
        return res.status(400).json({
            code: "ERROR",
            mensaje: "Faltan datos requeridos"
        });
    }

    // Conectar a la base de datos
    const mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

    mysqlConn.connect(function (err) {
        if (err) {
            console.error('Error connecting: ' + err.message);
            return res.status(500).json({
                code: "ERROR",
                mensaje: err.message
            });
        }

        // Verificar si ya existe una posición con el mismo nombre para la misma compañía
        const checkNameQuery = "SELECT id FROM positions WHERE name = ? AND id_company = ?";
        mysqlConn.query(checkNameQuery, [name, company_id], (error, results) => {
            if (error) {
                console.error('Error checking name: ' + error.message);
                mysqlConn.end();
                return res.status(500).json({
                    code: 'ERROR',
                    mensaje: 'Error al verificar el nombre: ' + error.message
                });
            }

            if (results.length > 0) {
                mysqlConn.end();
                return res.status(400).json({
                    code: 'ERROR',
                    mensaje: 'El nombre de la posición ya existe para esta compañía.'
                });
            }

            // Insertar la nueva posición
            const insertQuery = "INSERT INTO positions (name, status, id_company) VALUES (?, ?, ?)";
            mysqlConn.query(insertQuery, [name, status, company_id], (insertError, insertResults) => {
                mysqlConn.end();

                if (insertError) {
                    console.error('Error executing insert query: ' + insertError.message);
                    return res.status(500).json({
                        code: 'ERROR',
                        mensaje: 'Error al crear la posición: ' + insertError.message
                    });
                }

                if (insertResults.insertId) {
                    return res.status(200).json({
                        code: 'OK',
                        mensaje: 'Registro creado correctamente.'
                    });
                } else {
                    return res.status(500).json({
                        code: 'ERROR',
                        mensaje: 'No se pudo crear el registro.'
                    });
                }
            });
        });
    });
});

router.post('/management-people/positions/updatePosition', validateToken, (req, res) => {
    /*  
        #swagger.tags = ['Management People - Positions']

        #swagger.security = [{
               "apiKeyAuth": []
        }]
        
        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Update Position',
            required: true,
            schema: {id: 1, name: "Harvesters", status: 1}
        }
        
        #swagger.responses[200] = {
            schema: {
                "code": "OK",
                "mensaje": "Registro actualizado correctamente."
            }
        } 
    */
    try {

        const { id, name, status } = req.body;
        var mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

        mysqlConn.connect(function (err) {

            if (err) {

                console.error('error connecting: ' + err.sqlMessage);

                const jsonResult = {
                    "code": "ERROR",
                    "mensaje": err.sqlMessage
                }

                res.json(jsonResult);

            } else {

                var queryString = "UPDATE positions SET name = '" + name + "', status = " + status + " WHERE id = " + id;

                mysqlConn.query(queryString, function (error, results, fields) {

                    if (error) {

                        console.error('error ejecutando query: ' + error.sqlMessage);

                        const jsonResult = {
                            "code": "ERROR",
                            "mensaje": error.sqlMessage
                        }

                        res.json(jsonResult);

                    } else {

                        if (results && results.affectedRows != 0) {

                            const jsonResult = {
                                "code": "OK",
                                "mensaje": "Registro actualizado correctamente."
                            }

                            res.json(jsonResult);

                        } else {

                            const jsonResult = {
                                "code": "ERROR",
                                "mensaje": "No se pudo actualizar el registro."
                            }

                            res.json(jsonResult);
                        }

                    }
                });

                mysqlConn.end();

            }
        });

    } catch (e) {
        console.log(e);
        res.json({ error: e })
    }
});

router.post('/management-people/positions/deletePosition', validateToken, (req, res) => {
    /*  
        #swagger.tags = ['Management People - Positions']

        #swagger.security = [{
               "apiKeyAuth": []
        }]
        
       #swagger.parameters['obj'] = {
            in: 'body',
            schema: {
                id: 1,
            }
        }  
        
        #swagger.responses[200] = {
            schema: {
                "code": "OK",
                "mensaje": "Registro eliminado"
            }
        } 
    */
    try {

        let { id } = req.body;

        console.log(id);

        var mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

        mysqlConn.connect(function (err) {

            if (err) {

                console.error('error connecting: ' + err.sqlMessage);
                const jsonResult = {
                    "code": "ERROR",
                    "mensaje": err.sqlMessage
                }
                res.json(jsonResult);

            }
            else {

                var queryString = "DELETE FROM positions WHERE id = " + id;

                ////console.log(queryString);
                mysqlConn.query(queryString, function (error, results, fields) {

                    if (error) {

                        console.error('error ejecutando query: ' + error.sqlMessage);
                        const jsonResult = {
                            "code": "ERROR",
                            "mensaje": error.sqlMessage
                        }
                        res.json(jsonResult);

                    }
                    else {

                        if (results && results.affectedRows == 1) {

                            const jsonResult = {
                                "code": "OK",
                                "companies": "Registro eliminado."
                            }

                            res.json(jsonResult);

                        } else {

                            const jsonResult = {
                                "code": "ERROR",
                                "mensaje": "No se pudo eliminar el registro ."
                            }

                            res.json(jsonResult);

                        }
                    }
                });

                mysqlConn.end();

            }
        });

    } catch (e) {
        console.log(e);
        res.json({ error: e })
    }
});


//Management People - Contractors
router.get('/management-people/contractors/getContractors/:companyID', validateToken, (req, res) => {
    /*  
        #swagger.tags = ['Management People - Contractors']

        #swagger.security = [{
               "apiKeyAuth": []
        }]

        #swagger.parameters['companyID'] = {
            in: 'path',
            required: true,
            type: "integer",
        }  
        
        #swagger.responses[200] = {
            schema: {
                "code": "OK",
                "id": 1,
                "rut": "12345678-9",
                "name": "Juan",
                "lastname": "Perez",
                "giro": "Agricultura",
                "phone": "12345678",
                "email": "mail@mail.com",
                "state": "Maule",
                "city": "Talca",
                "status": 1
            }
        } 
    */
    try {

        let { companyID } = req.params;
        var contractors = [];
        //console.log("aqui", companyID);

        var mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

        mysqlConn.connect(function (err) {

            if (err) {

                console.error('error connecting: ' + err.sqlMessage);
                const jsonResult = {
                    "code": "ERROR",
                    "mensaje": err.sqlMessage
                }
                res.json(jsonResult);

            }
            else {

                var queryString = "SELECT * FROM contractors where id_company = " + companyID;

                mysqlConn.query(queryString, function (error, results, fields) {

                    if (error) {

                        console.error('error ejecutando query: ' + error.sqlMessage);
                        const jsonResult = {
                            "code": "ERROR",
                            "mensaje": error.sqlMessage
                        };

                        res.json(jsonResult);

                    } else {

                        if (results && results.length > 0) {
                            //console.log("1");
                            results.forEach(element => {
                                const jsonResult = {
                                    "id": element.id,
                                    "rut": element.rut,
                                    "name": element.name,
                                    "lastname": element.lastname,
                                    "giro": element.giro,
                                    "phone": element.phone,
                                    "email": element.email,
                                    "state": element.state,
                                    "city": element.city,
                                    "status": element.status,
                                };
                                contractors.push(jsonResult);
                            });
                            //console.log("2");
                            const jsonResult = {
                                "code": "OK",
                                "contractors": contractors
                            }
                            //console.log(jsonResult);
                            res.json(jsonResult);

                        }
                        else {
                            const jsonResult = {
                                "code": "ERROR",
                                "mensaje": "No se encontraron registros"
                            }
                            res.json(jsonResult);
                        }

                    }
                });

                mysqlConn.end();

            }
        });

    } catch (e) {
        console.log(e);
        res.json({ error: e })
    }
}

);

router.post('/management-people/contractors/createContractor', validateToken, (req, res) => {
    /*  
        #swagger.tags = ['Management People - Contractors']

        #swagger.security = [{
               "apiKeyAuth": []
        }]
        
        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Create Contractor',
            required: true,
            schema: {rut: "12345678-9", name: "Juan", lastname: "Perez", giro: "Agricultura", phone: "12345678", email: "contacto@mail.com", state: "Maule", city: "Talca", status: 1, idCompany: 1}
        }

        #swagger.responses[200] = {
            schema: {
                "code": "OK",
                "mensaje": "Contratista creado correctamente."
            }
        }
    */

    try {

        const { rut, name, lastname, giro, phone, email, state, city, status, idCompany } = req.body;

        var mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

        mysqlConn.connect(function (err) {

            if (err) {

                console.error('error connecting: ' + err.sqlMessage);
                const jsonResult = {
                    "code": "ERROR",
                    "mensaje": err.sqlMessage
                }
                res.json(jsonResult);

            }
            else {

                //valido que contratista no exista

                var queryString = "select * from contractors u where rut='" + rut + "' and id_company = " + idCompany;

                mysqlConn.query(queryString, function (error, results, fields) {


                    if (error) {

                        console.error('error ejecutando query: ' + error.sqlMessage);
                        const jsonResult = {
                            "code": "ERROR",
                            "mensaje": error.sqlMessage
                        }
                        res.json(jsonResult);

                    }
                    else {

                        if (results && results.length > 0) {

                            const jsonResult = {
                                "code": "ERROR",
                                "mensaje": "El contratista " + rut + " ya existe en el sistema."
                            }

                            res.json(jsonResult);

                        }
                        else {

                            var queryString = "INSERT INTO contractors (rut, name, lastname, giro, phone, email, state, city, status , id_company) VALUES ('" + rut + "', '" + name + "', '" + lastname + "', '" + giro + "', '" + phone + "', '" + email + "', '" + state + "', '" + city + "', " + status + "," + idCompany + ")";

                            mysqlConn.query(queryString, function (error, resultsInsert, fields) {

                                if (error) {

                                    console.error('error ejecutando query: ' + error.sqlMessage);
                                    const jsonResult = {
                                        "code": "ERROR",
                                        "mensaje": error.sqlMessage
                                    }
                                    res.json(jsonResult);

                                }
                                else {

                                    if (resultsInsert.insertId != 0) {

                                        const jsonResult = {
                                            "code": "OK",
                                            "usuarios": "Contratista creado correctamente."
                                        }
                                        res.json(jsonResult);

                                    } else {

                                        const jsonResult = {
                                            "code": "ERROR",
                                            "mensaje": "no se pudo crear el Contratista seleccionado."
                                        }
                                        res.json(jsonResult);

                                    }
                                }
                            });
                        }
                    }
                });

            }
        });

    } catch (e) {
        console.log(e);
        res.json({ error: e })
    }
});

router.post('/management-people/contractors/updateContractor', validateToken, (req, res) => {
    /*  
        #swagger.tags = ['Management People - Contractors']

        #swagger.security = [{
               "apiKeyAuth": []
        }]
        
        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Update Contractor',
            required: true,
            schema: {id: 1, rut: "12345678-9", name: "Juan", lastname: "Perez", giro: "Agricultura", phone: "12345678", email: "contacto@mail.com", state: "Maule", city: "Talca", status: 1}
        }

        #swagger.responses[200] = {
            schema: {
                "code": "OK",
                "mensaje": "Registro actualizado"
            }
        }
    */

    try {

        const { id, rut, name, lastname, giro, phone, email, state, city, status } = req.body;

        var mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

        mysqlConn.connect(function (err) {

            if (err) {

                console.error('error connecting: ' + err.sqlMessage);
                const jsonResult = {
                    "code": "ERROR",
                    "mensaje": err.sqlMessage
                }
                res.json(jsonResult);

            }
            else {

                var queryString = "UPDATE contractors SET rut = '" + rut + "', name = '" + name + "', lastname = '" + lastname + "', giro = '" + giro + "', phone = '" + phone + "', email = '" + email + "', state = '" + state + "', city = '" + city + "', status = " + status + " WHERE id = " + id;

                ////console.log(queryString);
                mysqlConn.query(queryString, function (error, results, fields) {

                    if (error) {

                        console.error('error ejecutando query: ' + error.sqlMessage);
                        const jsonResult = {
                            "code": "ERROR",
                            "mensaje": error.sqlMessage
                        }
                        res.json(jsonResult);

                    }
                    else {

                        if (results && results.affectedRows != 0) {

                            const jsonResult = {
                                "code": "OK",
                                "mensaje": "contratista actualizado correctamente."
                            }

                            res.json(jsonResult);

                        } else {

                            const jsonResult = {
                                "code": "ERROR",
                                "mensaje": "No se pudo actualizar contratista seleccionado."
                            }

                            res.json(jsonResult);
                        }
                    }
                });

                mysqlConn.end();

            }
        });

    } catch (e) {
        console.log(e);
        res.json({ error: e })
    }
});

router.post('/management-people/contractors/deleteContractor', validateToken, (req, res) => {
    /*  
        #swagger.tags = ['Management People - Contractors']

        #swagger.security = [{
               "apiKeyAuth": []
        }]
        
       #swagger.parameters['obj'] = {
            in: 'body',
            schema: {
                id: 1
            }
        }  
        
        #swagger.responses[200] = {
            schema: {
                "code": "OK",
                "mensaje": "Registro eliminado"
            }
        } 
    */
    try {

        let { id } = req.body;

        console.log(id);

        var mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

        mysqlConn.connect(function (err) {

            if (err) {

                console.error('error connecting: ' + err.sqlMessage);
                const jsonResult = {
                    "code": "ERROR",
                    "mensaje": err.sqlMessage
                }
                res.json(jsonResult);

            } else {

                var queryString = "DELETE FROM contractors WHERE id = " + id;

                mysqlConn.query(queryString, function (error, results, fields) {

                    if (error) {

                        console.error('error ejecutando query: ' + error.sqlMessage);
                        const jsonResult = {
                            "code": "ERROR",
                            "mensaje": error.sqlMessage
                        }
                        res.json(jsonResult);

                    }
                    else {

                        if (results && results.affectedRows == 1) {

                            const jsonResult = {
                                "code": "OK",
                                "companies": "contratista eliminada correctamente."
                            }

                            res.json(jsonResult);

                        } else {

                            const jsonResult = {
                                "code": "ERROR",
                                "mensaje": "no se pudo eliminar al contratista seleccionado."
                            }

                            res.json(jsonResult);

                        }
                    }
                });

                mysqlConn.end();

            }
        });

    } catch (e) {
        console.log(e);
        res.json({ error: e })
    }
});


//Management People - Groups

//Alert , la palabra groups, est una palabra reservada de MYSQL, por lo que se debe usar comillas invertidas para que no de error

router.get('/management-people/groups/getGroups/:companyID', validateToken, (req, res) => {
    /*  
        #swagger.tags = ['Management People - Groups']

        #swagger.security = [{
               "apiKeyAuth": []
        }]

        #swagger.parameters['companyID'] = {
            in: 'path',
            required: true,
            type: "integer",
        }  
        
        #swagger.responses[200] = {
            schema: {
                "code": "OK",
                "id": 1,
                "name": "Grupo 1",
                "status": 1
            }
        } 
    */
    try {

        var groups = [];
        let { companyID } = req.params;

        var mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

        mysqlConn.connect(function (err) {

            if (err) {

                console.error('error connecting: ' + err.sqlMessage);
                const jsonResult = {
                    "code": "ERROR",
                    "mensaje": err.sqlMessage
                }
                res.json(jsonResult);

            } else {

                var queryString = "SELECT * FROM `groups` g where id_company = " + companyID;
                //console.log(queryString);

                mysqlConn.query(queryString, function (error, results, fields) {


                    mysqlConn.end((err) => {
                        if (err) {
                            console.error('Error al cerrar la conexión:', err);
                        } else {
                            console.log('Conexión cerrada correctamente.');
                        }
                    });

                    if (error) {

                        console.error('error ejecutando query: ' + error.sqlMessage);
                        const jsonResult = {
                            "code": "ERROR",
                            "mensaje": error.sqlMessage
                        }
                        res.json(jsonResult);

                        //console.log(jsonResult);

                    } else {

                        if (results && results.length > 0) {

                            results.forEach(element => {
                                const jsonResult = {
                                    "id": element.id,
                                    "name": element.name,
                                    "status": element.status,
                                };

                                groups.push(jsonResult);

                            });

                            const jsonResult = {
                                "code": "OK",
                                "groups": groups
                            }

                            res.json(jsonResult);

                        } else {

                            const jsonResult = {
                                "code": "ERROR",
                                "mensaje": "No se encontraron registros"
                            }

                            res.json(jsonResult);
                        }
                    }
                });
            }
        });
    } catch (e) {
        console.log(e);
        res.json({ error: e })

        if (mysqlConn) {

            mysqlConn.end((err) => {
                if (err) {
                    console.error('Error al cerrar la conexión:', err);
                } else {
                    console.log('Conexión cerrada correctamente.');
                }
            });
        }
    }
});

router.post('/management-people/groups/createGroup', validateToken, (req, res) => {
    /*  
        #swagger.tags = ['Management People - Groups']
        #swagger.security = [{
            "apiKeyAuth": []
        }]
        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Create Group',
            required: true,
            schema: {name: "Grupo 1", status: 1, idCompany: 1}
        }
        #swagger.responses[200] = {
            schema: {
                "code": "OK",
                "mensaje": "Registro creado"
            }
        } 
    */
    try {
        const { name, status, id_company } = req.body;

        // Verifica si los parámetros están presentes
        if (!name || !status || !id_company) {

            const jsonResult = {
                "code": "ERROR",
                "mensaje": "Faltan parámetros requeridos"
            }

            res.json(jsonResult);
        }

        // Convierte los valores a enteros
        const numericStatus = parseInt(status, 10);
        const numericIdCompany = parseInt(id_company, 10);

        if (isNaN(numericStatus) || isNaN(numericIdCompany)) {

            const jsonResult = {
                "code": "ERROR",
                "mensaje": "El status o id_company no son números válidos"
            }
            res.json(jsonResult);

        }

        // Crea la conexión a la base de datos
        const mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

        mysqlConn.connect(function (err) {

            if (err) {

                console.error('error connecting: ' + err.sqlMessage);
                const jsonResult = {
                    "code": "ERROR",
                    "mensaje": err.sqlMessage
                }
                res.json(jsonResult);

            }
            else {

                // Verifica si ya existe un grupo con el mismo nombre y id_company
                const checkQueryString = "SELECT * FROM `groups` WHERE name = ? AND id_company = ?";

                mysqlConn.query(checkQueryString, [name, numericIdCompany], (checkError, checkResults) => {

                    if (checkError) {

                        console.error('Error executing check query: ' + checkError.message);

                        const jsonResult = {
                            "code": "ERROR",
                            "mensaje": checkError.sqlMessage
                        }

                        mysqlConn.end((err) => {

                            if (err) {
                                console.error('Error al cerrar la conexión:', err);
                            } else {
                                console.log('Conexión cerrada correctamente.');
                            }

                        });

                        res.json(jsonResult);

                    } else {


                        // Si ya existe, retorna un mensaje de error
                        if (checkResults.length > 0) {

                            const jsonResult = {
                                "code": "ERROR",
                                "mensaje": "Ya existe un grupo con ese nombre para esta compañía."
                            }

                            mysqlConn.end((err) => {
                                if (err) {
                                    console.error('Error al cerrar la conexión:', err);
                                } else {
                                    console.log('Conexión cerrada correctamente.');
                                }
                            });

                            res.json(jsonResult);

                        } else {

                            // Define la consulta SQL para crear el grupo
                            const queryString = "INSERT INTO `groups` (name, status, id_company) VALUES (?, ?, ?)";
                            const queryParams = [name, numericStatus, numericIdCompany];

                            // Ejecuta la consulta para crear el grupo
                            mysqlConn.query(queryString, queryParams, (error, resultsInsert) => {

                                mysqlConn.end((err) => {

                                    if (err) {
                                        console.error('Error al cerrar la conexión:', err);
                                    } else {
                                        console.log('Conexión cerrada correctamente.');
                                    }

                                });

                                if (error) {

                                    console.error('error ejecutando query: ' + error.sqlMessage);
                                    const jsonResult = {
                                        "code": "ERROR",
                                        "mensaje": error.sqlMessage
                                    }
                                    res.json(jsonResult);

                                } else {

                                    if (resultsInsert.insertId != 0) {

                                        const jsonResult = {
                                            "code": "OK",
                                            "mensaje": "Registro creado correctamente."
                                        }
                                        res.json(jsonResult);

                                    } else {

                                        const jsonResult = {
                                            "code": "ERROR",
                                            "mensaje": "No se pudo crear el Registro seleccionado."
                                        }
                                        res.json(jsonResult);

                                    }

                                }
                            });
                        }
                    }
                });
            }
        });

    } catch (e) {

        console.log(e);
        res.json({ error: e })

        if (mysqlConn) {

            mysqlConn.end((err) => {
                if (err) {
                    console.error('Error al cerrar la conexión:', err);
                } else {
                    console.log('Conexión cerrada correctamente.');
                }
            });
        }
    }
});

router.post('/management-people/groups/updateGroup', validateToken, (req, res) => {
    /*  
        #swagger.tags = ['Management People - Groups']
        #swagger.security = [{
            "apiKeyAuth": []
        }]
        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Update Group',
            required: true,
            schema: {id: 1, name: "Grupo 1", status: 1, company_id: 1}
        }
        #swagger.responses[200] = {
            schema: {
                "code": "OK",
                "mensaje": "Registro actualizado"
            }
        } 
    */
    try {
        const { id, name, status, id_company } = req.body;

        // Verifica si los parámetros necesarios están presentes
        if (!id || !name || status === undefined || !id_company) {

            console.error('error connecting: ' + err.sqlMessage);
            const jsonResult = {
                "code": "ERROR",
                "mensaje": "Faltan parámetros requeridos"
            }
            res.json(jsonResult);
        }

        // Convierte el `status` a un entero
        const numericStatus = parseInt(status, 10);

        if (isNaN(numericStatus)) {

            const jsonResult = {
                "code": "ERROR",
                "mensaje": "El status no es un número válido"
            }
            res.json(jsonResult);

        }

        // Crea la conexión a la base de datos
        const mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

        mysqlConn.connect(function (err) {

            if (err) {

                console.error('error connecting: ' + err.sqlMessage);
                const jsonResult = {
                    "code": "ERROR",
                    "mensaje": err.sqlMessage
                }

                res.json(jsonResult);

            }

            // Verifica si ya existe un grupo con el mismo nombre y id_company, excluyendo el grupo que se está editando
            const checkQueryString = "SELECT * FROM `groups` WHERE name = ? AND id_company = ? AND id != ?";
            mysqlConn.query(checkQueryString, [name, id_company, id], (checkError, checkResults) => {

                if (checkError) {

                    console.error('error ejecutando query: ' + checkError.sqlMessage);
                    const jsonResult = {
                        "code": "ERROR",
                        "mensaje": checkError.sqlMessage
                    }

                    mysqlConn.end((err) => {
                        if (err) {
                            console.error('Error al cerrar la conexión:', err);
                        } else {
                            console.log('Conexión cerrada correctamente.');
                        }
                    });

                    res.json(jsonResult);

                } else {

                    // Si ya existe, retorna un mensaje de error
                    if (checkResults.length > 0) {

                        const jsonResult = {
                            "code": "ERROR",
                            "mensaje": "Ya existe un grupo con ese nombre para esta compañía."
                        }

                        mysqlConn.end((err) => {
                            if (err) {
                                console.error('Error al cerrar la conexión:', err);
                            } else {
                                console.log('Conexión cerrada correctamente.');
                            }
                        });

                        res.json(jsonResult);

                    } else {

                        // Define la consulta SQL para actualizar el grupo
                        const queryString = "UPDATE `groups` SET name = ?, status = ?, id_company = ? WHERE id = ?";
                        const queryParams = [name, numericStatus, id_company, id];

                        // Ejecuta la consulta para actualizar el grupo
                        mysqlConn.query(queryString, queryParams, (error, resultsInsert) => {

                            mysqlConn.end((err) => {
                                if (err) {
                                    console.error('Error al cerrar la conexión:', err);
                                } else {
                                    console.log('Conexión cerrada correctamente.');
                                }
                            });


                            if (error) {

                                console.error('error ejecutando query: ' + error.sqlMessage);
                                const jsonResult = {
                                    "code": "ERROR",
                                    "mensaje": error.sqlMessage
                                }
                                res.json(jsonResult);

                            }
                            else {

                                if (resultsInsert.affectedRows != 0) {

                                    const jsonResult = {
                                        "code": "OK",
                                        "mensaje": "Registro actualizar correctamente."
                                    }
                                    res.json(jsonResult);

                                } else {

                                    const jsonResult = {
                                        "code": "ERROR",
                                        "mensaje": "No se pudo actualizar el Registro seleccionado."
                                    }
                                    res.json(jsonResult);

                                }
                            }
                        });
                    }
                }
            });
        });
    } catch (e) {

        console.log(e);
        res.json({ error: e })

        if (mysqlConn) {

            mysqlConn.end((err) => {
                if (err) {
                    console.error('Error al cerrar la conexión:', err);
                } else {
                    console.log('Conexión cerrada correctamente.');
                }
            });
        }
    }
});


router.post('/management-people/groups/deleteGroup', validateToken, (req, res) => {
    /*  
        #swagger.tags = ['Management People - Groups']

        #swagger.security = [{
               "apiKeyAuth": []
        }]
        
       #swagger.parameters['obj'] = {
            in: 'body',
            schema: {
                id: 1,
            }
        }  
        
        #swagger.responses[200] = {
            schema: {
                "code": "OK",
                "mensaje": "Registro eliminado"
            }
        } 
    */
    try {
        const { id } = req.body;

        // Asegúrate de que `id` es un número
        const groupId = parseInt(id, 10);

        if (isNaN(groupId)) {

            const jsonResult = {
                "code": "ERROR",
                "mensaje": "ID inválido"
            }

            res.json(jsonResult);
        }

        //console.log(`Deleting group with ID: ${groupId}`);

        const mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

        mysqlConn.connect(err => {
            if (err) {

                console.error('error connecting: ' + err.sqlMessage);
                const jsonResult = {
                    "code": "ERROR",
                    "mensaje": err.sqlMessage
                }
                res.json(jsonResult);

            } else {

                const queryString = "DELETE FROM `groups` WHERE id = ?";
                mysqlConn.query(queryString, [groupId], (error, results) => {

                    mysqlConn.end((err) => {

                        if (err) {
                            console.error('Error al cerrar la conexión:', err);
                        } else {
                            console.log('Conexión cerrada correctamente.');
                        }

                    });

                    if (error) {

                        console.error('Error executing query: ' + error.message);

                        const jsonResult = {
                            "code": "ERROR",
                            "mensaje": error.sqlMessage
                        }
                        res.json(jsonResult);

                    } else {

                        if (results.affectedRows > 0) {
                            const jsonResult = {
                                "code": "OK",
                                "mensaje": "Registro Eliminado correctamente."
                            }

                            res.json(jsonResult);

                        } else {

                            const jsonResult = {
                                "code": "OK",
                                "mensaje": "No se pudo eliminar el registro selecionado."
                            }

                            res.json(jsonResult);
                        }
                    }
                });
            }
        });
    } catch (e) {

        console.log(e);
        res.json({ error: e })

        if (mysqlConn) {

            mysqlConn.end((err) => {
                if (err) {
                    console.error('Error al cerrar la conexión:', err);
                } else {
                    console.log('Conexión cerrada correctamente.');
                }
            });
        }
    }
});


//Management People - Squads
router.get('/management-people/squads/getSquads/:companyID', validateToken, (req, res) => {
    /*  
        #swagger.tags = ['Management People - Squads']

        #swagger.security = [{
               "apiKeyAuth": []
        }]

        #swagger.parameters['companyID'] = {
            in: 'path',
            required: true,
            type: "integer",
        } 
        
        
        #swagger.responses[200] = {
            schema: {
                "code": "OK",
                "id": 1,
                "name": "cuadrilla 1",
                "group": 1,
                "status": 1
            }
        } 
    */
    try {
        let squads = [];
        let { companyID } = req.params;

        let mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

        mysqlConn.connect(function (err) {

            if (err) {

                console.error('error connecting: ' + err.sqlMessage);
                const jsonResult = {
                    "code": "ERROR",
                    "mensaje": err.sqlMessage
                }
                res.json(jsonResult);

            } else {

                let queryString = "SELECT * FROM squads where id_company = " + companyID;

                mysqlConn.query(queryString, function (error, results, fields) {

                    mysqlConn.end((err) => {
                        if (err) {
                            console.error('Error al cerrar la conexión:', err);
                        } else {
                            console.log('Conexión cerrada correctamente.');
                        }
                    });

                    if (error) {

                        console.error('error ejecutando query: ' + error.sqlMessage);
                        const jsonResult = {
                            "code": "ERROR",
                            "mensaje": error.sqlMessage
                        }
                        res.json(jsonResult);

                    } else {

                        if (results && results.length > 0) {

                            results.forEach(element => {

                                const jsonResult = {
                                    "id": element.id,
                                    "name": element.name,
                                    "group": element.id_group,
                                    "workers": element.workers,
                                    "status": element.status,
                                };

                                squads.push(jsonResult);

                            });

                            const jsonResult = {
                                "code": "OK",
                                "squads": squads
                            }

                            res.json(jsonResult);

                        } else {

                            const jsonResult = {
                                "code": "ERROR",
                                "mensaje": "No se encontraron registros"
                            }

                            res.json(jsonResult);
                        }

                    }
                });
            }
        });
    } catch (e) {

        console.log(e);
        res.json({ error: e })

        if (mysqlConn) {

            mysqlConn.end((err) => {
                if (err) {
                    console.error('Error al cerrar la conexión:', err);
                } else {
                    console.log('Conexión cerrada correctamente.');
                }
            });
        }
    }
});

router.post('/management-people/squads/createSquad', validateToken, (req, res) => {
    /*
        #swagger.tags = ['Management People - Squads']
        #swagger.security = [{
            "apiKeyAuth": []
        }]
        #swagger.parameters['obj'] = {
            in: 'body',
            schema: {
                name: "cuadrilla 1",
                group: 1,
                status: 1,
                idCompany: 1
            }
        }
        #swagger.responses[200] = {
            schema: {
                "code": "OK",
                "mensaje": "Registro creado"
            }
        }
    */

    try {
        const { name, group, status, idCompany } = req.body;

        //console.log('req.body:', req.body);

        // Crear conexión a la base de datos
        const mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

        mysqlConn.connect(function (err) {
            if (err) {

                console.error('error connecting: ' + err.sqlMessage);
                const jsonResult = {
                    "code": "ERROR",
                    "mensaje": err.sqlMessage
                }
                res.json(jsonResult);
            }
            else {

                // Paso 1: Verificar si ya existe un squad con el mismo nombre y company_id
                const checkQuery = `
                    SELECT COUNT(*) as count 
                    FROM squads 
                    WHERE LOWER(name) = LOWER(?) 
                    AND id_company = ?
                `;

                mysqlConn.query(checkQuery, [name, idCompany], function (checkError, checkResults) {

                    if (checkError) {

                        console.error('Error executing check query: ' + checkError.message);

                        const jsonResult = {
                            "code": "ERROR",
                            "mensaje": checkError.sqlMessage
                        }

                        mysqlConn.end((err) => {

                            if (err) {
                                console.error('Error al cerrar la conexión:', err);
                            } else {
                                console.log('Conexión cerrada correctamente.');
                            }

                        });

                        res.json(jsonResult);

                    } else {

                        // Si ya existe, respondemos con un error
                        if (checkResults[0].count > 0) {

                            const jsonResult = {
                                "code": "ERROR",
                                "mensaje": "Ya existe un cuadrilla con ese nombre para esta compañía."
                            }

                            mysqlConn.end((err) => {

                                if (err) {
                                    console.error('Error al cerrar la conexión:', err);
                                } else {
                                    console.log('Conexión cerrada correctamente.');
                                }

                            });

                            res.json(jsonResult);

                        } else {

                            // Paso 2: Si no hay duplicados, proceder con la inserción
                            const queryString = `
                                INSERT INTO squads (name, id_group, status, workers, id_company)
                                VALUES (?, ?, ?, '[]', ?)
                            `;

                            const groupValue = group ? group : null;

                            mysqlConn.query(queryString, [name, groupValue, status, idCompany], function (error, results) {

                                mysqlConn.end((err) => {

                                    if (err) {
                                        console.error('Error al cerrar la conexión:', err);
                                    } else {
                                        console.log('Conexión cerrada correctamente.');
                                    }

                                });

                                if (error) {

                                    console.error('error ejecutando query: ' + error.sqlMessage);
                                    const jsonResult = {
                                        "code": "ERROR",
                                        "mensaje": error.sqlMessage
                                    }
                                    res.json(jsonResult);

                                } else {

                                    if (results.insertId != 0) {

                                        const jsonResult = {
                                            "code": "OK",
                                            "mensaje": "Registro creado correctamente."
                                        }
                                        res.json(jsonResult);

                                    } else {

                                        const jsonResult = {
                                            "code": "ERROR",
                                            "mensaje": "No se pudo crear el Registro."
                                        }
                                        res.json(jsonResult);

                                    }

                                }
                            });
                        }
                    }
                });
            }
        });
    } catch (e) {

        console.log(e);
        res.json({ error: e })

        if (mysqlConn) {

            mysqlConn.end((err) => {
                if (err) {
                    console.error('Error al cerrar la conexión:', err);
                } else {
                    console.log('Conexión cerrada correctamente.');
                }
            });
        }
    }
});


router.post('/management-people/squads/updateSquad', validateToken, (req, res) => {
    /*
        #swagger.tags = ['Management People - Squads']
        #swagger.security = [{ "apiKeyAuth": [] }]
        #swagger.parameters['obj'] = {
            in: 'body',
            schema: {
                id: 3,
                name: 'a',
                group: '3',
                status: 1,
                workers: [2, 3, 49],
                company_id: 1
            }
        }
        #swagger.responses[200] = {
            schema: {
                "code": "OK",
                "mensaje": "Registro actualizado correctamente."
            }
        }
    */

    try {
        const { id, name, group, status, workers, company_id } = req.body;

        //console.log('req.body:', req.body);

        // Convertir workers a una cadena JSON
        const workersJson = JSON.stringify(workers);

        if ((group === undefined || group === '' || group === null)) {

            const jsonResult = {
                "code": "ERROR",
                "mensaje": "Faltan parámetros requeridos"
            }
            res.json(jsonResult);

        }

        var mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

        mysqlConn.connect(function (err) {

            if (err) {

                console.error('error connecting: ' + err.sqlMessage);
                const jsonResult = {
                    "code": "ERROR",
                    "mensaje": err.sqlMessage
                }

                res.json(jsonResult);

            }
            else {

                // Primero verificar si ya existe otro registro con el mismo nombre y company_id
                const checkQuery = `
                SELECT id FROM squads 
                WHERE name = ? AND id_company = ? AND id != ?`;

                mysqlConn.query(checkQuery, [name, company_id, id], function (checkError, checkResults) {

                    if (checkError) {

                        console.error('error ejecutando query: ' + checkError.sqlMessage);
                        const jsonResult = {
                            "code": "ERROR",
                            "mensaje": checkError.sqlMessage
                        }

                        mysqlConn.end((err) => {
                            if (err) {
                                console.error('Error al cerrar la conexión:', err);
                            } else {
                                console.log('Conexión cerrada correctamente.');
                            }
                        });

                        res.json(jsonResult);
                    }
                    else {

                        if (checkResults.length > 0) {

                            const jsonResult = {
                                "code": "ERROR",
                                "mensaje": "Ya existe un registro con ese nombre para esta compañía."
                            }

                            mysqlConn.end((err) => {
                                if (err) {
                                    console.error('Error al cerrar la conexión:', err);
                                } else {
                                    console.log('Conexión cerrada correctamente.');
                                }
                            });

                            res.json(jsonResult);
                        }
                        else {

                            // Si no existe, proceder a actualizar el registro
                            var queryString = `
                            UPDATE squads 
                            SET 
                                name = ?, 
                                id_group = ?, 
                                status = ?, 
                                workers = ? 
                            WHERE 
                                id = ?`;

                            mysqlConn.query(queryString, [name, group, status, workersJson, id], function (updateError, results) {

                                mysqlConn.end((err) => {
                                    if (err) {
                                        console.error('Error al cerrar la conexión:', err);
                                    } else {
                                        console.log('Conexión cerrada correctamente.');
                                    }
                                });

                                if (updateError) {

                                    console.error('error ejecutando query: ' + updateError.sqlMessage);
                                    const jsonResult = {
                                        "code": "ERROR",
                                        "mensaje": updateError.sqlMessage
                                    }
                                    res.json(jsonResult);

                                }
                                else {

                                    if (results.affectedRows != 0) {

                                        const jsonResult = {
                                            "code": "OK",
                                            "mensaje": "Registro actualizar correctamente."
                                        }
                                        res.json(jsonResult);

                                    } else {

                                        const jsonResult = {
                                            "code": "ERROR",
                                            "mensaje": "No se pudo actualizar el Registro seleccionado."
                                        }
                                        res.json(jsonResult);

                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    } catch (e) {

        console.log(e);
        res.json({ error: e })

        if (mysqlConn) {

            mysqlConn.end((err) => {
                if (err) {
                    console.error('Error al cerrar la conexión:', err);
                } else {
                    console.log('Conexión cerrada correctamente.');
                }
            });
        }
    }
});



router.post('/management-people/squads/deleteSquad', validateToken, (req, res) => {

    /*
        #swagger.tags = ['Management People - Squads']

        #swagger.security = [{
               "apiKeyAuth": []
        }]

        #swagger.parameters['obj'] = {
            in: 'body',
            schema: {
                id: 1,
            }
        }

        #swagger.responses[200] = {
            schema: {
                "code": "OK",
                "mensaje": "Registro eliminado"
            }
        }
    */

    try {
        let { id } = req.body;

        //console.log(id);

        var mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

        mysqlConn.connect(function (err) {
            if (err) {

                console.error('error connecting: ' + err.sqlMessage);
                const jsonResult = {
                    "code": "ERROR",
                    "mensaje": err.sqlMessage
                }
                res.json(jsonResult);
            }
            else {

                let queryString = "DELETE FROM squads WHERE id = ?";
                //console.log(queryString);

                mysqlConn.query(queryString, [id], function (error, results, fields) {

                    mysqlConn.end((err) => {

                        if (err) {
                            console.error('Error al cerrar la conexión:', err);
                        } else {
                            console.log('Conexión cerrada correctamente.');
                        }

                    });

                    if (error) {

                        console.error('Error executing query: ' + error.message);

                        const jsonResult = {
                            "code": "ERROR",
                            "mensaje": error.sqlMessage
                        }
                        res.json(jsonResult);

                    } else {

                        if (results.affectedRows > 0) {
                            const jsonResult = {
                                "code": "OK",
                                "mensaje": "Registro Eliminado correctamente."
                            }

                            res.json(jsonResult);

                        } else {

                            const jsonResult = {
                                "code": "OK",
                                "mensaje": "No se pudo eliminar el registro selecionado."
                            }

                            res.json(jsonResult);
                        }
                    }
                });
            }
        });
    } catch (e) {

        console.log(e);
        res.json({ error: e })

        if (mysqlConn) {

            mysqlConn.end((err) => {
                if (err) {
                    console.error('Error al cerrar la conexión:', err);
                } else {
                    console.log('Conexión cerrada correctamente.');
                }
            });
        }
    }
}

);



// Management People - Shifts

router.get('/management-people/shifts/getShifts/:companyID', validateToken, (req, res) => {
    /*  
        #swagger.tags = ['Management People - Shifts']

        #swagger.security = [{
               "apiKeyAuth": []
        }]

        
        #swagger.parameters['companyID'] = {
            in: 'path',
            required: true,
            type: "integer",
        }  
        
        #swagger.responses[200] = {
            schema: {
                "code": "OK",
                "shifts": [
                    {
                        "id": 1,
                        "name": "Mañana",
                        "monday_opening_time": "10:00:00",
                        "monday_closing_time": "12:00:00",
                        "tuesday_opening_time": "10:00:00",
                        "tuesday_closing_time": "12:00:00",
                        "wednesday_opening_time": "10:00:00",
                        "wednesday_closing_time": "12:00:00",
                        "thursday_opening_time": "10:00:00",
                        "thursday_closing_time": "12:00:00",
                        "friday_opening_time": "10:00:00",
                        "friday_closing_time": "12:00:00",
                        "saturday_opening_time": "10:00:00",
                        "saturday_closing_time": "12:00:00",
                        "sunday_opening_time": "10:00:00",
                        "sunday_closing_time": "12:00:00",
                        "status": 1
                    },
                    {
                        "id": 2,
                        "name": "Tarde",
                        "monday_opening_time": "14:00:00",
                        "monday_closing_time": "18:00:00",
                        "tuesday_opening_time": "14:00:00",
                        "tuesday_closing_time": "18:00:00",
                        "wednesday_opening_time": "14:00:00",
                        "wednesday_closing_time": "18:00:00",
                        "thursday_opening_time": "14:00:00",
                        "thursday_closing_time": "18:00:00",
                        "friday_opening_time": "14:00:00",
                        "friday_closing_time": "18:00:00",
                        "saturday_opening_time": "14:00:00",
                        "saturday_closing_time": "18:00:00",
                        "sunday_opening_time": "14:00:00",
                        "sunday_closing_time": "18:00:00",
                        "status": 1
                        },
                ]
            }
        } 
    */
    try {
        var shifts = [];
        let { companyID } = req.params;

        var mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

        mysqlConn.connect(function (err) {

            if (err) {

                console.error('error connecting: ' + err.sqlMessage);
                const jsonResult = {
                    "code": "ERROR",
                    "mensaje": err.sqlMessage
                }
                res.json(jsonResult);

            } else {

                var queryString = "SELECT id, name, monday_opening_time, monday_closing_time, tuesday_opening_time, tuesday_closing_time, wednesday_opening_time, wednesday_closing_time, thursday_opening_time, thursday_closing_time, friday_opening_time, friday_closing_time, saturday_opening_time, saturday_closing_time, sunday_opening_time, sunday_closing_time, status FROM shifts where id_company = " + companyID;
                //console.log(queryString);
                mysqlConn.query(queryString, function (error, results, fields) {

                    mysqlConn.end((err) => {
                        if (err) {
                            console.error('Error al cerrar la conexión:', err);
                        } else {
                            console.log('Conexión cerrada correctamente.');
                        }
                    });

                    if (error) {

                        console.error('Error ejecutando query: ' + error.sqlMessage);

                        const jsonResult = {
                            "code": "ERROR",
                            "mensaje": error.sqlMessage
                        }

                        res.json(jsonResult);

                    } else {

                        if (results && results.length > 0) {

                            results.forEach(element => {
                                const shift = {
                                    "id": element.id,
                                    "name": element.name,
                                    "monday_opening_time": element.monday_opening_time,
                                    "monday_closing_time": element.monday_closing_time,
                                    "tuesday_opening_time": element.tuesday_opening_time,
                                    "tuesday_closing_time": element.tuesday_closing_time,
                                    "wednesday_opening_time": element.wednesday_opening_time,
                                    "wednesday_closing_time": element.wednesday_closing_time,
                                    "thursday_opening_time": element.thursday_opening_time,
                                    "thursday_closing_time": element.thursday_closing_time,
                                    "friday_opening_time": element.friday_opening_time,
                                    "friday_closing_time": element.friday_closing_time,
                                    "saturday_opening_time": element.saturday_opening_time,
                                    "saturday_closing_time": element.saturday_closing_time,
                                    "sunday_opening_time": element.sunday_opening_time,
                                    "sunday_closing_time": element.sunday_closing_time,
                                    "status": element.status
                                };
                                shifts.push(shift);
                            });

                            const jsonResult = {
                                "code": "OK",
                                "shifts": shifts
                            }

                            res.json(jsonResult);

                        } else {

                            const jsonResult = {
                                "code": "ERROR",
                                "mensaje": "No se encontraron registros"
                            }

                            res.json(jsonResult);
                        }
                    }
                });
            }
        });
    } catch (e) {

        console.log(e);
        res.json({ error: e })

        if (mysqlConn) {

            mysqlConn.end((err) => {
                if (err) {
                    console.error('Error al cerrar la conexión:', err);
                } else {
                    console.log('Conexión cerrada correctamente.');
                }
            });
        }
    }
});

router.post('/management-people/shifts/createShift', validateToken, (req, res) => {
    /*  
        #swagger.tags = ['Management People - Shifts']

        #swagger.security = [{
               "apiKeyAuth": []
        }]
        
        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Crear Turno',
            required: true,
            schema: {
                name: "Mañana", 
                monday_opening_time: "08:00:00",
                monday_closing_time: "12:00:00",
                tuesday_opening_time: "08:00:00",
                tuesday_closing_time: "12:00:00",
                wednesday_opening_time: "08:00:00",
                wednesday_closing_time: "12:00:00",
                thursday_opening_time: "08:00:00",
                thursday_closing_time: "12:00:00",
                friday_opening_time: "08:00:00",
                friday_closing_time: "12:00:00",
                saturday_opening_time: "08:00:00",
                saturday_closing_time: "12:00:00",
                sunday_opening_time: "08:00:00",
                sunday_closing_time: "12:00:00",
                status: 1,
                id_company: 1
            }
        }
        
        #swagger.responses[200] = {
            schema: {
                "code": "OK",
                "mensaje": "Registro creado"
            }
        } 
    */
    try {
        const {
            name,
            monday_opening_time,
            monday_closing_time,
            tuesday_opening_time,
            tuesday_closing_time,
            wednesday_opening_time,
            wednesday_closing_time,
            thursday_opening_time,
            thursday_closing_time,
            friday_opening_time,
            friday_closing_time,
            saturday_opening_time,
            saturday_closing_time,
            sunday_opening_time,
            sunday_closing_time,
            status,
            id_company
        } = req.body;

        // Convertir valores vacíos a null
        const formatTime = (time) => time === "" ? null : time;

        const queryValues = [
            name,
            formatTime(monday_opening_time),
            formatTime(monday_closing_time),
            formatTime(tuesday_opening_time),
            formatTime(tuesday_closing_time),
            formatTime(wednesday_opening_time),
            formatTime(wednesday_closing_time),
            formatTime(thursday_opening_time),
            formatTime(thursday_closing_time),
            formatTime(friday_opening_time),
            formatTime(friday_closing_time),
            formatTime(saturday_opening_time),
            formatTime(saturday_closing_time),
            formatTime(sunday_opening_time),
            formatTime(sunday_closing_time),
            status,
            id_company
        ];

        var mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

        mysqlConn.connect(function (err) {

            if (err) {
                console.error('error connecting: ' + err.sqlMessage);
                const jsonResult = {
                    "code": "ERROR",
                    "mensaje": err.sqlMessage
                }
                res.json(jsonResult);
            }
            else {

                // Verifica si ya existe un turnos con el mismo nombre y id_company
                const checkQueryString = "SELECT * FROM `shifts` WHERE name = ? AND id_company = ?";

                mysqlConn.query(checkQueryString, [name, id_company], (checkError, checkResults) => {

                    if (checkError) {

                        console.error('Error executing check query: ' + checkError.message);

                        const jsonResult = {
                            "code": "ERROR",
                            "mensaje": checkError.sqlMessage
                        }

                        mysqlConn.end((err) => {

                            if (err) {
                                console.error('Error al cerrar la conexión:', err);
                            } else {
                                console.log('Conexión cerrada correctamente.');
                            }

                        });

                        res.json(jsonResult);

                    } else {

                        // Si ya existe, retorna un mensaje de error
                        if (checkResults.length > 0) {

                            const jsonResult = {
                                "code": "ERROR",
                                "mensaje": "Ya existe un registro con ese nombre para esta compañía."
                            }

                            mysqlConn.end((err) => {
                                if (err) {
                                    console.error('Error al cerrar la conexión:', err);
                                } else {
                                    console.log('Conexión cerrada correctamente.');
                                }
                            });

                            res.json(jsonResult);

                        } else {

                            var queryString = `
                            INSERT INTO shifts (
                                name,
                                monday_opening_time,
                                monday_closing_time,
                                tuesday_opening_time,
                                tuesday_closing_time,
                                wednesday_opening_time,
                                wednesday_closing_time,
                                thursday_opening_time,
                                thursday_closing_time,
                                friday_opening_time,
                                friday_closing_time,
                                saturday_opening_time,
                                saturday_closing_time,
                                sunday_opening_time,
                                sunday_closing_time,
                                status,
                                id_company
                            )
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                            mysqlConn.query(queryString, queryValues, function (error, resultsInsert) {

                                mysqlConn.end((err) => {

                                    if (err) {
                                        console.error('Error al cerrar la conexión:', err);
                                    } else {
                                        console.log('Conexión cerrada correctamente.');
                                    }

                                });

                                if (error) {

                                    console.error('error ejecutando query: ' + error.sqlMessage);
                                    const jsonResult = {
                                        "code": "ERROR",
                                        "mensaje": error.sqlMessage
                                    }
                                    res.json(jsonResult);

                                } else {

                                    if (resultsInsert.insertId != 0) {

                                        const jsonResult = {
                                            "code": "OK",
                                            "mensaje": "Registro creado correctamente."
                                        }
                                        res.json(jsonResult);

                                    } else {

                                        const jsonResult = {
                                            "code": "ERROR",
                                            "mensaje": "No se pudo crear el Registro seleccionado."
                                        }
                                        res.json(jsonResult);

                                    }

                                }
                            });
                        }
                    }
                });
            }
        });

    } catch (e) {

        console.log(e);
        res.json({ error: e })

        if (mysqlConn) {

            mysqlConn.end((err) => {
                if (err) {
                    console.error('Error al cerrar la conexión:', err);
                } else {
                    console.log('Conexión cerrada correctamente.');
                }
            });
        }
    }
});

router.post('/management-people/shifts/updateShift', validateToken, (req, res) => {
    /*  
        #swagger.tags = ['Management People - Shifts']

        #swagger.security = [{
               "apiKeyAuth": []
        }]
        
        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Actualizar Turno',
            required: true,
            schema: {
                id: 1, 
                name: "Mañana",
                monday_opening_time: "08:00:00",
                monday_closing_time: "12:00:00",
                tuesday_opening_time: "08:00:00",
                tuesday_closing_time: "12:00:00",
                wednesday_opening_time: "08:00:00",
                wednesday_closing_time: "12:00:00",
                thursday_opening_time: "08:00:00",
                thursday_closing_time: "12:00:00",
                friday_opening_time: "08:00:00",
                friday_closing_time: "12:00:00",
                saturday_opening_time: "08:00:00",
                saturday_closing_time: "12:00:00",
                sunday_opening_time: "08:00:00",
                sunday_closing_time: "12:00:00",
                status: 1,
                id_company: 1
            }
        }
        
        #swagger.responses[200] = {
            schema: {
                "code": "OK",
                "mensaje": "Registro actualizado"
            }
        } 
    */
    try {
        const {
            id,
            name,
            monday_opening_time,
            monday_closing_time,
            tuesday_opening_time,
            tuesday_closing_time,
            wednesday_opening_time,
            wednesday_closing_time,
            thursday_opening_time,
            thursday_closing_time,
            friday_opening_time,
            friday_closing_time,
            saturday_opening_time,
            saturday_closing_time,
            sunday_opening_time,
            sunday_closing_time,
            status,
            id_company
        } = req.body;

        console.log('req.body:', req.body);

        // Convertir valores vacíos a null
        const formatTime = (time) => time === "" ? null : time;

        const queryValues = [
            name,
            formatTime(monday_opening_time),
            formatTime(monday_closing_time),
            formatTime(tuesday_opening_time),
            formatTime(tuesday_closing_time),
            formatTime(wednesday_opening_time),
            formatTime(wednesday_closing_time),
            formatTime(thursday_opening_time),
            formatTime(thursday_closing_time),
            formatTime(friday_opening_time),
            formatTime(friday_closing_time),
            formatTime(saturday_opening_time),
            formatTime(saturday_closing_time),
            formatTime(sunday_opening_time),
            formatTime(sunday_closing_time),
            status,
            id_company,
            id
        ];

        var mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

        mysqlConn.connect((err) => {

            if (err) {

                console.error('error connecting: ' + err.sqlMessage);
                const jsonResult = {
                    "code": "ERROR",
                    "mensaje": err.sqlMessage
                }

                res.json(jsonResult);

            }
            else {

                // Verifica si ya existe un grupo con el mismo nombre y id_company, excluyendo el grupo que se está editando
                const checkQueryString = "SELECT * FROM `shifts` WHERE name = ? AND id_company = ? AND id != ?";
                mysqlConn.query(checkQueryString, [name, id_company, id], (checkError, checkResults) => {

                    if (checkError) {

                        console.error('error ejecutando query: ' + checkError.sqlMessage);
                        const jsonResult = {
                            "code": "ERROR",
                            "mensaje": checkError.sqlMessage
                        }

                        mysqlConn.end((err) => {
                            if (err) {
                                console.error('Error al cerrar la conexión:', err);
                            } else {
                                console.log('Conexión cerrada correctamente.');
                            }
                        });

                        res.json(jsonResult);

                    } else {

                        if (checkResults.length > 0) {

                            const jsonResult = {
                                "code": "ERROR",
                                "mensaje": "Ya existe un horario con ese nombre para esta compañía."
                            }

                            mysqlConn.end((err) => {
                                if (err) {
                                    console.error('Error al cerrar la conexión:', err);
                                } else {
                                    console.log('Conexión cerrada correctamente.');
                                }
                            });

                            res.json(jsonResult);

                        } else {

                            var queryString = `
                            UPDATE shifts 
                            SET 
                                name = ?, 
                                monday_opening_time = ?, 
                                monday_closing_time = ?, 
                                tuesday_opening_time = ?, 
                                tuesday_closing_time = ?, 
                                wednesday_opening_time = ?, 
                                wednesday_closing_time = ?, 
                                thursday_opening_time = ?, 
                                thursday_closing_time = ?, 
                                friday_opening_time = ?, 
                                friday_closing_time = ?, 
                                saturday_opening_time = ?, 
                                saturday_closing_time = ?, 
                                sunday_opening_time = ?, 
                                sunday_closing_time = ?, 
                                status = ?,
                                id_company = ?
                            WHERE id = ?`;

                            //console.log('queryString:', queryString);
                            //console.log('queryValues:', queryValues);

                            mysqlConn.query(queryString, queryValues, (error, results) => {

                                mysqlConn.end((err) => {
                                    if (err) {
                                        console.error('Error al cerrar la conexión:', err);
                                    } else {
                                        console.log('Conexión cerrada correctamente.');
                                    }
                                });


                                if (error) {

                                    console.error('error ejecutando query: ' + error.sqlMessage);
                                    const jsonResult = {
                                        "code": "ERROR",
                                        "mensaje": error.sqlMessage
                                    }
                                    res.json(jsonResult);

                                }
                                else {

                                    if (results.affectedRows != 0) {

                                        const jsonResult = {
                                            "code": "OK",
                                            "mensaje": "Registro actualizar correctamente."
                                        }
                                        res.json(jsonResult);

                                    } else {

                                        const jsonResult = {
                                            "code": "ERROR",
                                            "mensaje": "No se pudo actualizar el Registro seleccionado."
                                        }
                                        res.json(jsonResult);

                                    }
                                }
                            });
                        }
                    }
                });
            }
        });

    } catch (e) {

        console.log(e);
        res.json({ error: e })

        if (mysqlConn) {

            mysqlConn.end((err) => {
                if (err) {
                    console.error('Error al cerrar la conexión:', err);
                } else {
                    console.log('Conexión cerrada correctamente.');
                }
            });
        }
    }
});



router.post('/management-people/shifts/deleteShift', validateToken, (req, res) => {
    /*  
        #swagger.tags = ['Management People - Shifts']

        #swagger.security = [{
               "apiKeyAuth": []
        }]
        
       #swagger.parameters['obj'] = {
            in: 'body',
            schema: {
                id: 1,
            }
        }  
        
        #swagger.responses[200] = {
            schema: {
                "code": "OK",
                "mensaje": "Registro eliminado"
            }
        } 
    */
    try {

        let { id } = req.body;

        //console.log(id);

        var mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

        mysqlConn.connect(function (err) {

            if (err) {

                console.error('error connecting: ' + err.sqlMessage);
                const jsonResult = {
                    "code": "ERROR",
                    "mensaje": err.sqlMessage
                }
                res.json(jsonResult);

            } else {

                var queryString = "DELETE FROM shifts WHERE id = " + id;
                //console.log(queryString);

                mysqlConn.query(queryString, function (error, results, fields) {


                    mysqlConn.end((err) => {

                        if (err) {
                            console.error('Error al cerrar la conexión:', err);
                        } else {
                            console.log('Conexión cerrada correctamente.');
                        }

                    });

                    if (error) {

                        console.error('Error executing query: ' + error.message);

                        const jsonResult = {
                            "code": "ERROR",
                            "mensaje": error.sqlMessage
                        }
                        res.json(jsonResult);

                    } else {

                        if (results.affectedRows > 0) {
                            const jsonResult = {
                                "code": "OK",
                                "mensaje": "Registro Eliminado correctamente."
                            }

                            res.json(jsonResult);

                        } else {

                            const jsonResult = {
                                "code": "OK",
                                "mensaje": "No se pudo eliminar el registro selecionado."
                            }

                            res.json(jsonResult);
                        }
                    }
                });
            }
        });

    } catch (e) {

        console.log(e);
        res.json({ error: e })

        if (mysqlConn) {

            mysqlConn.end((err) => {
                if (err) {
                    console.error('Error al cerrar la conexión:', err);
                } else {
                    console.log('Conexión cerrada correctamente.');
                }
            });
        }
    }
});


//Management People - Workers
router.get('/management-people/workers/getWorkers/:companyID', validateToken, (req, res) => {
    const { companyID } = req.params;

    console.log('Request Params:', req.params);

    const mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

    mysqlConn.connect((err) => {
        if (err) {
            console.error('Connection error:', err.message);
            return res.status(500).json({
                code: "ERROR",
                mensaje: 'Error de conexión: ' + err.message
            });
        }

        const queryString = `
            SELECT * FROM workers WHERE company_id = ?
        `;

        mysqlConn.query(queryString, [companyID], (error, results) => {
            // Terminar la conexión después de manejar los resultados
            mysqlConn.end();

            if (error) {
                console.error('Query error:', error.message);
                return res.status(500).json({
                    code: "ERROR",
                    mensaje: 'Error ejecutando query: ' + error.message
                });
            }

            if (results.length > 0) {
                res.json({
                    code: "OK",
                    workers: results
                });
            } else {
                res.json({
                    code: "ERROR",
                    mensaje: "No se encontraron registros"
                });
            }
        });
    });
});

router.post('/management-people/workers/updateWorker', validateToken, (req, res) => {
    /*
    #swagger.tags = ['Management People - Workers']
    #swagger.security = [{
        "apiKeyAuth": []
    }]
    #swagger.parameters['obj'] = {
        in: 'body',
        schema: {
            id: 1,
            rut: "12345678-9",
            name: "Juan",
            lastname: "Pérez",
            lastname2: "Soto",
            born_date: "1990-01-01",
            gender: "M",
            state_civil: "Soltero",
            state: "Región Metropolitana",
            city: "Santiago",
            address: "Calle 123",
            phone: "+56912345678",
            email: "mail@mail.cl",
            date_admission: "2021-01-01",
            status: 1,
            position: "Operador",
            contractor: "Empresa",
            squad: 1,
            leader_squad: 0,
            shift: 1,
            wristband: "123456",
            observation: "Observación",
            bank: "Banco",
            account_type: "Cuenta Corriente",
            account_number: "123456",
            afp: "AFP",
            health: "Fonasa",
            company_id: 1,
            is_weigher: 0
        }
    }

    #swagger.responses[200] = {
        schema: {
            "code": "OK",
            "mensaje": "Registro actualizado"
        }
    }
    */

    try {
        const {
            id, rut, name, lastname, lastname2, born_date, gender, state_civil, state,
            city, address, phone, email, date_admission, status, position, contractor,
            squad, leader_squad, shift, wristband, observation, bank, account_type,
            account_number, afp, health, company_id, is_weigher
        } = req.body;

        // Verificar si el id está presente
        if (!id) {
            return res.status(400).json({
                code: "ERROR",
                mensaje: "ID es obligatorio"
            });
        }

        // Función para procesar valores vacíos
        const processValue = (value) => {
            if (value === '') return null;
            return isNaN(value) ? null : Number(value);
        };

        // Procesar valores numéricos
        const processedPosition = processValue(position);
        const processedContractor = processValue(contractor);
        const processedSquad = processValue(squad);
        const processedLeaderSquad = processValue(leader_squad);
        const processedShift = processValue(shift);
        const processedWristband = processValue(wristband);

        // Asegurarse de que las fechas estén en el formato correcto (YYYY-MM-DD)
        const formattedBornDate = new Date(born_date).toISOString().split('T')[0];
        const formattedDateAdmission = new Date(date_admission).toISOString().split('T')[0];

        // Crear conexión MySQL
        const mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

        mysqlConn.connect((err) => {
            if (err) {
                console.error('Error de conexión:', err.message);
                return res.status(500).json({
                    code: "ERROR",
                    mensaje: 'Error de conexión: ' + err.message
                });
            }

            // Verificar si el RUT ya existe en la misma company_id, excluyendo el id actual
            const checkRutQuery = `
                SELECT id FROM workers 
                WHERE rut = ? 
                AND company_id = ? 
                AND id != ?
            `;
            const checkRutValues = [rut, company_id, id];

            mysqlConn.query(checkRutQuery, checkRutValues, (checkError, checkResults) => {
                if (checkError) {
                    mysqlConn.end();
                    console.error('Error al verificar RUT:', checkError.message);
                    return res.status(500).json({
                        code: "ERROR",
                        mensaje: 'Error al verificar RUT: ' + checkError.message
                    });
                }

                if (checkResults.length > 0) {
                    mysqlConn.end();
                    return res.status(400).json({
                        code: "ERROR",
                        mensaje: 'El RUT ya está registrado en esta empresa'
                    });
                }

                // Verificar si el ID del trabajador existe
                const checkExistQuery = 'SELECT id FROM workers WHERE id = ?';
                mysqlConn.query(checkExistQuery, [id], (checkExistError, checkExistResults) => {
                    if (checkExistError) {
                        mysqlConn.end();
                        console.error('Error al verificar existencia del ID:', checkExistError.message);
                        return res.status(500).json({
                            code: "ERROR",
                            mensaje: 'Error al verificar existencia: ' + checkExistError.message
                        });
                    }

                    if (checkExistResults.length === 0) {
                        mysqlConn.end();
                        return res.status(404).json({
                            code: "ERROR",
                            mensaje: 'Trabajador no encontrado'
                        });
                    }

                    // Actualizar trabajador
                    const updateQuery = `
                        UPDATE workers 
                        SET 
                            rut = ?, name = ?, lastname = ?, lastname2 = ?, born_date = ?,
                            gender = ?, state_civil = ?, state = ?, city = ?, address = ?,
                            phone = ?, email = ?, date_admission = ?, position = ?, contractor = ?,
                            squad = ?, leader_squad = ?, shift = ?, wristband = ?, observation = ?,
                            bank = ?, account_type = ?, account_number = ?, afp = ?, health = ?,
                            status = ?, company_id = ?, is_weigher = ?
                        WHERE id = ?
                    `;

                    const updateValues = [
                        rut, name, lastname, lastname2, formattedBornDate, gender, state_civil, state,
                        city, address, phone, email, formattedDateAdmission, processedPosition, processedContractor,
                        processedSquad, processedLeaderSquad, processedShift, processedWristband,
                        observation, bank, account_type, account_number, afp, health, status, company_id, is_weigher, id
                    ];

                    mysqlConn.query(updateQuery, updateValues, (updateError, updateResults) => {
                        mysqlConn.end();

                        if (updateError) {
                            console.error('Error ejecutando query:', updateError.message);
                            return res.status(500).json({
                                code: "ERROR",
                                mensaje: 'Error ejecutando query: ' + updateError.message
                            });
                        }

                        // Verificar si alguna fila fue afectada
                        if (updateResults.affectedRows === 0) {
                            return res.status(400).json({
                                code: "ERROR",
                                mensaje: 'No se actualizó ningún registro'
                            });
                        }

                        res.json({
                            code: "OK",
                            mensaje: "Registro actualizado"
                        });
                    });
                });
            });
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

router.post('/management-people/workers/deleteWorker', validateToken, (req, res) => {

    /*
        #swagger.tags = ['Management People - Workers']

        #swagger.security = [{
               "apiKeyAuth": []
        }]

        #swagger.parameters['obj'] = {
            in: 'body',
            schema: {
                id: 1,
            }
        }

        #swagger.responses[200] = {
            schema: {
                "code": "OK",
                "mensaje": "Registro eliminado"
            }
        }
    */

    try {
        let { id } = req.body;

        //console.log(id);

        var mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

        mysqlConn.connect((err) => {
            if (err) {
                console.error('Error de conexión: ' + err.sqlMessage);
                return res.json({
                    "code": "ERROR",
                    "mensaje": err.sqlMessage
                });
            }

            const queryString = "DELETE FROM workers WHERE id = ?";
            //console.log(queryString);

            mysqlConn.query(queryString, [id], (error, results) => {
                if (error) {
                    console.error('Error ejecutando query: ' + error.sqlMessage);
                    return res.json({
                        "code": "ERROR",
                        "mensaje": error.sqlMessage
                    });
                }

                res.json({
                    "code": "OK",
                    "mensaje": "Registro eliminado"
                });

                // Terminar la conexión después de manejar los resultados
                mysqlConn.end();
            });
        });
    } catch (e) {
        console.log(e);
        res.json({ error: e.message });
    }
});

router.post('/management-people/workers/createWorker', validateToken, (req, res) => {
    /*  
        #swagger.tags = ['Management People - Workers']

        #swagger.security = [{
               "apiKeyAuth": []
        }]
        
        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Crear Trabajador',
            required: true,
            schema: {
                "rut": "12345678-9",
                "name": "Juan",
                "lastname": "Perez",
                "lastname2": "Perez",
                "born_date": "1990-01-01",
                "gender": "Masculino",
                "state_civil": "Soltero",
                "state": "Maule",
                "city": "Talca",
                "address": "Calle 123",
                "phone": "12345678",
                "email": "email@email.com",
                "date_admission": "2021-01-01",
                "status": 1,
                "position": 1,
                "contractor": 1,
                "squad": 1,
                "leader_squad": 1,
                "shift": 1,
                "wristband": "12345678",
                "observation": "Observación",
                "bank": "Banco",
                "account_type": "Cuenta Corriente",
                "account_number": "12345678",
                "afp": "AFP",
                "health": "Isapre",
                "company_id": 1,
                "is_weigher": 1
            }
        }

        #swagger.responses[200] = {
            schema: {
                "code": "OK",
                "mensaje": "Registro creado"
            }
        }
    */

    try {
        const {
            rut, name, lastname, lastname2, born_date, gender, state_civil, state, city, address, phone, email,
            date_admission, status, position, contractor, squad, leader_squad, shift, wristband, observation,
            bank, account_type, account_number, afp, health, company_id, is_weigher
        } = req.body;

        //console.log('Received data:', req.body);

        const mysqlConn = mysql.createConnection(JSON.parse(process.env.DBSETTING));

        mysqlConn.connect((err) => {
            if (err) {
                console.error('Connection error:', err.message);
                return res.json({
                    code: "ERROR",
                    mensaje: err.message
                });
            }

            // Verificar si ya existe un trabajador con el mismo rut y company_id
            const checkQuery = `
                SELECT COUNT(*) AS count FROM workers 
                WHERE rut = ? AND company_id = ?
            `;

            mysqlConn.query(checkQuery, [rut, company_id], (error, results) => {
                if (error) {
                    mysqlConn.end();
                    console.error('Error checking for duplicate:', error.message);
                    return res.json({
                        code: "ERROR",
                        mensaje: error.message
                    });
                }

                if (results[0].count > 0) {
                    mysqlConn.end();
                    return res.json({
                        code: "ERROR",
                        mensaje: "El rut ya está registrado para esta empresa."
                    });
                }

                // Construir la consulta SQL
                const insertQuery = `
                    INSERT INTO workers (
                        rut, name, lastname, lastname2, born_date, gender, state_civil, state, city, address, phone, email,
                        date_admission, status, position, contractor, squad, leader_squad, shift, wristband, observation,
                        bank, account_type, account_number, afp, health, company_id, is_weigher
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                const queryValues = [
                    rut, name, lastname, lastname2 || null, born_date || null, gender || null, state_civil || null, state || null,
                    city || null, address || null, phone || null, email || null, date_admission || null, status || 1,
                    position || null, contractor || null, squad || null, leader_squad || null, shift || null, wristband || null,
                    observation || null, bank || null, account_type || null, account_number || null, afp || null, health || null,
                    company_id, is_weigher || 0
                ];

                // Ejecutar la consulta SQL para insertar el nuevo trabajador
                mysqlConn.query(insertQuery, queryValues, (insertError) => {
                    mysqlConn.end();

                    if (insertError) {
                        console.error('Error executing query:', insertError.message);
                        return res.json({
                            code: "ERROR",
                            mensaje: insertError.message
                        });
                    }

                    res.json({
                        code: "OK",
                        mensaje: "Registro creado"
                    });
                });
            });
        });
    } catch (e) {
        console.error('Caught exception:', e.message);
        res.json({ code: "ERROR", mensaje: e.message });
    }
});


export default router





