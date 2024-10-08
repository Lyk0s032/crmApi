const { Sequelize, Op} = require('sequelize');

// Importe.
const modelUser = require('./model/users'); // Usuarios - Equipo de trabajo NovaX
const modelBusiness = require('./model/business'); // Usuarios - Equipo de trabajo NovaX
const modeilBusinessConfigure = require('./model/businessConfiguration'); // Configuracion del business - GENERAL
const modelBusinessContact = require('./model/businessContact'); // Usuarios - Equipo de trabajo NovaX

const modelPersonBusiness = require('./model/person_business'); // Relacion Business Usuario 

// Almacen de prospectos
const modelOrigin = require('./model//origen'); // Modelo para origen del usuario

// Prospecto de cliente
const modelProspect = require('./model/clientProspect');

// INVITACIONES A PARTICIPAR EN PROYECTO.
const modelInvitation = require('./model/invitationToBusiness'); // INVITAR A PARTICIPAR

const modelBusinessClient = require('./model/cl'); // Empresas registradas
const modelClient = require('./model/client'); // Relacion de cliente con el business
const modelClientLegal = require('./model/clientLegal'); // Relacion de cliente con el business

const modelGroupContact = require('./model/groupContact'); // Grupo de contactos dentro del business

const modelContact = require('./model/contact');        // GRUPO DE CONTACTOS

// PROYECTOS
const modelProject = require('./model/projects');       // PROYECTOS BUSINESS
// AVANCE PROYECTO
const modelProgress = require('./model/avance');        // Avance o notas

const entorno = false; 

let dburl = entorno ? 'postgresql://postgres:JStlLHdfw1jM2qmdhzFS@containers-us-west-66.railway.app:6622/railway' : 'postgres:postgres:123@localhost:5432/crm';

const sequelize = new Sequelize(dburl, {
    logging: false,
    native: false,
});



// Modelos
modelUser(sequelize);               // Usuarios
modelBusiness(sequelize);           // Business
modeilBusinessConfigure(sequelize); // Configuracion del business
modelPersonBusiness(sequelize);     // Person - Business
modelInvitation(sequelize);         // Personas - Business - Invitacion
modelBusinessContact(sequelize);    // Business Contact
modelOrigin(sequelize);             // Modelo de origen
modelProspect(sequelize);           // Prospecto de cliente
modelBusinessClient(sequelize);     // EMpresass registradas - CLient
modelClient(sequelize);             // Client
modelClientLegal(sequelize);        // Model Client Legal
modelGroupContact(sequelize);       // Group Contact
modelContact(sequelize);            // Contact 
modelProject(sequelize);            // Projects - business
modelProgress(sequelize);           // Avance - Progreso - Proyecto - y Asesor
const { user, business, business_configure,
    person_business, invitation, businessContact, 
    client, clientLegal, groupContact, 
    contact, project, origin, prospect, clientBusiness, progress } = sequelize.models;

user.belongsToMany(business, { through: "person_business" }); // Esto crea una tabla que relaciona los business con los usuarios.
business.belongsToMany(user, { through: "person_business" });

// Creamos una relación para configurar el proyecto o business 
business.hasOne(businessContact); 
businessContact.belongsTo(business);

// Relacionamos el business con origen para captar los prospectos
business.hasMany(origin);
origin.belongsTo(business);

// Relacionamos el prospecto con el Origin
origin.hasMany(prospect);
prospect.belongsTo(origin);

// Prospect con el asesor.
user.hasMany(prospect);
prospect.belongsTo(user);

// Business y prospecto
business.hasMany(prospect);
prospect.belongsTo(business);


// RELACIONAMOS EL BUSINESS CON SU CONFIGURACION
business.hasOne(business_configure);
business_configure.belongsTo(business);
 
// RELACIONAMOS EL BUSINESS CON INVITACIONES
business.hasMany(invitation);
invitation.belongsTo(business);

// RELACIONAMOS PERSONAS CON INVITACIONES
user.hasMany(invitation);
invitation.belongsTo(user);

// Relacionamos el business con las empresas cliente
business.hasMany(clientBusiness);
clientBusiness.belongsTo(business);

// Relacionamos el asesor con las empresas cliente
user.hasMany(clientBusiness);
clientBusiness.belongsTo(user);

// RELACIONAMOS EL BUSINESS CON EL CLIENTE
business.hasMany(client, {as: "client"});
client.belongsTo(business, {as: "business"});

// RELACIONAMOS LOS PROYECTOS CON EL BUSINESS
business.hasMany(project);
project.belongsTo(business);

// RELACIONAMOS LOS PROYECTOS CON LOS CLIENTES
clientBusiness.hasMany(project);
project.belongsTo(clientBusiness);

// Relacionamos las notas con el proyecto
project.hasMany(progress);
progress.belongsTo(project);

user.hasMany(progress);
progress.belongsTo(user);
  
// RELACIONAMOS EL CLIENTE CON SU CONFIGURACION INDIVIDUAL LEGAL
client.hasOne(clientLegal);
clientLegal.belongsTo(client);

// GRUPO DE CONTACTOS
business.hasMany(groupContact); // Creamos una conexion entre los grupos de contactos y el business
groupContact.belongsTo(business);

// RELACIONAMOS EL USER CON EL CONTACTO
user.hasMany(groupContact);     // Creamos una conexion entre los grupos, y el usuario que lo creo.
groupContact.belongsTo(user);

// RELACIONAMOS LOS CONTACTOS CON SU RESPECTIVO GRUPO DE CONTACTOS
groupContact.hasMany(contact);
contact.belongsTo(groupContact);

// RELACIONAMOS LOS CONTACTOS CON SU BUSINESS
business.hasMany(contact);
contact.belongsTo(business);





// Exportamos.
module.exports = {
    ...sequelize.models,
    db: sequelize,
    Op
}       