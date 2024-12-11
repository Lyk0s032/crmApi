const express = require('express');
const { client, user, calendario, fuente, cotizacion, register, meta } = require('../db/db');
const {  Sequelize, Op } = require('sequelize');
const dayjs = require('dayjs');


module.exports = {
    // APP
    async showAsesorData(req, res){
        try{
            const { id } = req.params;

            if(!id) return res.status(501).json({msg: 'Parametro invalido.'})
            // Caso contrario, consultamos

            const searchAsesor = await user.findByPk(id, {
                include: [{
                    model: client,
                    where: {
                        state: {
                            [Op.or]: ['contacto 1', 'contacto 2', 'contacto 3', 'visita', 'espera']
                        },
                        
                    },
                    include:[{
                        model: calendario
                    },{
                        model: register
                    }]
                }],
                order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]
            }).catch(err => {
                console.log(err);
                return null;
            });

            if(!searchAsesor) return res.status(404).json({msg: 'No hemos encontrado esto.'});

            // Caso contrario, avanzamos...
            res.status(200).json(searchAsesor)
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal'});
        }
    },
    async showAsesores(req, res){
        try{
            const searchAsesores = await user.findAll({
                where: {
                    rango: 'asesor'
                }
            }).catch(err => {
                console.log(err);
                return null;
            });

            if(!searchAsesores || !searchAsesores.length) return res.status(404).json({msg: 'no hemos encontrado asesores'});

            // Caso contrario
            res.status(200).json(searchAsesores);
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal'})
        }
    },
    // Buscar clientes y agrupar por intento 1, intento 2, intento 3
    async getClientsByState(req, res){
        try{

             // Fecha actual y rango
             const inicio = dayjs().date(6).startOf('day'); // Día 6 del mes actual
             const fin = inicio.add(1, 'month').endOf('day'); // Día 6 del próximo mes
 
             const startDate = inicio.toDate(); // Inicio del día    
             const endDate = fin.toDate();     // Fin del día


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
                    state: 'aprobada',
                    updatedAt:{
                        [Op.between]: [startDate, endDate]
                    }
                    
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
            const { asesorId, ano, mes } = req.params;
            // Realizamos consultas por cada unos de los estados

            // Fecha actual y rango
            const inicio = dayjs().date(6).startOf('day'); // Día 6 del mes actual
            const fin = inicio.add(1, 'month').endOf('day'); // Día 6 del próximo mes

            const startDate = inicio.toDate(); // Inicio del día    
            const endDate = fin.toDate();     // Fin del día
            // const startDate = '2024-11-05'; // Fecha de inicio
            // const endDate = '2025-01-05';   // Fecha de fin
            console.log(fin)
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
                    state: 'aprobada',
                    updatedAt:{
                        [Op.between]: [startDate, endDate]
                    }
                },
                include:[{
                    model: client,
                    where:{
                        userId: asesorId
                    }
                }]
            }).catch(err => {
                console.log(err);
                return null
            });

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

    async getAllAsesores(req, res){
        try{
            const searchAllAsesores = await user.findAll({
                where: {
                    rango: 'asesor'    
                },
                include:[{
                    model: client,
                    where: {
                        state: {
                            [Op.between]: ['contacto 1', 'contacto 2', 'contacto 3', 'visita']
                        }
                    }
                }],
                group: ['client.state'],
            }).catch(Err => {
                console.log(Err);
                return null
            });

            if(!searchAllAsesores) return res.status(404).json({msg: 'Sin resultados'});
            res.status(200).json(searchAllAsesores)
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal'});
        }
    },
    // GET ALL CLIENTES ON PANEL
    async getAllClientsVisualizar(req, res){
        try{
            const { asesorId, page, query}  = req.query;
            const pageSize = 10;

            if(!asesorId){
                const results = await client.findAndCountAll({
                    include:[{
                        model: cotizacion
                    },{
                        model: register
                    },{
                        model:calendario
                    }, {
                        model: user
                    }],
                    limit: pageSize,
                    offset: (page - 1) * pageSize,
                    order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]
                }).catch(err => {
                    console.log(err);
                    return null
                });
                res.status(200).json(results);     


            }else{


                const results = await client.findAndCountAll({
                    where: {
                        userId: asesorId
                    },
                    include:[{
                        model: cotizacion
                    },{
                        model: register
                    },{
                        model:calendario
                    }, {
                        model: user
                    }],
                    limit: pageSize,
                    offset: (page - 1) * pageSize,
                    order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]
               
                }).catch(err => {
                    console.log(err);
                    return null
                });
                res.status(200).json(results);     


            }

        }catch(err){        
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal para buscar.'});
        }
    },
    // BUSCAR DE CLIENTES
        async SearchClientsParaVisualizar(req, res){
            try{
                const { query, asesor } = req.query; // Captura el parámetro 'query' de la URL
    
                // Verifica que se haya enviado un término de búsqueda
                if (!query) {
                    return res.status(400).json({ message: 'Debes ingresar un término de búsqueda' });
                }
                if(!asesor){
                // Realiza la búsqueda en la base de datos
                const resultados = await client.findAll({
                    where: {
                        nombreEmpresa: {
                            [Op.iLike]: `%${query}%` // Usamos iLike para hacer una búsqueda insensible a mayúsculas/minúsculas
                        }
                    },
                    include:[{
                        model: cotizacion
                    },{
                        model: register
                    },{
                        model:calendario
                    },{
                        model: user
                    }],
                    order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']],

                    limit: 10 // Limita la cantidad de resultados si lo deseas
                }).catch(err => {
                    console.log(err);
                    return null
                });
    
                // Enviamos respuesta si no hay resultado
            
                if(!resultados || !resultados.length) return res.status(404).json({msg:'No hay resultados'})
                res.status(200).json(resultados)


                }else{
                
                
                // Realiza la búsqueda en la base de datos
                const resultados = await client.findAll({
                    where: {
                        userId: asesor,
                        nombreEmpresa: {
                            [Op.iLike]: `%${query}%` // Usamos iLike para hacer una búsqueda insensible a mayúsculas/minúsculas
                        },
                        include:[{
                            model: cotizacion
                        },{
                            model: register
                        },{
                            model:calendario
                        }, , {
                            model: user
                        }],
                order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]

                    },
                    limit: 10 // Limita la cantidad de resultados si lo deseas
                }).catch(err => null);

                // Enviamos respuesta si no hay resultado

                if(!resultados.length) return res.status(404).json({msg:'No hay resultados'})
                res.status(200).json(resultados)
                }
    
            }catch(err){
                console.log(err);
                res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
            }
        },
    // BUSCADOR DE CLIENTES - PARA COTIZAR
    async SearchClients(req, res){
        try{
            const { query } = req.query; // Captura el parámetro 'query' de la URL

            // Verifica que se haya enviado un término de búsqueda
            if (!query) {
                return res.status(400).json({ message: 'Debes ingresar un término de búsqueda' });
            }

            // Realiza la búsqueda en la base de datos
            const resultados = await client.findAll({
                where: {
                    nombreEmpresa: {
                        [Op.iLike]: `%${query}%` // Usamos iLike para hacer una búsqueda insensible a mayúsculas/minúsculas
                    }
                },
                limit: 10 // Limita la cantidad de resultados si lo deseas
            }).catch(err => null);

            // Enviamos respuesta si no hay resultado
            // Filtra en el servidor para obtener solo un registro por cada nombre
            const resultadosUnicos = [];
            const nombresVistos = new Set();

            for (const producto of resultados) {
                if (!nombresVistos.has(producto.nombreEmpresa)) {
                    nombresVistos.add(producto.nombreEmpresa);
                    resultadosUnicos.push(producto); // Guarda el primer registro con nombre único
                }
            }

            // Limita la cantidad de resultados únicos que se envían al cliente
            if(!resultados.length) return res.status(404).json({msg:'No hay resultados'})
            res.json(resultadosUnicos.slice(0, 10));

        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },
    // PARA QUE EL LIDER PUEDA VISUALIZAR
    async VisualizarAsesor(req, res){
        try{
            const { asesorId } = req.params;
            // Realizamos consultas por cada unos de los estados

            // Contacto 1
            const searchContactOne = await client.findAll({
                where: {
                    state: 'contacto 1',
                    userId: asesorId
                },
                include:[{
                    model: register
                },{
                    model: calendario
                }, {
                    model: user
                }],
                order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]

            }).catch(err => null);

            // Contacto 1
            const searchContactTwo = await client.findAll({
                where: {
                    state: 'contacto 2',
                    userId: asesorId
                },
                include:[{
                    model: register
                },{
                    model: calendario
                }, {
                    model: user
                }],
                order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]
            }).catch(err => null);

            // Contacto 1
            const searchContactThree = await client.findAll({
                where: {
                    state: 'contacto 3',
                    userId: asesorId
                },
                include:[{
                    model: register
                },{
                    model: calendario
                }, {
                    model: user
                }],
                order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]
            }).catch(err => null);

            // Visita
            const searchVisita = await client.findAll({
                where: {
                    state: 'visita',
                    userId: asesorId

                },
                include:[{
                    model: register
                },{
                    model: calendario
                }, {
                    model: user
                }],
                order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]
            }).catch(err => null);

            // Cotizacion
            const searchCotizacion = await client.findAll({
                where: {
                    state: 'cotizacion',
                    userId: asesorId

                },
                include:[{
                    model: register
                },{
                    model: calendario
                }, {
                    model: user
                }],
                order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]

            }).catch(err => null);

            const searchCotizacionesAprobadas = await cotizacion.findAll({
                where: {
                    state: 'aprobada',
                },
                include:[{
                    model: client,
                    where: {
                        userId: asesorId
                    },
                    include: [
                        {
                            model: calendario
                        }, {
                            model: register
                        }
                   ]
            }],
                order: [['updatedAt', 'DESC'], [{model: client}, { model: register}, 'createdAt', 'DESC']]

            }).catch(err => {
                console.log(err);
                return null
            });

            const searchClientsEspera = await client.findAll({
                where: {
                    state: 'espera',
                    userId: asesorId
                },
                include:[{
                    model: register
                },{
                    model: calendario
                }, {
                    model: user
                }],
                order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]


            }).catch(err => null);

            const searchClientsPerdido = await client.findAll({
                where: {
                    state: 'perdido',
                    userId: asesorId

                },
                include:[{
                    model: register
                },{
                    model: calendario
                }, {
                    model: user
                }],
                order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]

            }).catch(err => null);

            const searchFuente = await fuente.findAll({
                where:{
                    state: 'active'
                }
            }).catch(err => {
                return null
            })

            const searchAsesores = await user.findOne({
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
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
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
                }],
                order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]

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
                    model: user,
                    attributes:['id','name', 'lastName', 'rango', 'photo']
                },{
                    model: register
                },{
                    model:calendario
                }],
                order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]
            }).catch(err => {
                console.log(err)
                return null
            });

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
                }],
                order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]


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
                    model: user,
                    attributes:['id','name', 'lastName', 'rango', 'photo']
                },{
                    model: register
                },{
                    model:calendario
                }],
                order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]

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
                }],
                order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]

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
                    model: user
                },{
                    model: register
                },{
                    model:calendario
                }],
                order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]

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
                }],
                order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]

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
            const inicio = dayjs().date(6).startOf('day'); // Día 6 del mes actual
            const fin = inicio.add(1, 'month').endOf('day'); // Día 6 del próximo mes

            const startDate = inicio.toDate(); // Inicio del día    
            const endDate = fin.toDate();     // Fin del día

            const searchContactos = await client.findAll({
                where: {
                    state: 'aprobada'
                },
                include:[{model:user},{
                    model: cotizacion,
                    where:{
                        state: 'aprobada',
                        updatedAt:{
                            [Op.between]: [startDate, endDate]
                        }
                    },
                    required: true
                },{
                    model: register
                },{
                    model:calendario
                }],
                order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]

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
            const inicio = dayjs().date(6).startOf('day'); // Día 6 del mes actual
            const fin = inicio.add(1, 'month').endOf('day'); // Día 6 del próximo mes

            const startDate = inicio.toDate(); // Inicio del día    
            const endDate = fin.toDate();     // Fin del día

            try{
                const { asesorId } = req.params;
                const searchContactos = await client.findAll({
                    where: {
                        state: 'aprobada',
                        userId: asesorId
                    },
                    include:[{model: user},{
                        model: cotizacion,
                        where:{
                            state: 'aprobada',
                            updatedAt:{
                                [Op.between]: [startDate, endDate]
                            }
                        },
                        required: true
                    },{
                        model: register
                    },{
                        model:calendario
                    }],
                order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]

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
            const { asesor } = req.query;
            
            if(asesor){
                const searchCaledario = await calendario.findAll({
                    include:[{
                        model:client,
                        where: {
                            userId: asesor
                        },
                        include: [{
                            model:user
                        },{
                            model: register
                        }],
                    }],
                    order: [['fecha', 'DESC'],
                    [{ model: client}, { model: register}, 'createdAt', 'DESC']]
                }).catch(err => {
                    console.log(err);
                    return null; 
                });
                res.status(200).json(searchCaledario);
            }else{
                const searchCaledario = await calendario.findAll({
                    include:[{
                        model:client,
                        include: [{
                            model:user
                        },{
                            model: register
                        }],
                    }],
                    order: [['fecha', 'DESC'],
                    [{ model: client}, { model: register}, 'createdAt', 'DESC']]
                }).catch(err => {
                    console.log(err);
                    return null; 
                });
                res.status(200).json(searchCaledario);
            }
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
            const { name, phone, email, nombreEmpresa, url, fijo, cargo, direccion, fuenteId} = req.body;
            // Validamos
            if(!name || !phone || !fuenteId) return res.status(501).json({msg: 'Parametros invalidos'})
            // Caso contrario
            const createClient = await client.create({
                name,
                phone,
                nombreEmpresa: nombreEmpresa,
                url: url,
                fijo: fijo,
                rangoEncargado: cargo,
                direccion: direccion,
                email: email,
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
            const { clientId, tiempo } = req.body;

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

                const programarTiempo = await calendario.create({
                    type:  `Volver a intentar - En ${estado}`,
                    fecha: tiempo,
                    clientId: searchClient.id,
                    userId: null

                }).catch(err => null);

                const newRegister = register.create({
                    type: estado,
                    tags: null,
                    note: 'No contesto',
                    tiempo: tiempo,
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
            const { clientId, tag, note, newState } = req.body;
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
                    note: `Perdido: ${note}` ,
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
            const { clientId, time, type, note, tags } = req.body;

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
                state: 'espera',
                embudo: searchClient.state
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

                const newRegister = await register.create({
                    type: searchClient.state,
                    note,
                    tiempo: time,
                    tags,
                    clientId: searchClient.id
                }).catch(err => {
                    console.log(err);
                    return null;
                })

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
            const { clientId, estado, asesorId, time, tags, direccion, url, fijo, nombreEmpresa, responsable, sector, cargo, note } = req.body;
        
            if(!clientId || !estado || !time || !nombreEmpresa || !responsable || !sector) return res.status(501).json({msg: 'Parametros invalidos'});
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
                direccion,
                fijo,
                url,
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
                    note,
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

    //Nota a registro 
    async newNote(req, res){ 
        try{
            const { note, tags, clientId } = req.body;
            
            if(!note || !clientId) return res.status(501).json({msg: 'Ha ocurrido un error en la principal.'});
            // Caso contrario, avanzamos

            const newRegister = await register.create({
                note:note,
                clientId,
                tiempo: new Date(),
                type: 'Nueva nota'
            }).catch(err => { 
                console.log(err);
                return null;
            }).catch(err => {
                console.log(err);
                return null;
            });

            if(!newRegister) return res.status(502).json({msg: 'No hemos podido crear este registro.'});

            // Caso contrario
            res.status(201).json(newRegister);
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },
    // CONTACTO
    // No contesto
    async dontCallContacto(req, res){
        try{
            const { clientId, tiempo, userId } = req.body;

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
                const programarTiempo = await calendario.create({
                    type:  `Volver a intentar - En ${estado}`,
                    fecha: tiempo,
                    clientId: searchClient.id,
                    userId: searchClient.userId

                }).catch(err => null);

                const newRegister = register.create({
                    type: estado,
                    tags: null,
                    note: 'No fue posible el contacto',
                    tiempo: tiempo,
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
            const { clientId, time, userId, type, note, tags } = req.body;

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
                state: 'espera',
                embudo: searchClient.state
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

                const newRegister = await register.create({
                    type: searchClient.state,
                    note,
                    tiempo: time,
                    tags,
                    clientId: searchClient.id
                }).catch(err => {
                    console.log(err);
                    return null;
                })

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
            const { clientId, tag, note, newState } = req.body;
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
                    clientId: searchClient.id,
                    note: `Perdido: ${note}` 
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
            const { clientId, note, estado, time, COTIZACION, nit, nro, fecha, bruto, descuento, iva, neto } = req.body;
        
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
                        type: 'Solicita una visita este cliente',
                        fecha: time,
                        clientId: searchClient.id,
                        userId: searchClient.userId
                    }).catch(err => null);
    
                    const newRegister = await register.create({
                        type: searchClient.state,
                        tags: null,
                        tiempo: date,
                        clientId: searchClient.id,
                        note
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
                        note,
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
            const { clientId, tag, note, newState } = req.body;
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
                    note: `Perdido: ${note}`,
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
                const { clientId, time, type, note, tags } = req.body;
    
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
                    state: 'espera',
                    embudo: searchClient.state
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

                    const newRegister = await register.create({
                        type: searchClient.state,
                        note,
                        tiempo: time,
                        tags,
                        clientId: searchClient.id
                    }).catch(err => {
                        console.log(err);
                        return null;
                    })
    
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
            const { clientId, note, nit, nro, fecha, bruto, descuento, iva, neto } = req.body;
        
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
                        note,
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

    // Crear directamente cotizacion.
    async createClientAndCotizacion(req, res){
        try{
            const { userId, name, phone, email, nombreEmpresa, url, fijo, cargo, direccion, fuenteId, 
                nit, nro, fecha, bruto, descuento, iva, neto
            } = req.body;

            // Validamos
            if(!userId || !name || !phone || !fuenteId) return res.status(501).json({msg: 'Parametros invalidos'})
            // Caso contrario
            const createClient = await client.create({
                name,
                phone,
                nombreEmpresa: nombreEmpresa,
                url: url,
                fijo: fijo,
                rangoEncargado: cargo,
                direccion: direccion,
                email: email,
                fuenteId,
                userId: userId,
                state: 'cotizacion'
            }).then(async (res) => {
                    console.log(res);

                    const createCotizacion = await cotizacion.create({
                        nit, 
                        nro, 
                        fecha, 
                        bruto,   
                        descuento, 
                        iva, 
                        neto,
                        clientId: res.id,
                        state: 'pendiente'
                    }).catch(err => {
                        console.log(err);
                        return null
                    }); 

                    return res
            })
            .catch(err => {
                console.log(err);
                return null;
            });

            if(!createClient) return res.status(502).json({msg: 'Ha ocurrido un error en la principal.'});

            res.status(201).json(createClient);
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },

    // Crear cliente y seleccionar parte del embudo.
    async createClientAndSelectEmbudo(req, res){
        try{
            // Recibimos parametros por body
            const { userId, name, phone, email, nombreEmpresa, url, fijo, cargo, direccion, fuenteId, 
                embudo, note, time, tags
            } = req.body;

            // Validamos que los datos entren correctamente.
            if(!userId || !phone || !name || !embudo || !fuenteId ) return res.status(501).json({msg: 'Ha ocurrido un error en la principal.'});


            // Caso contrario, avanzamos
            const date = new Date();
            // Cremoas cliente
            
            const createClient = await client.create({
                name,
                phone,
                nombreEmpresa: nombreEmpresa,
                url: url,
                fijo: fijo,
                rangoEncargado: cargo,
                direccion: direccion,
                email: email,
                fuenteId,
                userId: userId,
                state: embudo == 'llamada' ? 'contacto 1' : embudo == 'visita' ? 'visita' : null
            }).then(async (res) => {

                    const programarTiempo = await calendario.create({
                        type: embudo == 'llamada' ? 'Solicita una llamada' : embudo == 'visita' ? 'Solicita una visita este cliente' : null,
                        fecha: time,
                        clientId: res.id,
                        userId: userId

                    }).catch(err => null);

                    const newRegister = await register.create({
                        type: `Creado por el asesor`,
                        tags: tags,
                        tiempo: date,
                        note,
                        clientId: res.id,
                    }).catch(err => {
                        console.log(err);
                        return null;
                    })

                    return res
            })
            .catch(err => {
                console.log(err);
                return null;
            });

            if(!createClient) return res.status(502).json({msg: 'No hemos podido crear este cliente'});
            // Caso contrario, avanzamos...
            res.status(201).json({msg: 'Cliente creado con exito.'});
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },

    // Actualizar cotization
    async updateCotizacion(req, res){
        try{
            // Recibimos parametros por body
            const { cotizacionId, nit, nota, nro, bruto, iva, descuento, neto, userId, clientId } = req.body;

            // Validamos que los datos entren correctamente
            if(!cotizacionId || !nit || !nro || !bruto || !descuento || !userId) return res.status(501).json({msg:'Los parametros no son validos.'});
            
            
            // Caso contrario, avanzamos
            // Obtenemos la fecha actual
            const date = new Date();
            // Avanzamos a actualizar cotizacion
        
            const updateCotizacion = await cotizacion.update({
                nit,
                nro,
                bruto,
                IVA: iva ? iva : 0,
                descuento,
                neto

            },{
                where: {
                    id: cotizacionId
                }
            }).then(async (resu) => {
                console.log(resu);

                const newRegister = await register.create({
                    type: 'Cotizacion actualizada.',
                    tags: ["Cotizacion actualizada"],
                    tiempo: date,
                    note: nota,
                    clientId: clientId,
                }).catch(err => {
                    console.log(err);
                    return null;
                })
                return res
            }).catch(err => {
                console.log(err);
                return null;
            });

            if(!updateCotizacion) return res.status(502).json({msg: 'No hemos podido actualizar esto.'});
            // Caso contrario, avanzamos
            res.status(201).json({msg: 'Actualizado con exito.'});

        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'HA ocurrido un error en la principal.'});
        }
    },

    // DELETE CLIENT
    async DeleteClient(req, res){
        try{
            // Recibimos id por body.
            const { clientId } = req.params;

            if(!clientId) return res.status(501).json({msg: 'Parametro invalido'});
            // Caso contrario, avanzamos
            const removeCoti = await cotizacion.destroy({
                where: { clientId: clientId }
            })
            .catch(err => {
                console.log(err)
                return null
            });

            const removeTime = await calendario.destroy({
                where: { clientId: clientId}
            }).catch(err => null);


            const remove = await client.destroy({
                where: {
                    id: clientId
                }
            }).catch(err => {
                console.log(err)
                return null
            });

            

            
            if(!remove) return res.status(401).json({msg: 'no ha sido posible'});
            res.status(200).json({msg: 'Elimindo'})
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'HA ocurrido un error en la principal'});
        }
    },
    // Actualizar informacion del cliente
    async UpdateCliente(req, res){
        try{
            // Recibimos datos por body
            const { clientId, name, phone, email, nombreEmpresa, url, fijo, cargo, direccion } = req.body;
            // Validamos datos por body
            if(!name || !phone) return res.status(501).json({msg: 'Parametros no validos'});
        
            // Caso contrario, avanzamos
            const updateClient = await client.update({
                name,
                phone,
                email,
                nombreEmpresa,
                url,
                fijo,
                rangoEncargado:cargo,
                direccion,
            }, {
                where: {
                    id: clientId
                }
            }).catch(err => {
                console.log(err);
                return null;
            })

            if(!updateClient) return res.status(502).json({msg: 'No hemos podido actualizar esto.'});
            // Caso contrario
            res.status(201).json({msg: 'Actualizado con exito'});
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },
    // CAMBIAR DE ASESOR
    async ChangeClientOfAsesor(req, res){
        try{
            // Recibimos datos por body.
            const { asesorId, clientId } = req.body;

            // Enviamos señal.
            if(!asesorId || !clientId) return res.status(501).json({msg: 'Los parametros no son validos.'});

            // Avanzamos
            // Actualizamos cliente.
            const updateClient = await client.update({
                userId: asesorId,
                
            }, {
                where: {
                    id: clientId
                }
            }).catch(err => {
                console.log(err)
                return null
            });

            const updateCalendario = await calendario.update({
                userId: asesorId,
                
            }, {
                where: {
                    id: clientId
                }
            }).catch(err => null);

            if(!updateClient) return res.status(502).json({msg: 'Ha ocurrido un error en la principal.'});

            res.status(200).json({msg: 'Actualizado con exito'})
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'})
        }
    },
    // CAMBIAR COTIZACION A APROBADA O PERDIDA
    async changeStateToCotizacion(req, res){
        try{
            const { clientId, cotizacionId, stateEnter, note } = req.body;

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

            const createRegister = await register.create({
                    type: searchClient.state,
                    note: note ,
                    clientId: searchClient.id
            })
            .catch(err => {
                console.log(err);
                return null
            })
            
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
            
            const fechaAplazada = new Date(new Date(date).setDate(date.getDate() + 8))
            
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
                        note: 'Aplazando cotizacion 8 dias',
                        tiempo: date, 
                        clientId: searchClient.id,
                    }).catch(err => {
                        console.log(err);
                        return null;
                    })
                    
                    const nuevoTiempo = await calendario.create({
                        type: `Cotizacion aplazada`,
                        fecha: `${fechaAplazada.getMonth() + 1}-${fechaAplazada.getDate()}-${fechaAplazada.getFullYear()}`,
                        clientId: searchClient.id,
                        userId: searchClient.userId
    
                    }).catch(err => null);
    
                    return res
                })
                res.status(201).json({msg: 'Aplazamos la fecha de la cotizacion 7 dias!'});


        }catch(err){
            console.log(err);
            return res.status(500).json({msg: 'Error principal.'});
        }
    },


     // Obtener en lista de espera
     async getClientsOnEspera(req, res){
        try {
        
            const searchContactos = await client.findAll({
                where: {
                    state: 'espera',
                },
                include:[{
                    model: user,
                },{
                    model: cotizacion
                },{
                    model: register
                },{
                    model:calendario
                }],
                order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]
            }).catch(err => null);

        if(!searchContactos) return res.status(404).json({msg: 'No hay'});
        
        res.status(201).json(searchContactos);
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Error en la principal.'});
        }
    },
    // Obtener en lista de espera
    async getClientsOnEsperaByAsesor(req, res){
        try {
            const { asesorId } = req.params;
            if(!asesorId) return res.status(501).json({msg: 'Los parametros no son validos.'});
        
            const searchContactos = await client.findAll({
                where: {
                    state: 'espera',
                    userId: asesorId
                },
                include:[{
                    model: cotizacion
                },{
                    model: register
                },{
                    model:calendario
                }],
                order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]

            }).catch(err => null);

        if(!searchContactos) return res.status(404).json({msg: 'No hay'});
        
        res.status(201).json(searchContactos);
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Error en la principal.'});
        }
    },

    // PERDIDO
    
     // Obtener en lista de espera
     async getClientsOnPerdidoEspera(req, res){
        try {
        
            const searchContactos = await client.findAll({
                where: {
                    state: 'perdido',
                },
                include:[{
                    model: user,
                },{
                    model: cotizacion
                },{
                    model: register
                },{
                    model:calendario
                }],
                order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]
            }).catch(err => null);

        if(!searchContactos) return res.status(404).json({msg: 'No hay'});
        
        res.status(201).json(searchContactos);
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Error en la principal.'});
        }
    },
    
    // Obtener en lista de espera
    async getClientsOnPerdidoByAsesor(req, res){
        try {
            const { asesorId } = req.params;
            if(!asesorId) return res.status(501).json({msg: 'Los parametros no son validos.'});
        
            const searchContactos = await client.findAll({
                where: {
                    state: 'perdido',
                    userId: asesorId
                },
                include:[{
                    model: cotizacion
                },{
                    model: register
                },{
                    model:calendario
                }],
                order: [['updatedAt', 'DESC'], [{ model: register}, 'createdAt', 'DESC']]
            }).catch(err => null);

        if(!searchContactos) return res.status(404).json({msg: 'No hay'});
        
        res.status(201).json(searchContactos);
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Error en la principal.'});
        }
    }


}