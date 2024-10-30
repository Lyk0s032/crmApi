const { DataTypes } = require('sequelize');

module.exports = sequelize => {
    sequelize.define('client', { 
        // Nombre
        name: {
            type: DataTypes.STRING
        },
        // Phone
        phone:{
            type: DataTypes.STRING
        },
        // Email
        email:{
            type: DataTypes.STRING
        },
        // Sector
        sector: {
            type: DataTypes.STRING
        },
        // Responable
        responsable:{
            type: DataTypes.STRING
        },
        rangoEncargado: {
            type: DataTypes.STRING
        },
        // Estado... Activo o innactivo
        nombreEmpresa: {
            type: DataTypes.STRING
        },
        // ACTUALIZACION FELIPE
        url: {
            type: DataTypes.STRING
        },
        direccion:{
            type: DataTypes.STRING
        },
        fijo: {
            type: DataTypes.STRING
        },
        embudo: { // Intento 1, 2, 3 || Contacto 1, 2, 3
            type: DataTypes.STRING
        },
        state: { // Proceso, Perdido, Ganado
            type: DataTypes.STRING
        }

    })
}