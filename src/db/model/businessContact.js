const { DataTypes } = require('sequelize');


module.exports = sequelize => {
    sequelize.define('businessContact', { 
        // Nombre
        webSite: {
            type: DataTypes.STRING
        },
        // Imagen de perfil
        email:{
            type: DataTypes.STRING
        },
        // Phone
        phone:{
            type: DataTypes.STRING
        },
        // Redes sociales
        socialNetworks: {
            type: DataTypes.JSON
        },
        // Email
        ubication:{
            type: DataTypes.TEXT
        },
        // Password
        country: {
            type: DataTypes.STRING
        }
    })
}