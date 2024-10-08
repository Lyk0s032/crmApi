const express = require('express');
const { user, business, person_business, groupContact, contact, client, prospect, origin, Op, Sequelize} = require('../db/db');


module.exports = {
    // Buscamos todos los clientes dentro del business
    async getAllClients(req, res){
        try{
            // Recibimos los parametros por params
            const { bId } = req.params;
            // Validamos el parametro
            if(!bId) return res.status(501).json({msg: 'Los parametros no son validos.'});
            // Buscamos el proyecto.

            const searchBusiness = await business.findByPk(bId, {
                include: [{
                    model: client,
                    attributes: ['nameClient', 'description', 'email', 'phone', 'state'],
                    required: true
                }]
            }).catch(err => {
                console.log(err);
                return null;
            });
            // Si no obtenemos resultado, Enviamos respuesta. 404 NotFound!
            if(!searchBusiness) return res.status(404).json({msg: 'No hemos encontra este business'})
            // Caso contrario, enviamos respuesta.
            res.status(200).json(searchBusiness);
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },
    // AGREGAMOS CLIENTE A UN PROYECTO.
    async newClient(req, res){
        try{    
            // Recibimos todos los datos por body
            const { bId, uId, name, description, website, type, email, phone } = req.body;
            // Validamos la entrada de datos
            if(!bId || !uId, !name || !description || !type || !email || !phone) return res.status(501).json({msg: 'Los parametros no son validos'});
            // Caso contrario, avanzamos...

            // Buscamos que el usuario tenga relacion con el proyecto.
            const searchBusiness = await business.findByPk(bId, {
                includes: [{
                    model: user,
                    through: {
                        attribues: [],
                        where: {
                            id: uId
                        }
                    }
                }]
            }).catch(err => {
                console.log(err);
                return null;
            });
            // Validamos que exista la empresa.
            if(!searchBusiness) return res.status(404).json({msg: 'Empresa no disponible.'});
            
            // Caso contrario, validamos que no exista un cliente con ese nombre.
            const searchClient = await client.findOne({
                where: {
                    nameClient:name,
                    businessId: bId
                }
            }).catch(err => {
                console.log(err);
                return null;
            });

            if(searchClient) return res.status(200).json({msg: 'Ya existe este cliente.'})
            // Caso contrario, creamos...
            const newUser = await client.create({
                nameClient:name,
                description,
                email,
                website,
                phone,
                type: 'type',
                state: 'active',
                businessId: bId
            }).catch(err => {
                console.log(err);
                return null;
            });
            // Validamos respuesta.
            if(!newUser) return res.status(404).json({msg: 'No ha sido posible crear este registro.'});
            // Caso contrario, avanzamos...
            res.status(201).json(newUser);

            
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },

    // Prospectos, obtener
    async getAllProspectByAsesor(req, res){
        try {
            // Recibimos el buscador por params.
            const { BId, AId, mes } = req.params;
            // Validamos los parametros
            if(!BId || !AId) return res.status(501).json({msg: 'Los parametros no son validos.'});
            
            // Consultamos
            const searchProspecto = await business.findOne({
                where: {
                    id: BId
                },
                include: [{
                    model: prospect,
                    where: {
                        mes: mes,
                        userId: AId
                    },
                    include: [{
                        model: origin,
                        attributes:['name']
                    }]
                }, {
                    model: user,
                    where: {
                        id: AId
                    }
                }]
            }).catch(err => {
                console.log('No hemos logrado hacer la consulta');
                return null;
            });

            if(!searchProspecto) return res.status(404).json({msg: 'No hay prospectos'})
            // Caso contrario
            res.status(200).json(searchProspecto);
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },

    // Prospectos, obtener
    async getAllProspect(req, res){
        try {
            // Recibimos el buscador por params.
            const { BId, mes } = req.params;
            // Validamos los parametros
            if(!BId || !mes) return res.status(501).json({msg: 'Los parametros no son validos.'});
            
            // Consultamos
            const searchProspecto = await business.findOne({
                where: {
                    id: BId
                },
                include: [{
                    model: prospect,
                    where: {
                        mes: mes,
                    },
                    include: [{
                        model: origin,
                        attributes: ['name']
                    }, {
                        model: user,
                        attributes:['nick', 'phone', 'name']
                    }]
                }]
            }).catch(err => {
                console.log('No hemos logrado hacer la consulta');
                return null;
            });

            if(!searchProspecto) return res.status(404).json({msg: 'No hay prospectos'})
            // Caso contrario
            res.status(200).json(searchProspecto);
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },
    // Get Prospecto
    async getProspect(req, res){
        try {
            // Recibimos datos por body
            const { PId, BId } = req.params;
            // Validamos
            if(!PId || !BId) return res.status(404).json({msg: 'Ha ocurrido un error.'});
            // Avanzamos...
            const searchProspect = await prospect.findOne({
                where: {
                    id: PId,
                    businessId: BId
                },
                include:[{
                    model:user,
                    attribues:['nick', 'name', 'photo']
                }]
            }).catch(err => {
                console.log(err);
                return null;
            });

            if(!searchProspect) return res.status(404).json({msg: 'No hemos encontrado este prospecto.'});
            // Caso contrario, enviamos
            res.status(200).json(searchProspect)
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    } 
    
}