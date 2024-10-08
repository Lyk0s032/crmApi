const { DataTypes } = require('sequelize');


module.exports = sequelize => {
    sequelize.define('contact', { 
        // Nombre
        nameContact: {
            type: DataTypes.STRING
        },
        // Email
        email:{
            type: DataTypes.STRING
        },
        // Phone
        phone: {
            type: DataTypes.STRING
        },
        // Email
        website:{
            type: DataTypes.STRING
        },
        // type
        type:{
            type: DataTypes.STRING
        },
        // State
        state: {
            type: DataTypes.STRING
        }
    })
}