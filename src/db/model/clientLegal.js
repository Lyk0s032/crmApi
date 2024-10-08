const { DataTypes } = require('sequelize');


module.exports = sequelize => {
    sequelize.define('clientLegal', { 
        // Identificacion Legal
        identification: {
            type: DataTypes.INTEGER
        },
        // l
        d_v:{
            type: DataTypes.STRING
        },
        // Tipo identificacion
        type:{
            type: DataTypes.STRING
        },
        // Phone
        rut: {
            type: DataTypes.BOOLEAN
        },
        // Tipo de persona
        typePerson:{
            type: DataTypes.STRING
        },
        // Razon social / Nombre
        name:{
            type: DataTypes.STRING
        },
        // Direccion
        direction: {
            type: DataTypes.STRING
        },
        // Tel
        tel: {
            type: DataTypes.STRING
        },
        // Phone
        phone: {
            type: DataTypes.STRING
        },
        // city
        city: {
            type: DataTypes.STRING
        },
        // DPTO - COUNTRY
        dpto: {
            type: DataTypes.STRING
        },
        // COUNTRY
        country: {
            type: DataTypes.STRING
        },
        // RES COMPRAS
        res_compras: {
            type: DataTypes.STRING
        },
        movil: {
            type: DataTypes.STRING
        },
        // CG1 - DATOS
        CORREO_CxP: {
            type: DataTypes.STRING
        },
        IVA:{
            type: DataTypes.STRING
        },
        RETEFUENTE: {
            type: DataTypes.STRING
        },
        GRAN_C:{
            type: DataTypes.STRING
        },
        AUTO_I_C:{
            type: DataTypes.STRING
        },
        CIIU_PPAL:{
            type: DataTypes.STRING
        },
        CIIU_SEC:{
            type: DataTypes.STRING
        },
        SOCIEDAD: {
            type: DataTypes.STRING
        },
        ACTIVIDAD: {
            type: DataTypes.STRING
        },
        TAMAÑO_E:{
            type: DataTypes.STRING
        },
        CORREO_F:{
            type: DataTypes.STRING
        },
        FECHA_C:{
            type: DataTypes.STRING
        },
        Apellidos: {
            type: DataTypes.STRING
        },
        Nombre: {
            type: DataTypes.STRING
        },
        // State
        state: {
            type: DataTypes.STRING
        }
    })
}