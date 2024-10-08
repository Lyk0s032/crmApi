const { DataTypes } = require('sequelize');


module.exports = sequelize => {
    sequelize.define('groupContact', { 
        // Nombre
        nameGroup: {
            type: DataTypes.STRING
        },
        // description
        description:{
            type: DataTypes.STRING
        },
        // Email
        type:{
            type: DataTypes.STRING
        },
        // Password
        password: {
            type: DataTypes.STRING
        },
        // Segurity
        segurity: {
            type: DataTypes.BOOLEAN
        },
        // State
        state: {
            type: DataTypes.STRING
        }
    })
}