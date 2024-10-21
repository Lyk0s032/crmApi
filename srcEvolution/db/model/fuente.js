const { DataTypes } = require('sequelize');

module.exports = sequelize => {
    sequelize.define('fuente', { 
        // Nombre
        name: {
            type: DataTypes.STRING
        },
        // Imagen de perfil
        description:{
            type: DataTypes.STRING
        },
        // Estado... Activo o innactivo
        state: {
            type: DataTypes.STRING
        }

    })
}