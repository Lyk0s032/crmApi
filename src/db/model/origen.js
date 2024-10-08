const { DataTypes } = require('sequelize');

module.exports = sequelize => {
    sequelize.define('origin', { 
        // Nombre
        name: {
            type: DataTypes.STRING
        },
        // Phone
        description:{
            type: DataTypes.STRING
        },
        contact:{
            type: DataTypes.INTEGER
        },
        // Estado
        state:{
            type: DataTypes.STRING
        }
    })
}