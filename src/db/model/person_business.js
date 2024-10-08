const { DataTypes } = require('sequelize');

module.exports = sequelize => {
    sequelize.define('person_business', {
        userId: {
            type: DataTypes.INTEGER 
        },
        businessId: {
            type: DataTypes.INTEGER
        },
        range: {
            type: DataTypes.STRING
        },
        accessTo: {
            type: DataTypes.ARRAY(DataTypes.JSON) 
        }
    })
}