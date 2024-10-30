const { Sequelize, Op} = require('sequelize');

// Importe.
const modelUser = require('./model/user');      // Equipo - Costa Center
const modelFuente = require('./model/fuente');  // Fuentes
const modelCalendario = require('./model/calendary'); // Calendario
const modelClient = require('./model/client');       // Clientes
const modelRegistro = require('./model/register'); // Modelo registro
const modelCotizacion = require('./model/cotizacion'); // Modelo registro
const modelMeta = require('./model/meta');             // Meta

const entorno = true;

let dburl = entorno ? 'postgresql://postgres:MgygdDzTUdTVrzBkshFFcttqwtvLVbhZ@autorack.proxy.rlwy.net:30386/railway' : 'postgres:postgres:123@localhost:5432/crm';

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
modelMeta(sequelize);               // Meta
const { user, fuente, client, calendario, register, cotizacion, meta } = sequelize.models;



// Relacionamos los clientes con la fuente
fuente.hasMany(client);
client.belongsTo(fuente);

// Relacionamos los clientes con los asesores
user.hasMany(client);
client.belongsTo(user);

// Usuario, meta...
user.hasOne(meta);
meta.belongsTo(user); 

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