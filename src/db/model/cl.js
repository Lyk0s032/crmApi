const { DataTypes } = require('sequelize');


module.exports = sequelize => {
    sequelize.define('clientBusiness', { 
        // Nombre
        name: {
            type: DataTypes.STRING
        },
        sector:{
            type: DataTypes.STRING
        },
        // Email
        nameProspecto:{
            type: DataTypes.STRING
        },
        phoneProspecto:{
            type: DataTypes.STRING
        },
        photo:{
            type: DataTypes.TEXT
        },
        cargo:{
            type: DataTypes.STRING
        }, 
        // State
        state: {
            type: DataTypes.STRING
        }
    })
}