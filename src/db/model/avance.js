const { DataTypes } = require('sequelize');


module.exports = sequelize => {
    sequelize.define('progress', { 
        // Nombre
        type: {
            type: DataTypes.STRING
        },
        // Title
        titleNote: {
            type: DataTypes.STRING
        },
        // Descripcion del proyecto...
        note:{
            type: DataTypes.STRING

        },
        priority: {
            type: DataTypes.STRING
        },
        // Estado del proyecto...
        state:{
            type: DataTypes.STRING
        }
    })
}