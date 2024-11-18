const express = require('express');
const { client, user,register,  calendario, cotizacion} = require('../db/db');
const { Op, literal, fn, col } = require('sequelize');
const dayjs = require('dayjs');



module.exports = {
    // Notificaciones
    async getNotifications(req, res){
        try {
            // Calculamos el rango exacto de las fechas
            const fechaActual = dayjs().format('MM/DD/YYYY') // Inicio del día actual
            const fechaLimite = dayjs().add(5, 'day').format('MM/DD/YYYY'); // Dos días después       
            const results = await calendario.findAll({
                where: literal(
                    `TO_DATE("calendario"."fecha", 'MM/DD/YYYY') BETWEEN TO_DATE('${fechaActual}', 'MM/DD/YYYY') AND TO_DATE('${fechaLimite}', 'MM/DD/YYYY')`
                ), 
                include:[{
                    model: client,
                    include:[{
                        model: user,
                    }, {
                        model: register  
                    }, {
                        model: cotizacion
                    }]  
                }],
                order:[literal(`TO_DATE("calendario"."fecha", 'MM/DD/YYYY') ASC`), [{model: client}, {model: register}, 'tiempo', 'DESC']],

            }).catch(err => {
                console.log(err);
                return null
            });

            if(!results ||!results.length) return res.status(404).json({msg: 'No hay resultados'});

            res.status(200).json(results)

        }catch(err){
            console.log(err);
            res.status(500).json({msg: 'Ha ocurrido un error en la principal'});
        }
    },

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