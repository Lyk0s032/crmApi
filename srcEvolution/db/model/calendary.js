const { DataTypes } = require('sequelize');

module.exports = sequelize => {
    sequelize.define('calendario', { 
        // Tipo
        type: {
            type: DataTypes.STRING
        },
        // Fecha
        fecha:{
            type: DataTypes.STRING
        },

    })
}