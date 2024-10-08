const { DataTypes } = require('sequelize');

module.exports = sequelize => {
    sequelize.define('business_configure', { 
        // Numero de trabajadores dentro de la empresa
        nroPerson: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // Habilitar cotizacion
        cotization:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        // Habitaliar chat entre miembros
        chat:{
            type: DataTypes.BOOLEAN,
            defaultValue: false

        },
        // Estado... Activo o innactivo
        public: {
            type: DataTypes.BOOLEAN,
            defaultValue: true

        },


    })
}