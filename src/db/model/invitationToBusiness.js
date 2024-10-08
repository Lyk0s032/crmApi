const { DataTypes } = require('sequelize');


module.exports = sequelize => {
    sequelize.define('invitation', {
        // Who - Quien envio la invitacion
        who: {
            type: DataTypes.INTEGER
        },
        // Estado de la invitacion
        state:{
            type: DataTypes.STRING
        },
        // Tipo de invitacion
        type: {
            type: DataTypes.STRING
        },
        // Redes sociales
        range: {
            type: DataTypes.STRING
        },
        // Acceso a 
        accessTo:{
            type: DataTypes.JSON
        },
    }) 
}