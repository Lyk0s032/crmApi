const { DataTypes } = require('sequelize');


module.exports = sequelize => {
    sequelize.define('client', { 
        // Nombre
        nameClient: {
            type: DataTypes.STRING
        },
        // Imagen de perfil
        description:{
            type: DataTypes.STRING
        },
        // Email
        email:{
            type: DataTypes.STRING
        },
        website:{
            type: DataTypes.STRING
        },
        // Phone
        phone: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.STRING
        },
        // State
        state: {
            type: DataTypes.STRING
        }
    })
}