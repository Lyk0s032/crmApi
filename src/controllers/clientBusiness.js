const express = require('express');
const { user, business, clientBusiness, person_business, project, progress, groupContact, contact, client, prospect, origin, Op, Sequelize} = require('../db/db');
const projects = require('../db/model/projects');


module.exports = {
    // Buscamos todos los clientes dentro del business
    async newClientBusiness(req, res){
        try{
            // Recibimos los datos por body
            const { nameBusiness, nameProspect, phoneProspect, photo, cargo, sector, BId, asesorId } = req.body;
            if(!nameBusiness || !nameProspect || !phoneProspect || !sector || !BId || !asesorId) return res.status(501).json({msg: 'Parametros invalidos.'});

            const newCl = await clientBusiness.create({
                name: nameBusiness,
                sector,
                photo,
                cargo,
                nameProspecto: nameProspect,
                phoneProspecto: phoneProspect,
                businessId: BId,
                userId: asesorId,
                state: 'active'
            }).catch(err => {
                console.log(err);
                return null;
            })
            if(!newCl) return res.status(502).json({msg:'Error al crear'});

            res.status(201).json(newCl);
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la princiapl.'});
        }
    },
    // Obtenemos todos los clientes.
    async getClientsBusiness(req,res){
        try{
            // Recibimos datos por params...
            const { businessId, asesorId, asesor } = req.params;
            // Validamos datos
            if(!businessId || !asesorId || !asesor) return res.status(501).json({msg: 'Parametros invalidos.'});

            // Avanzamos...
            if(asesor == 'false'){
                const searchData = await clientBusiness.findAll({
                    where: {
                        businessId: businessId,
                    },
                    include:[{
                        model: project,
                        required: false
                    },{
                        model: user
                    }]
                }).catch(err => {
                    console.log(err);
                    return null
                });
                if(!searchData) res.status(404).json({msg: 'No hemos encontrado clientes'});
                return res.status(200).json({
                    clientes: searchData,
                    from: 'General'
                });
            }else{
                const searchUser = await user.findOne({
                    where: {
                        id: asesorId,
                    },
                    attributes: ['id', 'nick', 'name', 'lastName', 'photo']

                }).catch(err => {
                    console.log(err);
                    return null
                });

                const searchByAsesor = await clientBusiness.findAll({
                    where: {
                        businessId: businessId,
                        userId: asesorId
                    },
                    include:[{
                        model:project,
                        required: false
                    },{
                        model: user,
                        attributes:['nick', 'name', 'lastName', 'photo']
                    }]
                }).catch(err => {
                    console.log(err);
                    return null;
                });
                if(!searchByAsesor || !searchByAsesor.length) return res.status(200).json({
                    clientes: null,
                    de: null,
                    asesor: searchUser
                });
                // Caso contrario, mostramos resultados
                return res.status(200).json({
                    clientes: searchByAsesor,
                    de: searchByAsesor.user,
                    asesor: searchUser
                });
            }
            
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },
    // GET CLIENTE POR ID
    async getClientById(req, res){
        // Try
        try{
            const { ClientId } = req.params;
            // Validamos que los parametros entren correctamente
            if(!ClientId) return res.status(501).json({msg:'Parametro invalido.'});
            // Caso contrario, buscamos cliente
            const searchClient = await clientBusiness.findOne({
                where: {
                    id: ClientId
                },
                include: [{
                    model: user,
                    attributes:['id', 'name', 'lastName', 'nick']
                },{
                    model: project,
                    required:false
                }]
            }).catch(err => {
                console.log(err);
                return null;
            });

            if(!searchClient) return res.status(404).json({msg: 'No hemos encontrado este usuario.'});
            // Enviamos respuesta.
            res.status(200).json(searchClient)
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    }, 
    // Obtenemos todos los asesores
    async getAllProspects(req, res){
        try{
            // Recibimos datos por params...
            const { businessId, asesorId, mes, asesor } = req.params;
            // Validamos datos
            if(!businessId || !asesorId || !mes || !asesor) return res.status(501).json({msg: 'Parametros invalidos.'});

            // Avanzamos...
            if(asesor == 'false'){
                const searchData = await prospect.findAll({
                    where: {
                        businessId: businessId,
                        mes:mes
                    },
                    include:[{
                        model: user
                    }]
                }).catch(err => {
                    console.log(err);
                    return null
                });
                if(!searchData) res.status(404).json({msg: 'No hemos encontrado clientes'});
                
                const filterNew = searchData.length ? searchData.filter(item => item.state == 'new') : 0;
                const filterLost = searchData.length ? searchData.filter(item => item.state == 'lost') : 0;
                const filterTry = searchData.length ? searchData.filter(item => item.state == 'try') : 0;
                
                return res.status(200).json({
                    prospectos: searchData,
                    from: 'General',
                    new: filterNew.length,
                    try: filterTry.length,
                    lost: filterLost.length,
                    mes,
                    asesor: null
                }); 
            }else{
                const searchUser = await user.findOne({
                    where: {
                        id: asesorId,
                    },
                    attributes: ['id', 'nick', 'name', 'lastName', 'photo']

                }).catch(err => {
                    console.log(err);
                    return null
                });
                if(!searchUser) return res.status(404).json({msg: 'No hemos encontrado este usuario.'});
                const searchByAsesor = await prospect.findAll({
                    where: {
                        businessId: businessId,
                        userId: asesorId,
                        mes: mes
                    },
                    include:[{
                        model: user,
                        attributes:['nick', 'name', 'lastName', 'photo']
                    }]
                }).catch(err => {
                    console.log(err);
                    return null;
                });
                if(!searchByAsesor || !searchByAsesor.length) return res.status(404).json({msg: 'No hemos encontrado prospectos'});
                // Caso contrario, mostramos resultados
                
                const filterNew = searchByAsesor.length ? searchByAsesor.filter(item => item.state == 'new') : 0;
                const filterLost = searchByAsesor.length ? searchByAsesor.filter(item => item.state == 'lost') : 0;
                const filterTry = searchByAsesor.length ? searchByAsesor.filter(item => item.state == 'try') : 0;
       
                return res.status(200).json({
                    prospectos: searchByAsesor,
                    de: searchByAsesor.user,
                    new: filterNew.length,
                    try: filterTry.length, 
                    lost: filterLost.length,
                    mes,
                    asesor: searchUser
                });
            }
            
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },
    // NUEVO PROJECTO
    async newProject(req, res){
        try{
            // Recibimos datos por body
            const { nameProject, tags, businessId, clientId, } = req.body;
            // Validamos parametros
            if(!nameProject || !tags || !businessId || !clientId) return res.status(501).json({msg: 'Los parametros no son validos.'});
            
            // Avanzamos
            const createProject = await project.create({
                nameProject,
                objetivo: tags,
                businessId,
                clientBusinessId: clientId,
                state: 'active'
            }).catch(err => {
                console.log(err);
                return null;
            });

            if(!createProject) return res.status(502).json({msg: 'No hemos podido crear'});
            // Caso contrario, enviamos respuesta del registro creado.
            res.status(201).json(createProject);
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },
    // GET PROJECT
    async getProjectById(req, res){
        // Try
        try{
            const { projectId } = req.params;
            // Validamos que los parametros entren correctamente
            if(!projectId) return res.status(501).json({msg:'Parametro invalido.'});
            // Caso contrario, buscamos cliente
            const searchProject = await project.findOne({
                where: {
                    id: projectId
                },
                include: [{
                    model: clientBusiness,
                },{
                    model: progress,
                    include:[{
                        model: user
                    }],
                }],
                order: [
                    ['createdAt', 'DESC'], // Ordenar los posts por su fecha
                    [{ model: progress}, 'createdAt', 'DESC'] // Ordenar comentarios por fecha
                ]

            }).catch(err => {
                console.log(err);
                return null;
            });

            if(!searchProject) return res.status(404).json({msg: 'No hemos encontrado este proyecto.'});
            // Enviamos respuesta.
            res.status(200).json(searchProject)
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    }, 
    async newNoteProgress(req,res){
        try{
            // Recibimos datos por body
            const { type, titleNote, note, priority, projectId, asesorId} = req.body;
            // Validamos parametros
            if(!type || !note || !projectId || !asesorId) return res.status(501).json({msg: 'Los parametros no son validos.'});
            
            // Avanzamos
            const createProgress = await progress.create({
                type,
                titleNote: titleNote ? priority : null,
                note: note,
                priority: priority ? priority : 'normal',
                projectId,
                userId: asesorId
            }).catch(err => {
                console.log(err);
                return null;
            });

            if(!createProgress) return res.status(502).json({msg: 'No hemos podido crear'});
            // Caso contrario, enviamos respuesta del registro creado.
            res.status(201).json(createProgress);
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal'});
        }
    }
    
} 