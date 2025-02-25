const express = require('express');
const { client, user, calendario, fuente, cotizacion, register, Op, Sequelize} = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rounds = process.env.AUTH_ROUNDS || 10;
const secrete = process.env.AUTH_SECRET || 'WithGod';
const expires = process.env.AUTH_EXPIRES || "30d";
const authConfig = require('../config/auth');

module.exports = {
        // Creamos cuenta a nuevo usuario.
        async signUp(req, res){
            try{
                // Recibimos valores por body
                const { name, lastName, nick, pass, email, phone, rango } = req.body;
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
                    state: 'active',
                    rango
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
                    }
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
}
