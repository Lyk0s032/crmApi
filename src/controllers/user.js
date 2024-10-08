const express = require('express');

const { user, business, invitation, person_business } = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rounds = process.env.AUTH_ROUNDS || 10;
const secrete = process.env.AUTH_SECRET || 'WithGod';
const expires = process.env.AUTH_EXPIRES || "30d";
const authConfig = require('../config/auth');

module.exports = {
    async getPeople(req, res){ 
        res.send('Funciona asas');
    },
    // Validamos email, sign
    async validatePhone(req, res){
        try{
            // Recibimos datos por params
            const { phone } = req.params;
            
            // Validamos que entre correctamente el dato
            if(!phone) return res.status(501).json({msg: 'Los parametros no son validos'});
            // Caso contrario, avanzamos...
            const searchUser = await user.findOne({
                where: {
                    phone: phone,
                    state: 'active'
                },
                attributes: ['name', 'lastName', 'nick', 'phone']
            }).catch(err => {
                console.log(err);
                return null;
            });

            // Si no existe el usuario, enviamos respuesta 404. ¡Not Found!
            if(!searchUser) return res.status(404).json({msg: 'Usuario no encontrado.'});
            // Caso contrario, avanzamos...
            res.status(200).json(searchUser)
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },

    // Creamos cuenta a nuevo usuario.
    async signUp(req, res){
        try{
            // Recibimos valores por body
            const { name, lastName, nick, pass, email, phone, sexo } = req.body;
            // Validamos que los parámetros sean correctos
            if(!name || !nick || !pass || !email || !phone) return res.status(501).json({msg: 'Los parámetros no son validos.'});

            // Hasheamos la contraseña
            const passwordy = String(pass); // Pasamos la contraseña a STRING
            let password = bcrypt.hashSync(passwordy, Number.parseInt(rounds)); // Finalizamos Hasheo

            // Validamos que no exista un correo igual
            const searchEmail = await user.findOne({
                where: {
                    email
                }
            }).catch(err => null);

            if(searchEmail) return res.status(502).json({msg: 'Ya existe una cuenta con este email'});

            const searchPhone = await user.findOne({
                where: {
                    phone
                }
            }).catch(err => null); 
            
            // Validamos que no exista el número
            if(searchPhone) return res.status(502).json({msg: 'Este numero de telefono ya esta en uso'});

            // Creamos el usuario.
            const createUser = await user.create({
                name,
                lastName: lastName ? lastName : null,
                nick,
                email,
                password,
                phone: phone,
                photo: 'default',
                age: null,
                state: 'active'
            }).then(user => {
                let token = jwt.sign({user:user}, secrete, {
                    expiresIn: expires 
                });
                let retornado = {
                    token: token
                }
                return retornado;

            }).catch(err => {
                console.log(err);
                return null;
            });

            // Si no crea el usuario, envia un error
            if(!createUser) return res.status(401).json({msg: 'Ha ocurrido un problema'});
            // Si lo crea, enviamos una respuesta positiva. 201
            res.status(201).json(createUser);

            
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },
    // Iniciar sesion
    async signIn(req, res){
        try{
            const { phone, password} = req.body;

            const usuario = await user.findOne({
                where: {
                    phone:phone
                },
                include:[{
                    model:business
                }]
            }).catch(err => {
                console.log(err);
                return null;
            });
            if(!usuario) {
                console.log('No hemos encontrado este usuario.');
                return res.status(404).json({msg: 'Usuario no encontrado'});
            }

            if(bcrypt.compareSync(password, usuario.password)){
                let token = jwt.sign({user: usuario}, authConfig.secret, {
                    expiresIn: authConfig.expires
                });
                res.status(200).header('auth_token').json({
                    error: null,
                    data: token
                })
            }else{
                // No autoriza el acceso.
                console.log('error aca');
                res.status(401).json({msg: 'La contraseña no es valida.'});
            }
        
        
        }catch(err){
            console.log(err);
            res.status(501).json(err);
        }
    },
    // Buscamos el usuario por ID
    async getUserById(req, res){
        try{
            // Recibimos el id por Params
            const { uId } = req.params;

            // Validamos que el parametro entre correctamente
            if(!uId) return res.status(501).json({msg: 'Los parametros no son validos.'});

            // Caso contrario, avanzamos...
            const searchUser = await user.findByPk(uId).catch(err => {
                console.log(err);
                return null
            });
            // Validamos la respuesta
            if(!searchUser) return res.status(404).json({msg: 'No hemos encontrado este usuario.'});

            // Caso contrario, devolvemos el usuario
            res.status(200).json(searchUser);
        }catch(err){
            console.log(err);
            res.status(501).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    },

    // Buscar invitacion - responder
    async responseInvitation(req, res){
        try{
            // Recibimos los datos por body
            const { IId, BId, userId, response } = req.body;
            // Validamos que los parametros entren correctamente.
            if(!BId || !userId) return res.status(501).json({msg: 'Los parametros no son validos.'});
            // Caso contrario, avanzamos...

            // Buscamos la invitacion...
            const searchInvitation = await invitation.findOne({
                where: {
                    id: IId,
                    userId: userId,
                    businessId: BId
                }
            }).catch(err => {
                console.log(err);
                return null;
            });
            // Verificamos que exista.
            if(!searchInvitation) return res.status(404).json({msg: 'No hemos encontrado esta invitacion'});
            // Caso contrario, avanzamos...
            
            //  Verificamos si ya es miembro
            if(searchInvitation.state == 'true') return res.status(201).json({msg: 'ya eres miembro'});
            
            // Actuamos segun la respuesta
            if(response == false){
                const deleteInvitation = await invitation.destroy({
                    where: {
                        id: IId
                    }
                })
                return res.status(201).json({msg: 'Eliminado con exito!'})
            }
            const updateInvitation = await invitation.update({
                state: 'true'
            }, {
                where: {
                    id: IId,
                }
            })
            .then(async (res) => {
                const addUserToBusiness = await person_business.create({
                    businessId: BId,
                    userId,
                    range: searchInvitation.range,
                })

                return addUserToBusiness
            })
            .catch(err => {
                console.log(err);
                return false;
            });

             // Si no actualiza, envia respuesta
            if(!updateInvitation) return res.status(502).json({msg: 'ha ocurrido un error en la principal'})
            // Caso contrario, avanzamos...
            res.status(201).json(updateInvitation)
            
           
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal'});
        }
    },


    // Informacion para el panel
    async getUserPanel(req, res){
        try {
            // Recibimos parametros por params.
            const { uID } = req.params;

            // Buscamos...
            const searchU = await user.findOne({
                where: {
                    id: uID,
                },
                includes: [{
                    model: business,
                    through: {
                        attributes: [],
                    },
                    required: true
                }],
            }).catch(err => {
                console.log(err);
                return null;
            });
            if(!searchU) return res.status(404).json({msg: 'No hemos encontrado este panel'});
            // Caso contrario, avanzamos...
            res.status(200).json(searchU);
        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal.'});
        }
    }
} 