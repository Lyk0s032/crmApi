const { DataTypes } = require('sequelize');

module.exports = sequelize => {
    sequelize.define('business', { 
        // Nombre
        nameBusiness: {
            type: DataTypes.STRING
        },
        // description
        description:{
            type: DataTypes.TEXT
        },
        // Photo
        photo:{
            type: DataTypes.TEXT      
        },
        type: {
            type: DataTypes.STRING
        },
        // Estado... Activo o innactivo
        state: {
            type: DataTypes.STRING
        }

    })
}