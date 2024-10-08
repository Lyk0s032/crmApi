const express = require('express');
const bodyParser = require('body-parser');
const {Sequelize,  DataTypes, INTEGER } = require('sequelize');

const {db, Op } = require('./src/db/db');
const { signUp, getUserById, responseInvitation, getUserPanel, validatePhone, signIn } = require('./src/controllers/user');
const { newBusiness, configureBusiness, getBusiness, getBusinessById, addContactInformationBusiness, sendInvitation, newOrigin, newProspect, dontCall, neverCall, called, getBusinessOpen, getBusinessLogin } = require('./src/controllers/business');
const { deleteContact, newGroup } = require('./src/controllers/contacts');
const { getAllClients, newClient, getAllProspectByAsesor, getAllProspect, getProspect } = require('./src/controllers/client');
const isAuthenticated = require('./src/controllers/authentication');
const { newClientBusiness, getClientsBusiness, getAllProspects, getClientById, newProject, getProjectById, newNoteProgress } = require('./src/controllers/clientBusiness');


const app = express();
app.use(express.json()); 

const PORT = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// Ruta de iniciacion
app.get('/', (req, res)  => {
    res.send('Running CRM');
})

// Usuarios - vendedores.
app.get('/app/signIn/', isAuthenticated, async (req, res) => {
  try {
      console.log(req.user);
      res.status(200).json({user: req.user});
  }catch(err){
    console.log(err);
    res.status(500).json({msg: 'error en la principal'});
  }
})

// RUTAS GET
  // LOGIN

  app.get('/user/sign/v/:phone', validatePhone);      // Validamos que exista el phone
  app.get('/business/app/general/:BId/:UId', getBusinessLogin);
app.get('/user/w/:uId', getUserById);                 // Obtenemos los usuarios.
app.get('/user/panel/:uID', getUserPanel);
app.get('/business/get', getBusiness);                // Obtenemos todos los business.
app.get('/business/get/:bId', getBusinessById);       // Obtenemos business por ID
app.get('/business/clients/:bId', getAllClients);        // Obtenemos todos los clientes de un proyecto.
  
  // CLIENTES
  app.get('/business/app/clients/:businessId/:asesorId/:asesor', getClientsBusiness);
  
  
  // BUSCAR PROSPECTOS DEL CLIENTE
  app.get('/business/prospect/:BId/:AId/:mes', getAllProspectByAsesor); // Obtenemos los prospectos por asesor
  app.get('/business/prospect/:BId/:mes', getAllProspect); // Obtenemos los prospectos por asesor
  app.get('/business/g/prospect/:BId/:PId', getProspect);   // Obtener prospecto individual

  // PROSPECT APP
  app.get('/business/app/prospect/:businessId/:asesorId/:mes/:asesor', getAllProspects);
  app.get('/business/open/:BId/:UId', getBusinessOpen); // Abrimos el business logueado
  app.get('/cliente/app/get/:ClientId', getClientById); // Obtenemos el cliente

  app.get('/cliente/app/project/get/:projectId', getProjectById); // OBTENEMOS PROYECTO POR ID
  // RUTAS POST

app.post('/user/signIn', signIn);                        // Iniciar sesion
app.post('/user/signUp', signUp);                        // Crear cuenta - USUARIO
app.post('/business/new', newBusiness);                 // Crear business - Primer paso - usuario 
app.post('/business/configuration', configureBusiness); // Configuracion basica Business - Segundo paso - Usuario
app.post('/business/contact/', addContactInformationBusiness); // Configuracion de contacto - Tercero

  // NUEVO ORIGEN
  app.post('/business/post/origin/new', newOrigin);     // Nuevo Origen
  // NUEVO PROSPECTO
  app.post('/business/post/prospect', newProspect); // Nuevo prospecto
  // INVITACION
app.post('/business/invitation', sendInvitation);       // Enviar invitacion a participar a un usuario. 
  // CONTACTOS Y GRUPOS
app.post('/business/groupContact', newGroup);           // Nuevo grupo de contactos dentro del business.
app.post('/business/client/new', newClient);            // Nuevo cliente.

  // NUEVO CLIENTE - TRANSICCION DE PROSPECTO
  app.post('/business/clientes/new', newClientBusiness) // Nuevo cliente.
  // NUEVO PROJECT
  app.post('/client/app/post/newProject', newProject);
  // NOTA PROYECTO
  app.post('/client/app/post/note/', newNoteProgress);  // Nota de avance en un proyecto

// RUTAS PUT
app.put('/user/invitation', responseInvitation);      // Actualizamos invitacion desde el usuario

  // ACTUALIZAR LLAMADAS DE PROSPECTO
  app.put('/business/prospect/calls/:BId/:PId', dontCall) // Funcion cuando no contestaron
  // ENVIAMOS PROSPECTO A BANDEJA "PARA DESPUES" O "PERDIDOS"
  app.put('/business/prospect/bandeja/:PId/:state', neverCall);
  // La llamada resulto exitosa
  app.put('/business/prospect/called/:PId', called);


  // RUTAS DELETE
app.delete('/business/contact', deleteContact);       // Eliminar contacto.
const server = app.listen(PORT, () => {
    db.sync();
    console.log(`Server running on port ${PORT}`);
});
 