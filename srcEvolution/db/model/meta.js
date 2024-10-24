const { DataTypes } = require('sequelize');

module.exports = sequelize => {
    sequelize.define('meta', { 
        // Valor
        valor: {
            type: DataTypes.INTEGER
        },
    })
}