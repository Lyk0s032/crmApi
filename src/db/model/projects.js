const { DataTypes } = require('sequelize');


module.exports = sequelize => {
    sequelize.define('project', { 
        // Nombre
        nameProject: {
            type: DataTypes.STRING
        },
        // Descripcion del proyecto...
        objetivo:{
            type: DataTypes.ARRAY(DataTypes.STRING)

        },
        // Estado del proyecto...
        state:{
            type: DataTypes.STRING
        }
    })
}