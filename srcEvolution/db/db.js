const { Sequelize, Op} = require('sequelize');

// Importe.
const modelUser = require('./model/user');      // Equipo - Costa Center
const modelFuente = require('./model/fuente');  // Fuentes
const modelCalendario = require('./model/calendary'); // Calendario
const modelClient = require('./model/client');       // Clientes
const modelRegistro = require('./model/register'); // Modelo registro
const modelCotizacion = require('./model/cotizacion'); // Modelo registro


const entorno = true; 

let dburl = entorno ? 'postgresql://postgres:EYsQLfxwLvzqgvSaIZKMRJkThtzFJZpr@postgres.railway.internal:5432/railway' : 'postgres:postgres:123@localhost:5432/crm';

const sequelize = new Sequelize(dburl, {
    logging: false,
    native: false,
});

 

// Modelos
modelUser(sequelize);                // Usuarios
modelFuente(sequelize);              // Fuente
modelClient(sequelize);              // Cliente
modelCalendario(sequelize);          // Calendario
modelRegistro(sequelize);            // Registro
modelCotizacion(sequelize);         // Cotizacion
const { user, fuente, client, calendario, register, cotizacion } = sequelize.models;



// Relacionamos los clientes con la fuente
fuente.hasMany(client);
client.belongsTo(fuente);

// Relacionamos los clientes con los asesores
user.hasMany(client);
client.belongsTo(fuente);

client.hasMany(calendario);
calendario.belongsTo(client);

user.hasMany(calendario);
calendario.belongsTo(user);

client.hasMany(register);
register.belongsTo(client);

client.hasMany(cotizacion);
cotizacion.belongsTo(client);

// Exportamos.
module.exports = {
    ...sequelize.models,
    db: sequelize,
    Op
}        