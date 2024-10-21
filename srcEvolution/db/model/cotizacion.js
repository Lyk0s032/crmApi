const { DataTypes } = require('sequelize');

module.exports = sequelize => {
    sequelize.define('cotizacion', { 
        // NIT
        nit: {
            type: DataTypes.STRING
        },
        // Nombre
        nro: {
            type: DataTypes.STRING
        },
        // Fecha
        fecha:{
            type: DataTypes.STRING
        },
        // Bruto
        bruto: {
            type: DataTypes.STRING
        },
        // Descuento
        descuento: {
            type: DataTypes.INTEGER
        },
        // IVA
        IVA: {
            type: DataTypes.INTEGER, 
            defaultValue: 19
        },
        // Neto
        neto: {
            type: DataTypes.STRING
        },
        state: {
            type: DataTypes.STRING
        } 

    })
}