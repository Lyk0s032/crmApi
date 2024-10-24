const express = require('express');
const { client, user, calendario, fuente, cotizacion, register, meta, Op, Sequelize} = require('../db/db');


module.exports = {
    // Buscar clientes y agrupar por intento 1, intento 2, intento 3
    async getClientsByState(req, res){
        try{
            // Realizamos consultas por cada unos de los estados
            // Intento 1
            const searchIntentoOne = await client.findAll({
                where: {
                    state: 'intento 1'
                }
            }).catch(err => null); 

            // Intento 2
            const searchIntentoTwo = await client.findAll({
                where: {
                    state: 'intento 2'
                }
            }).catch(err => {
                console.log(err);
                return null
            });

            // Intento 3
            const searchIntentoThree = await client.findAll({
                where: {
                    state: 'intento 3'
                }
            }).catch(err => null);

            // Contacto 1
            const searchContactOne = await client.findAll({
                where: {
                    state: 'contacto 1'
                }
            }).catch(err => null);

            // Contacto 1
            const searchContactTwo = await client.findAll({
                where: {
                    state: 'contacto 2'
                }
            }).catch(err => null);

            // Contacto 1
            const searchContactThree = await client.findAll({
                where: {
                    state: 'contacto 3'
                }
            }).catch(err => null);

            // Visita
            const searchVisita = await client.findAll({
                where: {
                    state: 'visita'
                }
            }).catch(err => null);

            // Cotizacion
            const searchCotizacion = await client.findAll({
                where: {
                    state: 'cotizacion'
                }
            }).catch(err => null);

            const searchCotizacionesAprobadas = await cotizacion.findAll({
                where: {
                    state: 'aprobada'
                },
                include:[{
                    model: client
                }]
            }).catch(err => null);

            const searchClientsEspera = await client.findAll({
                where: {
                    state: 'espera'
                },
                
            }).catch(err => null);

            const searchClientsPerdido = await client.findAll({
                where: {
                    state: 'perdido'
                }
            }).catch(err => null);

            const searchFuente = await fuente.findAll({
                where:{
                    state: 'active'
                }
            }).catch(err => {
                return null
            })

            const searchAsesores = await user.findAll({
                where: {
                    rango: 'asesor'
                }, 
                include:[{
                    model: meta
                }]
            });
            const clients = {
                intentoOne: searchIntentoOne,
                intentoTwo: searchIntentoTwo,
                intentoThree: searchIntentoThree,
                contactOne: searchContactOne,
                contactTwo: searchContactTwo,
                contactThree: searchContactThree,
                visitas: searchVisita,
                cotizacion: searchCotizacion,
                aprobadas: searchCotizacionesAprobadas,
                espera: searchClientsEspera,
                perdido: searchClientsPerdido,
                fuente: searchFuente,
                asesores: searchAsesores
            }
            res.status(200).json(clients);
        }catch(err){
            console.log(err);
            res.status(200).json({msg: 'Ha ocurrido un error en la principal'});
        }
    },
    // POR ASESOR
    // Buscar clientes y agrupar por intento 1, intento 2, intento 3
    async getClientsByStateByAsesor(req, res){
        try{
            const { asesorId } = req.params;
            // Realizamos consultas por cada unos de los estados

            // Contacto 1
            const searchContactOne = await client.findAll({
                where: {
                    state: 'contacto 1',
                    userId: asesorId
                }
            }).catch(err => null);

            // Contacto 1
            const searchContactTwo = await client.findAll({
                where: {
                    state: 'contacto 2',
                    userId: asesorId
                }
            }).catch(err => null);

            // Contacto 1
            const searchContactThree = await client.findAll({
                where: {
                    state: 'contacto 3',
                    userId: asesorId
                }
            }).catch(err => null);

            // Visita
            const searchVisita = await client.findAll({
                where: {
                    state: 'visita',
                    userId: asesorId

                }
            }).catch(err => null);

            // Cotizacion
            const searchCotizacion = await client.findAll({
                where: {
                    state: 'cotizacion',
                    userId: asesorId

                }
            }).catch(err => null);

            const searchCotizacionesAprobadas = await cotizacion.findAll({
                where: {
                    state: 'aprobada'
                },
                include:[{
                    model: client,
                    where:{
                        userId: asesorId
                    }
                }]
            }).catch(err => null);

            const searchClientsEspera = await client.findAll({
                where: {
                    state: 'espera',
                    userId: asesorId
                },
                
            }).catch(err => null);

            const searchClientsPerdido = await client.findAll({
                where: {
                    state: 'perdido',
                    userId: asesorId

                }
            }).catch(err => null);

            const searchFuente = await fuente.findAll({
                where:{
                    state: 'active'
                }
            }).catch(err => {
                return null
            })

            const searchAsesores = await user.findAll({
                where: {
                    id: asesorId
                }, 
                include:[{
                    model: meta
                }]
            });
            const clients = {
                contactOne: searchContactOne,
                contactTwo: searchContactTwo,
                contactThree: searchContactThree,
                visitas: searchVisita,
                cotizacion: searchCotizacion,
                aprobadas: searchCotizacionesAprobadas,
                espera: searchClientsEspera,
                perdido: searchClientsPerdido,
                fuente: searchFuente,
                asesor: searchAsesores
            }
            res.status(200).json(clients);
        }catch(err){
            console.log(err);
            res.status(200).json({msg: 'Ha ocurrido un error en la principal'});
        }
    },


    // Obtener todos los intentos
    async getAllIntentos(req, res){
        try{
            const searchIntentos = await client.findAll({
                where: {
                    state: {
                        [Op.or]: ['intento 1', 'intento 2', 'intento 3'],
                    },
                },
                include:[{
                    model: register
                }]
            }).catch(err => null);

        if(!searchIntentos) return res.status(404).json({msg: 'No hay'});
        
        res.status(201).json(searchIntentos);

        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal'});
        }
    },
    // Obtener todos los Contactos
    async getAllContactos(req, res){
        try{
            const searchContactos = await client.findAll({
                where: {
                    state: {
                        [Op.or]: ['contacto 1', 'contacto 2', 'contacto 3'],
                    },
                },
                include:[{
                    model: register
                },{
                    model:calendario
                }]
            }).catch(err => null);

        if(!searchContactos) return res.status(404).json({msg: 'No hay'});
        
        res.status(201).json(searchContactos);

        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal'});
        }
    },
        // Obtener todos los intentos
    async getAllContactosByAsesor(req, res){
        try{
            const { asesorId } = req.params;
            const searchContactos = await client.findAll({
                where: {
                    state: {
                        [Op.or]: ['contacto 1', 'contacto 2', 'contacto 3'],
                    },
                    userId: asesorId
                },
                include:[{
                    model: register
                },{
                    model:calendario
                }]
            }).catch(err => null);
    
        if(!searchContactos) return res.status(404).json({msg: 'No hay'});
            
        res.status(201).json(searchContactos);
    
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal'});
        }
    },

    // GET ALL VISITAS
    async getAllVisitas(req, res){
        try{
            const searchContactos = await client.findAll({
                where: {
                    state: 'visita'
                },
                include:[{
                    model: register
                },{
                    model:calendario
                }]
            }).catch(err => null);

        if(!searchContactos) return res.status(404).json({msg: 'No hay'});
        
        res.status(201).json(searchContactos);

        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal'});
        }
    },
    // GET ALL VISITAS BY ASESOR
    async getAllVisitasByAsesor(req, res){
        try{
            const { asesorId } = req.params;

            const searchContactos = await client.findAll({
                where: {
                    state: 'visita',
                    userId: asesorId
                },
                include:[{
                    model: register
                },{
                    model:calendario
                }]
            }).catch(err => null);

        if(!searchContactos) return res.status(404).json({msg: 'No hay'});
        
        res.status(201).json(searchContactos);

        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal'});
        }
    },
    // GET ALL COTIZACIONES
    async getAllCotizaciones(req, res){
        try{
            const searchContactos = await client.findAll({
                where: {
                    state: 'cotizacion'
                },
                include:[{
                    model: cotizacion
                },{
                    model: register
                },{
                    model:calendario
                }]
            }).catch(err => null);

        if(!searchContactos) return res.status(404).json({msg: 'No hay'});
        
        res.status(201).json(searchContactos);

        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal'});
        }
    },
    // GET ALL COTIZACIONES
    async getAllCotizacionesByAsesor(req, res){
        try{
            const { asesorId } = req.params;
            const searchContactos = await client.findAll({
                where: {
                    state: 'cotizacion',
                    userId: asesorId
                },
                include:[{
                    model: cotizacion
                },{
                    model: register
                },{
                    model:calendario
                }]
            }).catch(err => null);

        if(!searchContactos) return res.status(404).json({msg: 'No hay'});
        
        res.status(201).json(searchContactos);

        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal'});
        }
    },

     // GET ALL APROBADAS
     async getAllAprobadas(req, res){
        try{
            const searchContactos = await client.findAll({
                where: {
                    state: 'aprobada'
                },
                include:[{
                    model: cotizacion
                },{
                    model: register
                },{
                    model:calendario
                }]
            }).catch(err => null);

        if(!searchContactos) return res.status(404).json({msg: 'No hay'});
        
        res.status(201).json(searchContactos);

        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal'});
        }
    },
         // GET ALL APROBADAS
         async getAllAprobadasByAsesor(req, res){
            try{
                const { asesorId } = req.params;
                const searchContactos = await client.findAll({
                    where: {
                        state: 'aprobada',
                        userId: asesorId
                    },
                    include:[{
                        model: cotizacion
                    },{
                        model: register
                    },{
                        model:calendario
                    }]
                }).catch(err => null);
    
            if(!searchContactos) return res.status(404).json({msg: 'No hay'});
            
            res.status(201).json(searchContactos);
    
            }catch(err){
                console.log(err);
                res.status(500).json({msg: 'Ha ocurrido un error en la principal'});
            }
        },
    // Obtener Calendario
    async getCalendaryAll(req, res){
        try{
            const searchCaledario = await calendario.findAll({
                include:[{
                    model:client
                }],
                order: [['fecha', 'DESC']]
            }).catch(err => {
                console.log(err);
                return null;
            });
            res.status(200).json(searchCaledario);
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },
    // Buscamos todos los clientes dentro del business
    async getAllClients(req, res){
        try{
            const clients = await client.findAll({
                group: 'intento 1'
            }).catch(err => null);

            if(!clients) return res.status(404).json({msg: 'No encontramos nada'});
            // Caso contrario
            res.status(200).json(clients)
        }catch(err){
            console.log(err);
            return null;
        }
    },
    // Cargar nuevo cliente
    async newClient(req, res){
        try {
            const { name, phone, email, fuenteId} = req.body;
            // Validamos
            if(!name || !phone || !fuenteId) return res.status(501).json({msg: 'Parametros invalidos'})
            // Caso contrario
            const createClient = await client.create({
                name,
                phone,
                email: email ? email : null,
                fuenteId,
                state: 'intento 1'
            }).catch(err => {
                console.log(err);
                return null;
            });

            if(!createClient) return res.status(502).json({msg: 'No se ha creado.'});
            // Caso contrario
            return res.status(201).json(createClient);
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Error en la principal.'});
        }
    },
    // Crear nueva fuente 
    async newFuente(req, res){
        try{
            // Recibimos datos por body
            const { name, description } = req.body;
            if(!name || !description) return res.status(501).json({msg: 'Parametros invalidos.'});
            // Caso contrario, avanzamos
            const newFuente = await fuente.create({
                name,
                description,
                state: 'active'
            }).catch(err => {
                console.log(err);
                return null
            });

            if(!newFuente) return res.status(502).json({msg:'No hemos podido crear esta fuente'});
            // Caso contrrio, avanzamos...
            res.status(201).json({msg: newFuente});
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Error en principal.'});
        }
    },

    // INTENTOS
    async dontCallIntentos(req, res){
        try{
            const { clientId } = req.body;

            // Buscar cliente
            const searchClient = await client.findByPk(clientId).catch(err => {
                console.log(err);
                return null;
            });
            // Si no existe el usuario
            if(!searchClient) return res.status(404).json({msg: 'No existe.'});
            // Caso contrario... Actualizamos el cliente y guardamos un registro.

            let estado = searchClient.state;

            let date = new Date();
            const updateClient = await client.update({
                state: estado == 'intento 1' ? 'intento 2' : estado == 'intento 2' ? 'intento 3' : estado == 'intento 3' ? 'perdido' : null,
            },{
                where: {
                    id: clientId
                }
            }).then(async (res) => {
                console.log(res);
                console.log('Avanza a actualizar el client');
                
                const newRegister = register.create({
                    type: estado,
                    tags: null,
                    note: 'No contesto',
                    tiempo: date,
                    clientId: searchClient.id
                }).catch(err => {
                    console.log(err);
                    return null;
                })

                return newRegister
            });

            res.status(201).json({msg: 'Actualizado'});

        }catch(err){
            console.log(err);
            return res.status(500).json({msg: 'Error en principal'});
        }
    },
    async contestoSinInteres(req, res){
        try{
            const { clientId, tag, newState } = req.body;
            if(!clientId || !tag || !newState) return res.status(501).json({msg: 'Parametros invalidos.'});

            // Buscamos client
            const searchClient = await client.findOne({
                where: {
                    id: clientId
                }
            }).catch(err => {
                console.log(err);
                return null
            });
            
            const date = new Date();

            const updateClient = await client.update({
                state: newState,
            },{
                where: {
                    id: clientId
                }
            }).then(async (res) => {
                console.log('Avanza a Crear registro');
                const newRegister = await register.create({
                    type: searchClient.state,
                    tags: tag,
                    tiempo: date,
                    clientId: searchClient.id
                }).catch(err => {
                    console.log(err);
                    return null;
                })

                return res
            });
            if(!updateClient) return res.status(501).json({msg: 'no se pudo actualizar'});

            res.status(201).json({msg: 'Actualizado'});
        }catch(err){
            console.log(err);
            return res.status(500).json({msg: 'Error principal.'}); 
        }
    },
    async contestoPeroLlamarDespues(req, res){
        try{
            const { clientId, time, type } = req.body;

            if(!clientId || !time) return res.status(501).json({msg: 'Error en parametros'});

            // Caso contrario, avanzamos...

            const searchClient = await client.findOne({
                where:{
                    id: clientId
                }
            }).catch(err => {
                console.log(err);
                return null
            });

            // Actualizar client...

            const updateClient = await client.update({
                state: 'espera'
            },{
                where: {
                    id: clientId,
                }
            })
            .then(async (res) => {
                const nuevoTiempo = await calendario.create({
                    type: 'Llamar despues - En Intentos',
                    fecha: time,
                    clientId: searchClient.id

                }).catch(err => null);

                return res
            })
            .catch(err => {
                console.log(err);
                return null;
            });

            if(!updateClient) return res.statu(502).json({msg: 'No ha podido actualizar'});

            res.status(201).json({msg: 'Actualizado y programado con exito'});
        }catch(err){
            console.log(err);
            return res.status(500).json({msg: 'Error en la principal'})
        }
    },
    async contestoYTieneInteresReal(req, res){
        try{
            const { clientId, estado, asesorId, time, tags, nombreEmpresa, responsable, sector, cargo } = req.body;
        
            if(!clientId || !estado || !time || !nombreEmpresa || !responsable || !sector || !cargo) return res.status(501).json({msg: 'Parametros invalidos'});
            const date = new Date();
            
            // Caso contrario, avanzamos...
            const searchClient = await client.findOne({
                where:{
                    id: clientId
                }
            }).catch(err => {
                console.log(err);
                return null
            });

            const actulizandoClient = await client.update({
                sector,
                responsable,
                rangoEncargado: cargo,
                nombreEmpresa,
                state: estado == 'llamada' ? 'contacto 1' : estado == 'visita' ? 'visita' : null,
                userId: asesorId
            },{
                where: {
                    id: clientId
                } 
            })
            .then(async (res) => {
                const programarTiempo = await calendario.create({
                    type: estado == 'llamada' ? 'Solicita una llamada' : estado == 'visita' ? 'Solicita una visita este cliente' : null,
                    fecha: time,
                    clientId: searchClient.id,
                    userId: asesorId

                }).catch(err => null);

                const newRegister = await register.create({
                    type: searchClient.state,
                    tags: tags,
                    tiempo: date,
                    clientId: searchClient.id,
                }).catch(err => {
                    console.log(err);
                    return null;
                })

                return res
            })
            .catch(err => {
                console.log(err);
                return null
            });

            if(!actulizandoClient) return res.status(502).json({msg: 'Error en la principal'});

            // Caso contrario, avanzamos
            res.status(201).json({msg:'Actualizado con exito'})
        }catch(err){
            console.log(err);
            return res.status(500).json({msg: 'Error principal.'});
        }
    },


    // CONTACTO
    // No contesto
    async dontCallContacto(req, res){
        try{
            const { clientId } = req.body;

            // Buscar cliente
            const searchClient = await client.findByPk(clientId).catch(err => {
                console.log(err);
                return null;
            });
            // Si no existe el usuario
            if(!searchClient) return res.status(404).json({msg: 'No existe.'});
            // Caso contrario... Actualizamos el cliente y guardamos un registro.

            let estado = searchClient.state;

            let date = new Date();
            const updateClient = await client.update({
                state: estado == 'contacto 1' ? 'contacto 2' : estado == 'contacto 2' ? 'contacto 3' : estado == 'contacto 3' ? 'perdido' : null,
            },{
                where: {
                    id: clientId
                }
            }).then(async (res) => {
                console.log(res);
                console.log('Avanza a actualizar el client');
                
                const newRegister = register.create({
                    type: estado,
                    tags: null,
                    note: 'No fue posible el contacto',
                    tiempo: date,
                    clientId: searchClient.id
                }).catch(err => {
                    console.log(err);
                    return null;
                })

                return newRegister
            });

            res.status(201).json({msg: 'Actualizado'});

        }catch(err){
            console.log(err);
            return res.status(500).json({msg: 'Error en principal'});
        }
    },
    // Contactar Después
    async contestoPeroLlamarDespuesContacto(req, res){
        try{
            const { clientId, time, type } = req.body;

            if(!clientId || !time) return res.status(501).json({msg: 'Error en parametros'});

            // Caso contrario, avanzamos...

            const searchClient = await client.findOne({
                where:{
                    id: clientId
                }
            }).catch(err => {
                console.log(err);
                return null
            });

            // Actualizar client...

            const updateClient = await client.update({
                state: 'espera'
            },{
                where: {
                    id: clientId,
                }
            })
            .then(async (res) => {
                const nuevoTiempo = await calendario.create({
                    type: `Llamar despues - En ${searchClient.state}`,
                    fecha: time,
                    clientId: searchClient.id

                }).catch(err => null);

                return res
            })
            .catch(err => {
                console.log(err);
                return null;
            });

            if(!updateClient) return res.statu(502).json({msg: 'No ha podido actualizar'});

            res.status(201).json({msg: 'Actualizado y programado con exito'});
        }catch(err){
            console.log(err);
            return res.status(500).json({msg: 'Error en la principal'})
        }
    },
    async contestoSinInteresContacto(req, res){
        try{
            const { clientId, tag, newState } = req.body;
            if(!clientId || !tag || !newState) return res.status(501).json({msg: 'Parametros invalidos.'});

            // Buscamos client
            const searchClient = await client.findOne({
                where: {
                    id: clientId
                }
            }).catch(err => {
                console.log(err);
                return null
            });
            
            const date = new Date();

            const updateClient = await client.update({
                state: newState,
            },{
                where: {
                    id: clientId
                }
            }).then(async (res) => {
                console.log('Avanza a Crear registro');
                const newRegister = await register.create({
                    type: searchClient.state,
                    tags: tag,
                    tiempo: date,
                    clientId: searchClient.id
                }).catch(err => {
                    console.log(err);
                    return null;
                })

                return res
            });
            if(!updateClient) return res.status(501).json({msg: 'no se pudo actualizar'});

            res.status(201).json({msg: 'Actualizado'});
        }catch(err){
            console.log(err);
            return res.status(500).json({msg: 'Error principal.'}); 
        }
    },
    async contestoYTieneInteresRealContacto(req, res){
        try{
            const { clientId, estado, time, COTIZACION, nit, nro, fecha, bruto, descuento, iva, neto } = req.body;
        
            if(!clientId || !estado || !time) return res.status(501).json({msg: 'Parametros invalidos'});
            const date = new Date();
            
          
            // Caso contrario, avanzamos...
            const searchClient = await client.findOne({
                where:{
                    id: clientId
                }
            }).catch(err => {
                console.log(err);
                return null
            });


            if(estado == 'visita'){
                const updateClient = await client.update({
                    state: 'visita'
                }, {
                    where: {
                        id: clientId
                    }
                }).then(async (res) => {
                    const programarTiempo = await calendario.create({
                        type: 'visita',
                        fecha: time,
                        clientId: searchClient.id,
                        userId: searchClient.userId
                    }).catch(err => null);
    
                    const newRegister = await register.create({
                        type: searchClient.state,
                        tags: null,
                        tiempo: date,
                        clientId: searchClient.id,
                    }).catch(err => {
                        console.log(err);
                        return null;
                    })
    
                    return res
                })

                res.status(201).json({msg: 'Actualizado con exito!'});
            }else if(estado == 'cotizacion'){
                // --------------------------------------
                // ------------ COTIZACION --------------
                // --------------------------------------

                console.log('Cotizacion')
                const updateClient = await client.update({
                    state: 'cotizacion'
                }, {
                    where: {
                        id: clientId
                    }
                }).then(async (res) => {
                    const createCotizacion = await cotizacion.create({
                        nit, 
                        nro, 
                        fecha, 
                        bruto,   
                        descuento, 
                        iva, 
                        neto,
                        clientId: clientId,
                        state: 'pendiente'
                    }).catch(err => {
                        console.log(err);
                        return null
                    }); 
    
                    const newRegister = await register.create({
                        type: searchClient.state,
                        tags: null,
                        tiempo: date,
                        clientId: searchClient.id,
                    }).catch(err => {
                        console.log(err);
                        return null;
                    })
    
                    return res
                })

                res.status(201).json({msg: 'Pasamos a la cotizacion con exito!'});
                
               
            }


        }catch(err){
            console.log(err);
            return res.status(500).json({msg: 'Error principal.'});
        }
    },


    // VISITA
    async contestoSinInteresVisita(req, res){
        try{
            const { clientId, tag, newState } = req.body;
            if(!clientId || !tag || !newState) return res.status(501).json({msg: 'Parametros invalidos.'});

            // Buscamos client
            const searchClient = await client.findOne({
                where: {
                    id: clientId
                }
            }).catch(err => {
                console.log(err);
                return null
            });
            
            const date = new Date();

            const updateClient = await client.update({
                state: newState,
            },{
                where: {
                    id: clientId
                }
            }).then(async (res) => {
                console.log('Avanza a Crear registro');
                const newRegister = await register.create({
                    type: searchClient.state,
                    tags: tag,
                    tiempo: date,
                    clientId: searchClient.id
                }).catch(err => {
                    console.log(err);
                    return null;
                })

                return res
            });
            if(!updateClient) return res.status(501).json({msg: 'no se pudo actualizar'});

            res.status(201).json({msg: 'Actualizado'});
        }catch(err){
            console.log(err);
            return res.status(500).json({msg: 'Error principal.'}); 
        }
    },
    // Contactar Después
    async contestoPeroLlamarDespuesVisita(req, res){
        try{
                const { clientId, time, type } = req.body;
    
                if(!clientId || !time) return res.status(501).json({msg: 'Error en parametros'});
    
                // Caso contrario, avanzamos...
    
                const searchClient = await client.findOne({
                    where:{
                        id: clientId
                    }
                }).catch(err => {
                    console.log(err);
                    return null
                });
    
                // Actualizar client...
    
                const updateClient = await client.update({
                    state: 'espera'
                },{
                    where: {
                        id: clientId,
                    }
                })
                .then(async (res) => {
                    const nuevoTiempo = await calendario.create({
                        type: `Llamar despues - En ${searchClient.state}`,
                        fecha: time,
                        clientId: searchClient.id,
                        userId: searchClient.userId
    
                    }).catch(err => null);
    
                    return res
                })
                .catch(err => {
                    console.log(err);
                    return null;
                });
    
                if(!updateClient) return res.statu(502).json({msg: 'No ha podido actualizar'});
    
                res.status(201).json({msg: 'Actualizado y programado con exito'});
            }catch(err){
                console.log(err);
                return res.status(500).json({msg: 'Error en la principal'})
        }
    },
    async deseaOtroServicio(req, res){
        try{
            const { clientId, note } = req.body;

            // Buscamos client
            const searchClient = await client.findOne({
                where: {
                    id: clientId
                }
            }).catch(err => {
                console.log(err);
                return null
            });
            
            const date = new Date();

            const updateClient = await client.update({
                state: 'espera',
            },{
                where: {
                    id: clientId
                }
            }).then(async (res) => {
                const newRegister = await register.create({
                    type: searchClient.state,
                    note,
                    tiempo: date,
                    clientId: searchClient.id
                }).catch(err => {
                    console.log(err);
                    return null;
                })

                return res
            });
            if(!updateClient) return res.status(501).json({msg: 'no se pudo actualizar'});

            res.status(201).json({msg: 'Perfecto, Esta interesado en otro servicio'});
        }catch(err){
            console.log(err);
            res.status(501).json({msg: 'Ha ocurrido un error en la principal'});
        }
    },
    // COTIZACION
    async visitaACotizacion(req, res){
        try{
            const { clientId, nit, nro, fecha, bruto, descuento, iva, neto } = req.body;
        
            if(!clientId ) return res.status(501).json({msg: 'Parametros invalidos'});
            const date = new Date();
            
          
            // Caso contrario, avanzamos...
            const searchClient = await client.findOne({
                where:{
                    id: clientId
                }
            }).catch(err => {
                console.log(err);
                return null
            });



                const updateClient = await client.update({
                    state: 'cotizacion'
                }, {
                    where: {
                        id: clientId
                    }
                }).then(async (res) => {
                    const createCotizacion = await cotizacion.create({
                        nit, 
                        nro, 
                        fecha, 
                        bruto,   
                        descuento, 
                        iva, 
                        neto,
                        clientId: clientId,
                        state: 'pendiente'
                    }).catch(err => {
                        console.log(err);
                        return null
                    }); 
    
                    const newRegister = await register.create({
                        type: searchClient.state,
                        tags: null,
                        tiempo: date,
                        clientId: searchClient.id,
                    }).catch(err => {
                        console.log(err);
                        return null;
                    })
    
                    return res
                })

                res.status(201).json({msg: 'Pasamos a la cotizacion con exito!'});


        }catch(err){
            console.log(err);
            return res.status(500).json({msg: 'Error principal.'});
        }
    },



    // CAMBIAR COTIZACION A APROBADA O PERDIDA
    async changeStateToCotizacion(req, res){
        try{
            const { clientId, cotizacionId, stateEnter } = req.body;

            // Buscamos client
            const searchClient = await client.findOne({
                where: {
                    id: clientId
                }
            }).catch(err => {
                console.log(err);
                return null
            });

            // Buscamos client
            const searchCotizacion = await cotizacion.findOne({
                where: {
                    id: cotizacionId
                }
            }).catch(err => {
                console.log(err);
                return null
            });

            const updateClient = await client.update({
                state:stateEnter,
            }, {
                where: {
                    id: clientId
                }
            }).then(async (res) => {
                const updateCotizacion = await cotizacion.update({
                    state: stateEnter
                },{
                    where: {
                        id: cotizacionId
                    }
                }).catch(err => {
                    console.log(err);
                    return null;
                });

                return res
            }).catch(err => {
                console.log(err);
                return null;
            });
            
            if(!updateClient) return res.status(502).json({msg: 'No hemos podido actualizar.'});

            res.status(201).json({msg: `Cotizacion avanzada a ${stateEnter}`});

        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Error en la principal'});
        }
    },
    // APLAZAR COTIZACION
    async aplazarCotizacion(req, res){
        try{
            const { clientId, cotizacionId } = req.body;
        
            if(!clientId ) return res.status(501).json({msg: 'Parametros invalidos'});
            const date = new Date();
            
          
            // Caso contrario, avanzamos...
             // Buscamos client
             const searchClient = await client.findOne({
                where: {
                    id: clientId
                }
            }).catch(err => {
                console.log(err);
                return null
            });

            // Buscamos client
            const searchCotizacion = await cotizacion.findOne({
                where: {
                    id: cotizacionId
                }
            }).catch(err => {
                console.log(err);
                return null
            });


                const updateCotizacion = await cotizacion.update({
                    state: 'aplazada'
                }, {
                    where: {
                        id: cotizacionId
                    }
                }).then(async (res) => {
    
                    const newRegister = await register.create({
                        type: searchClient.state,
                        tags: null,
                        note: 'Aplazando cotizacion 7 dias',
                        tiempo: date, 
                        clientId: searchClient.id,
                    }).catch(err => {
                        console.log(err);
                        return null;
                    })
    
                    return res
                })

                res.status(201).json({msg: 'Aplazamos la fecha de la cotizacion 7 dias!'});


        }catch(err){
            console.log(err);
            return res.status(500).json({msg: 'Error principal.'});
        }
    },
}