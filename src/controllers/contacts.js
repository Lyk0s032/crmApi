const express = require('express');
const { user, business, person_business, groupContact, contact, Op, Sequelize} = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Association } = require('sequelize');
const rounds = process.env.AUTH_ROUNDS || 10;
const secrete = process.env.AUTH_SECRET || 'WithGod';
const expires = process.env.AUTH_EXPIRES || "30d";


module.exports = {
    // Nuevo grupo para asignar contactos.
    async newGroup(req, res){
        try {
            // Recibimos datos por body
            const { bId, name, desc, type, password, state } = req.body;
            // Validamos los parametros.
            if(!bId || !name || !desc || !type) return res.status(501).json({msg: 'Los parametros no son validos.'});
            // Caso contrario, avanzamos...

            // Buscamos un grupo dentro de la empresa, que contenga ese nombre.
            const searchGroup = await groupContact.findOne({
                where: {
                    businessId: bId,
                    nameGroup: name
                }
            }).catch(err => {
                console.log(err);
                return null;
            });
            // Validamos la respuesta.
            if(searchGroup) return res.status(200).json({msg: 'Ya existe un grupo de contactos con este nombre. Por favor, intenta uno diferente.'});
            // Caso contrario, avanzamos...
            const newGroup = await groupContact.create({
                nameGroup: name,
                description: desc,
                type,
                password: password,
                segurity: password ? true : false,
                state: 'active'
            }).catch(err => {
                console.log(err);
                return null;
            });
            // Validamos la respuesta.
            if(!newGroup) return res.status(502).json({msg: 'No hemos podido crear este grupo.'});
            // Caso contrario, enviamos respuesta. 201. ¡Succesfull!
            res.status(201).json(newGroup);
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },
    async getAllGroups(req, res){
        try{
            // Los parametros entrar por params.
            const { bId } = req.params;
            // Validamos que el parametro entre correctamente.
            if(!bId) return res.status(501).json({msg: 'Los parametros no son validos.'});
            // Caso contrario, avanzamos...
            const searchGroup = await groupContact.findAll({
                where: {
                    businessId: bId,
                }
            }).catch(err => {
                console.log(err);
                return null;
            })

            if(!searchGroup) return res.status(404).json({msg: 'No hemos encontrado ningun grupo de contactos.'})

        }catch(err){
            console.log(err);
            res.status(501).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },
    // Asignar contacto al grupo.
    async newContact(req, res){
        try {
            // Recibimos parametros por body
            const { gCId, name, email, phone, website, type} = req.body;
            // Validamos que los parametros entren correctamente.
            if(!name || !email || !phone || !website || !type ) return res.status(501).json({msg: 'Los parametros no son validos'});
            // Caso contrario, avanzamos...
            const newContact = await contact.create({
                nameContact: name,
                email,
                phone, 
                website,
                type,
                state: 'active',
                groupContactId: gCId
            }).catch(err => {
                console.log(err);
                return null;
            });
            // Validamos la respuesta.
            if(!newContact) return res.status(502).json({msg: 'No hemos podido registrar este contacto.'});
            // Caso contrario, enviamos respuesta. Succesfull - 201!
            res.status(201).json(newContact)
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },
    // Eliminar un contacto
    async deleteContact(req, res){
        try {
            // Recibimos los datos por body.
            const { cId, bId, uId } = req.params;
            // Verificamos que los datos entren correctamente
            if(!cId || !bId || !uId) return res.status(501).json({msg: 'Ha ocurrido un error en la principal.'});

            // Avanzamos.
            // Buscamos que el usuario, exista dentro del proyecto
            const searchB = await business.findByPk(bId, {
                includes: [{
                    model: user,
                    through: {
                        attributes: [],
                        where: {
                            userId: uId
                        }
                    },
                    required: true
                }]
            }).catch(err => {
                console.log(err);
                return null;
            });

            if(!searchB) return res.status(404).json({msg: 'No hemos encontrado existencia en los datos.'});
            // Caso contrario, avanzamos...
            // Buscar contacto. Y Lo almancenamos en la variable.
            const searchC = await contact.findByPk(cId).catch(err => null);

            if(!searchC) return res.status(404).json({msg: 'No hemos encontrado este contacto.'});
            // De lo contrario, avanzamos...
            // Eliminar contacto
            const deleteContact = await contact.destroy({
                where: {
                    // Condiciones para eliminar.s
                    id: cId
                }
            }).catch(err => false);
            if(!deleteContact) return res.status(502).json({msg: 'Ha ocurrido un error al intentar eliminar.'});
            // Caso contrario,
            console.log('Eliminado con exito');
            res.status(204).json({msg: 'Eliminado con exitos.'});
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    }
}