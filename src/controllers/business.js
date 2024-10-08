const express = require('express');
const { user, business, person_business, invitation, business_configure, businessContact, origin, prospect, Op, Sequelize } = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Association } = require('sequelize');
const rounds = process.env.AUTH_ROUNDS || 10;
const secrete = process.env.AUTH_SECRET || 'WithGod';
const expires = process.env.AUTH_EXPIRES || "30d";


module.exports = {
    // Obtenemos lista de business
    async getBusiness(req, res){
        try{
            // Procedemos a buscar...
            const searchBusiness = await business.findAll({
                where: {
                    state: 'active'
                }
            }).catch(err => {
                console.log(err);
                return null;
            });
    
            // Verificamos que recibamos informacion 
            if(!searchBusiness || !searchBusiness.lenght) return res.status(404).json({msg: 'No hay business disponibles.'});
            // Caso contrario, mostramos los resultados. Succesfull 201!
            res.status(201).json(searchBusiness);
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },
    // Buscamos dispositivos en particular
    async getBusinessById(req, res){
        try{
            // Recibimos los datos por params
            const { bId } = req.params;
            // Verificamos que los parametros entren correctamente.
            if(!bId) return res.status(501).json({msg: 'Los parametros no son validos.'})
            // Caso contrario, avanzamos...
                
            const searchBusinessById = await business.findByPk(bId, {
                include: [{
                    model: user,
                    through: {
                        attributes: [],
                    },
                    required: true,
                },{
                    model: business_configure,
                    required: true
                },{
                    model: businessContact,
                }]
            }).catch(err => {
                console.log(err);
                return null;
            });
            // Si no hay resultado, enviamos respuesta. 404
            if(!searchBusinessById) return res.status(404).json({msg: 'No hemos encontrado esta empresa.'});
            
            // Caso contrario, avanzamos.
            res.status(201).json(searchBusinessById)
        }catch(err){
            console.log(err);
            return null;
        }
    
    },

    // GETBUSINESS LOGUEADO
    async getBusinessLogin(req, res){
        try{
            // Recibimos datso por body
            const { BId, UId } = req.params;
            // VAlidamos que los datos entren correctamente
            if(!BId || !UId) return res.status(501).json({msg:'Los parametros no son validos'});
            // Caso contrario, avanzamos
            
            // Buscamos el business.
            const searchBusiness = await business.findOne({
                where: {
                    id: BId
                },
                include:[{
                    model: user,
                    where: {
                        id: UId
                    }
                }]
            });

            if(!searchBusiness) return res.status(404).json({msg: 'No hemos encontrado esto.'});
            
            // Avanzamos
            res.status(200).json(searchBusiness);
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal'});
        }
    },
    // Nuevo prospecto
    async newOrigin(req, res){
        try{
            // Recibimos valores por body
            const { name, description, BId } = req.body;
            // Validamos que los datos entren correctamente
            if(!name || !description || !BId) return res.status(501).json({msg: 'Los parametros no son validos.'});

            // Validamos que no exista ya
            const searchOrigin = await origin.findOne({
                where: {
                    businessId: BId
                }
            }).catch(err => {
                console.log(err);
                return null
            });

            if(searchOrigin) return res.status(200).json({msg: 'Ya existe'});
            // Caso contrario
            const newOrigen = await origin.create({
                name,
                description,
                state:'active',
                businessId: BId
            }).catch(err => {
                console.log(err);
                return null;
            });

            if(!newOrigen) return res.status(502).json({msg: 'No hemos podido registrar este Origen de prospecto'});
            // Caso contrario
            res.status(201).json(newOrigen);
        }catch(err) {
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    }, 
    // GET BUSINESS BY ID AND USER
    async getBusinessOpen(req, res){
        try{
            // Recibimos datos por body
            const { BId, UId } = req.params;
            // Verificamos que los datos entren correctamente
            if(!BId || !UId) return res.status(501).json({msg: 'Los parametros no son validos.'});

            // Caso contrario, avanzamos
            const searchBusiness = await business.findOne({
                where: {
                    id: BId
                },
                include:[{
                    model: user,
                    attributes: ['nick', 'name', 'lastName', 'email', 'phone'],
                    where: {
                        id: UId
                    }
                }]
            }).catch(err => {
                console.log(err);
                return null;
            });

            if(!searchBusiness) return res.status(404).json({msg: 'Ha ocurrido un error en la principal'});

            // Avanzamos
            res.status(200).json(searchBusiness);
        }catch(err){
            console.log(err);
            res.status(500).json({msg:'Ha ocurrido un error en la principal.'});
        }
    },
    // Registramos nuevo prospecto
    async newProspect(req, res){
        try{
            // Recibimos datos por body
            const { originId, name, phone, email, razon, asesorId, BId, mes } = req.body;

            // Validamos los datos
            if(!originId || !name || !phone) return res.status(501).json({msg: 'Ha ocurrido un error en los parametros'})
            
            // Avanzamos
            const createProspect = await prospect.create({
                name,
                phone,
                email: email ? email : null,
                razon: razon ? razon : null,
                state: 'new',
                originId,
                userId: asesorId,
                mes: mes,
                businessId: BId
            }).catch(err => {
                console.log(err);
                return null
            });

            if(!createProspect) return res.status(502).json({msg: 'No hemos podido avanzar'});
    
            // Enviamos
            res.status(201).json(createProspect);
        
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },
    // Llamada positiva
    async called(req, res){
        try{
            const { PId } = req.params;
            
            const searchContact = await prospect.findOne({
                where: {
                    id: PId
                }
            }).catch(err => null);

            const updateProspect = await prospect.update({
                state: 'called',
                contact: searchContact.contact + 1 
            }, {
                where:{
                    id: PId
                }
            }).catch(err => {
                console.log(err);
                return null
            } );

            if(!updateProspect) return res.status(502).json({msg: 'No se ha actualizado'});
            res.status(201).json({msg: 'Actualizado'});
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },
    // Actualizar business
    async dontCall(req, res){
        try{
            // Recibimos datos por body.
            const { BId, PId } = req.params;
            const { bandeja } = req.body;
            // Validamos
            if(!BId || !PId) return res.status(404).json({msg: 'Los parametros no son validos..'});

            // Buscamos PID
            const searchProspect = await prospect.findOne({
                where: {
                    id: PId,
                    businessId: BId
                }
            }).catch(err => {
                console.log(err);
                return null
            });
            if(!searchProspect) return res.status(404).json({msg: 'No hemos encontrado esto.'});
        
            // Continuamos
            if(searchProspect.contact >= 2){
                const update = await prospect.update({
                    state: bandeja,
                    contact: Number(searchProspect.contact) + Number(1),
                }, {
                    where: {
                        id: PId
                    }
                }).catch(err => null);
                // Avanzamos
                return res.status(200).json({msg: 'Actualizado.'});
            }else{
                const update = await prospect.update({
                    state: 'try',
                    contact: Number(searchProspect.contact) + Number(1),
                    
                }, {
                    where: {
                        id: PId
                    }
                }).catch(err => null);
                return res.status(200).json({msg: 'Aumento a intento' + searchProspect.contact + 1})
            }
        }catch(err){
            console.log(err);
            res.status(500).json({msg:'Ha ocurrido un error en la principal'})
        }
    },
    // Nunca contesto
    async neverCall(req, res){
        try {
            // Recibimos datos por params
            const { PId, state} = req.params
            // Validamos que los datos entren correctamente
            if(!PId || !state) return res.status(501).json({msg: 'Los parametros no son validos.'});
            // caso contrario, avanzamos...
            
            const sendProspect = await prospect.update({
                state
            },{
                where: {
                    id: PId
                }
            }).catch(err => {
                console.log(err);
                return null;
            });
            // Verificamos la respuesta
            if(!sendProspect) return res.status(502).json({msg: 'No hemos podido, enviar este prospecto a la bandeja.'});
            // Caso contrario, enviamos respuesta con estado 200. ¡Succesful
            res.status(200).json({msg: 'Actualizado.'});
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal'});
        }
    },

    // Crear business - Primer paso
    async newBusiness(req, res){ 
        try{
             // Recibimos los datos por body
            const { Uid, name, description, type } = req.body;
            // Validamos que los datos entren correctamente
            if(!name || !description || !type) return res.status(501).json({msg: 'Los parametros no son validos.'});
            // Caso contrario, avanzamos...
            
            // Buscamos que el usuario, exista.
            const searchUser = await user.findByPk(Uid).catch(err => null);
            // Si no encontramos el usuario, enviamos respuesta. 404 ¡Not found!
            if(!searchUser) return res.status(404).json({msg: 'No hemos encontrado este usuario'});
            // Caso contrario, avanzamos...
            
            // Buscamos que no exista un business registrado con el mismo nombre y el ID del usuario creador.
            const searchBusiness = await business.findOne({
                where: {
                    nameBusiness: name,
                },
                includes: [{
                    model: person_business,
                    as: 'person_business',
                    where: {
                        userId: Uid,
                        range: 'admin'
                    },
                    required: true
                }]
            })
            .catch((err) => {
                console.log(err);
                return null;
            });
            // Validamos la respuesta.
            if(searchBusiness) return res.status(502).json({msg: 'Ya existe un proyecto con este nombre.'});
            
            // Caso contrario, procedemos a crear el proyecto. 
            const newBusiness = await business.create({
                nameBusiness: name,
                description,
                photo: null,
                type,
                state: 'configuring'
            })
            .then(async (data) => {
                console.log(data.id);
                const addPerson = await person_business.create({
                    userId: Uid,
                    businessId: data.id,
                    range: 'admin',
                    accessTo: null
                });

                return data
            })
            .catch(err => {
                console.log(err);
                return null;
            });
            // Si no hay resultado, enviamos error 401. We can't created!
            if(!newBusiness) return res.status(401).json({msg: 'No ha sido posible crear este proyecto...'});
            // Caso contrario, successful! 201.
            res.status(201).json(newBusiness);

        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },
    // Configuracion del business - SEGUNDA
    async configureBusiness(req, res){
        try{
            // Recibimos datos
            const { BId, UId, nroPerson, cotization, chat, public } = req.body;
            // Verificamos que los parametros entren correctamente
            if(!BId || !UId || !nroPerson) return res.status(404).json({msg: 'Los parametros no son validos'});
            // Caso contrario, avanzamos...

            // Verificamos que exista un business con esas condiciones.
            const searchConexionBusiness = await business.findByPk(BId,{
                
                include: [{
                    model: user,
                    attributes: ['name', 'lastName', 'nick', 'phone', 'email'],

                    through: {
                        attributes: [],
                        where: {
                            userId: UId
                        }
                    }
                }]
               
            }).catch(err => {
                console.log(err);
                return null;
            });
            // Si no existe un registro, enviamos respuesta. 404. NotFound!
            if(!searchConexionBusiness) return res.status(404).json({msg:'No hemos encontrado este proyecto.'});
            // Caso contrario, avanzamos...

            if(searchConexionBusiness.users) return res.status(201).json({msg: 'Ya existe una configuracion'})
            // Añadimos la configuracion
            const addConfiguration = await business_configure.create({
                nroPerson,
                cotization: cotization,
                chat: chat,
                public: public ,
                businessId: BId
            }).catch(err => {
                console.log(err);
                return null;
            })
            // Si no hay registro, enviamos error
            if(!addConfiguration) return res.status(401).json({msg: 'No hemos podido configurar este proyecto.'});
            // Caso contrario, enviamos respuesta. 201 ! Succesfull
            res.status(201).json(addConfiguration);

        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },
    // BUSINESS CONTACT
    async addContactInformationBusiness(req, res){
        try{
            // Recibimos datos por body.
            const { BId, website, phone, email,  socialnetworks, ubication, country } = req.body;
            // Verificamos que los datos entren correctamente
            if(!phone || !country || !email) return res.status(501).json({msg: 'Ha ocurrido un error'});
            // Caso contrario, avanzamos...

            // Verificamos que exista el business 
            const searchB = await business.findByPk(BId, {
                include: [{
                    model: businessContact,
                }]
            }).catch(err => {
                console.log(err);
                return null;
            })
            // Si no existe, enviamos respuesta. 404 !NotFound
            if(!searchB) return res.status(404).json({msg: 'No hemos encontrado este business.'});
            // Caso contrario, avanzamos...
            // Validamos que no contenga una configuracion.
            if(searchB.businessContact) return res.status(502).json({msg: 'La informacion de contacto, ya esta configurada.'});
            // Caso contrario, avanzamos..
            const addInformation = await businessContact.create({
                webSite: website,
                phone,
                email,
                socialNetworks: socialnetworks,
                ubication,
                country,
                businessId: BId
            }).catch(err => {
                console.log(err);
                return null
            });
            // Si no crea, enviamos respuesta. 
            if(!addInformation) return res.status(504).json({msg: 'Ha ocurrido un error, no hemos podido acceder.'})
            // Caso contrario, avanzamos...
            res.status(201).json(addInformation)
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },

    // INVITACIONES PARA PARTICIPAR EN BUSINESS.
    async sendInvitation(req, res){
        try {
            // Recibimos datos por body.
            const { who, BId, range, accessTo, userId } = req.body;
            // Validamos que los datos entren correctamente.
            if(!who || !BId || !range || !accessTo || !userId) return res.status(501).json({msg: 'Los parametros no son validos'});
            // Caso contrario, avanzamos...
            // Vericiamos que el usuario que envia la invitacion, sea miembro del equipo.
            const searchUB = await business.findByPk(BId, {
                include: [{
                    model: user,
                    attributes: ['name', 'lastName', 'nick', 'phone', 'email'],
                    through: {
                        attributes: [],
                        where: {
                            userId: who
                        }
                    },
                    required: true
                }]
            }).catch(err => {
                console.log(err);
                return null;
            });
            // Validamos que hayan datos.
            if(!searchUB) return res.status(404).json({msg: 'No hemos encontrado esta empresa.'});
            
            // Caso contrario, avanzamos...
            const searchInvitation = await invitation.findOne({
                where: {
                    businessId: BId,
                    userId: userId,
                    [Op.or]: [ 
                        { state: 'true' },
                        { state: 'pending' }
                    ]
                }
            }).catch(err => {
                console.log(err);
                return null;
            });
            // Verificamos si realmente exise una invitacion
            if(searchInvitation) {
                if(searchInvitation.state == 'pending') return res.status(203).json({msg: 'Ya hay una invitacion pendiente.'}); 
                if(searchInvitation.state == true) return res.status(200).json({msg: 'Ya es miembro de este proyecto'});
            }
            // Enviamos la invitacion
            const sendInvitation = await invitation.create({
                who,
                businessId: BId,
                range,
                accessTo,
                userId,
                state: 'pending'
            }).catch(err => {
                console.log(err);
                return null;
            });
            // Validamos
            if(!sendInvitation) return res.status(502).json({msg: 'No hemos podido ingresar esto a la cuenta.'});
            // enviamos respuesta
            res.status(201).json(sendInvitation)

        }catch(err){
            console.log(err);
            res.status(501).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    }

}  