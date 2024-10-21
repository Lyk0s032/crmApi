const express = require('express');
const { client, user, calendario, cotizacion, Op, Sequelize} = require('../db/db');


module.exports = {
    // Mostrar calendario
    async getCalendary(req, res){
        try{
            const calendario = await calendario.findAll().catch(err => null);

            if(!calendario) return res.status(404).json({msg: 'No encontramos nada'});
            // Caso contrario
            res.status(200).json(calendario)
        }catch(err){
            console.log(err);
            return null;
        }
    },
    // Mostrar calendario asesor
    async getCalendary(req, res){
        try{
            const {userId } = req.params;
            const calendario = await calendario.findAll({
                where: {
                    userId
                }
            }).catch(err => null);

            if(!calendario) return res.status(404).json({msg: 'No encontramos nada'});
            // Caso contrario
            res.status(200).json(calendario)
        }catch(err){
            console.log(err);
            return null;
        }
    },
    
}