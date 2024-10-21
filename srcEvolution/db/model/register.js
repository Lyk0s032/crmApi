const { DataTypes } = require('sequelize');

module.exports = sequelize => {
    sequelize.define('register', { 
        // Intento 1
        type: {
            type: DataTypes.STRING
        },
        // tags
        tags:{
            type: DataTypes.ARRAY(DataTypes.STRING)
        },
        // nota
        note: {
            type: DataTypes.STRING
        },
        // Neto
        tiempo: {
            type: DataTypes.DATE
        },


    })
}