const { DataTypes } = require('sequelize');

module.exports = sequelize => {
    sequelize.define('prospect', { 
        // Nombre
        name: {
            type: DataTypes.STRING
        },
        // Imagen de perfil
        phone:{
            type: DataTypes.STRING
        },
        // Email
        email:{
            type: DataTypes.STRING
        },
        // Razon
        razon: {
            type: DataTypes.STRING
        },
        // contacto
        contact: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        mes: {
            type: DataTypes.STRING 
        }, 
        // Estado...
        state: {
            type: DataTypes.STRING
        }
    })
}