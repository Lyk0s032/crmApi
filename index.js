const express = require('express');
const bodyParser = require('body-parser');
const {Sequelize,  DataTypes, INTEGER } = require('sequelize');

const {db, Op } = require('./srcEvolution/db/db');
const { getAllClients, newFuente, newClient, dontCallIntentos, contestoSinInteres, contestoPeroLlamarDespues, contestoYTieneInteresReal, dontCallContacto, contestoPeroLlamarDespuesContacto, contestoSinInteresContacto, contestoYTieneInteresRealContacto, contestoSinInteresVisita, contestoPeroLlamarDespuesVisita, deseaOtroServicio, visitaACotizacion, changeStateToCotizacion, aplazarCotizacion, getClientsByState, getAllIntentos, getAllContactos, getAllVisitas, getAllCotizaciones, getCalendaryAll, getAllAprobadas, getClientsByStateByAsesor, getAllContactosByAsesor, getAllVisitasByAsesor, getAllCotizacionesByAsesor, getAllAprobadasByAsesor, VisualizarAsesor, createClientAndCotizacion, DeleteClient, ChangeClientOfAsesor, SearchClients, UpdateCliente, getClientsOnEsperaByAsesor, getClientsOnEspera, getClientsOnPerdidoEspera, getClientsOnPerdidoByAsesor, getAllClientsVisualizar, SearchClientsParaVisualizar, newNote, createClientAndSelectEmbudo, updateCotizacion, getAllAsesores, showAsesores, showAsesorData } = require('./srcEvolution/controllers/client');
const { getCalendary, getNotifications } = require('./srcEvolution/controllers/calendary');
const { signIn, signUp } = require('./srcEvolution/controllers/user');
const isAuthenticated = require('./srcEvolution/controllers/authentication');

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

// APLICACION
app.get('/app/asesores', showAsesores); // Mostrar aseores disponibles
app.get('/app/asesor/:id', showAsesorData); // Mostrar asesor especifico
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

// GET
app.get('/clients/get/all/', getAllClients);
app.get('/clients/get/searchClients', SearchClients);

// GET
app.get('/client/get/all/visualizar', getAllClientsVisualizar);
app.get('/clients/get/searchClientsAll', SearchClientsParaVisualizar);

app.get('/asesores/data', getAllAsesores)

// CALENDARIO
        app.get('/calendario/get/all', getCalendaryAll);
        // NOTIFICACIONES
        app.get('/calendario/notification/get/all', getNotifications);
// POST
app.post('/fuente/post/new', newFuente);
app.post('/client/post/new', newClient);
app.post('/client/post/newNote', newNote);

app.post('/user/signIn', signIn);       // Iniciar sesion
app.post('/user/signUp', signUp);       // Crear cuenta - USUARIO
  // CREAR CLIENTE Y COTIZACION AL MiSMO TIEMPO
  app.post('/client/post/newAndCotizacion', createClientAndCotizacion);
  // CREAR Y DIRECIONAR EMBUDO AL MISMO TIEMPO
  app.post('/client/post/newAndEmbudo', createClientAndSelectEmbudo); // CREAR CLIENTE Y SELECCIONAR EMBUDO.
  
  
  
  
  // DELETE
  app.delete('/client/delete/registro/:clientId', DeleteClient); // Eliminar cliente
  // PUT
  app.put('/client/put/update', UpdateCliente); // Actualizar cliente
  app.put('/client/put/changeAsesor', ChangeClientOfAsesor); // Cambiar cliente de asesor
  // ACTUALIZAR COTIZACION
  app.put('/client/put/cotizacion/update', updateCotizacion); // Utilizamos esta ruta para actualizar la cotizacion
 
// TODO
app.get('/clients/get/all/panel', getClientsByState);
app.get('/clients/get/all/panel/:asesorId', getClientsByStateByAsesor); // Asesor

app.get('/clients/get/all/intentos', getAllIntentos);
app.get('/clients/get/all/contactos', getAllContactos);
app.get('/clients/get/all/contactos/:asesorId', getAllContactosByAsesor);

// VISUALIZAR ASESORES
app.get('/clients/get/visualizar/asesores/:asesorId', VisualizarAsesor);
// CERRAR VISUALIZACION DE DATOS

app.get('/clients/get/all/visitas', getAllVisitas);
app.get('/clients/get/all/visitas/:asesorId', getAllVisitasByAsesor);


app.get('/clients/get/all/cotizaciones', getAllCotizaciones);
app.get('/clients/get/all/cotizaciones/:asesorId', getAllCotizacionesByAsesor); 

app.get('/clients/get/all/aprobadas', getAllAprobadas);
app.get('/clients/get/all/aprobadas/:asesorId', getAllAprobadasByAsesor);
// ESPERA
app.get('/clients/get/all/espera/:asesorId', getClientsOnEsperaByAsesor) // CLIENTES EN ESPERA POR ASESOR
app.get('/clients/get/all/espera/', getClientsOnEspera); // CLIENTES EN ESPERA


// PERDIDO
app.get('/clients/get/all/perdido/:asesorId', getClientsOnPerdidoByAsesor) // CLIENTES EN ESPERA POR ASESOR
app.get('/clients/get/all/perdido/', getClientsOnPerdidoEspera); // CLIENTES EN ESPERA


// ---------------------------------------
// INTENTOS ------------------------------
// ---------------------------------------
app.put('/intentos/put/dontCall/', dontCallIntentos);
app.put('/intentos/put/contestoSinInteres', contestoSinInteres);
app.put('/intentos/put/contestoPeroLlamarLuego', contestoPeroLlamarDespues); // LLAMAR DESPUES
app.put('/intentos/put/contestoYTieneInteresReal', contestoYTieneInteresReal); // INTERES REAL


// ---------------------------------------
// INTENTOS ------------------------------
// ---------------------------------------
app.put('/contacto/put/dontCall', dontCallContacto);
app.put('/contacto/put/contestoPeroLlamarLuego', contestoPeroLlamarDespuesContacto); // Contesto pero llamar despues
app.put('/contacto/put/contestoPeroSinInteres', contestoSinInteresContacto); // Contesto pero sin interes
app.put('/contacto/put/contestoYTieneInteresRealContacto', contestoYTieneInteresRealContacto); // INTERES REAL


// ---------------------------------------
// VISITA --------------------------------
// ---------------------------------------

app.put('/visita/put/contestoPeroSinInteres', contestoSinInteresVisita); // Costesto sin interes
app.put('/visita/put/llamarDespues', contestoPeroLlamarDespuesVisita);  // Visita lugar llamar
app.put('/visita/put/otroServicio', deseaOtroServicio);     // Desea otro servicio
app.put('/visita/put/VisitaACotizacion', visitaACotizacion); // VISTA A COTIZACION



// ---------------------------------------
// COTIZACION --------------------------------
// ---------------------------------------

app.put('/cotizacion/put/cambiarEstado', changeStateToCotizacion); // CAMBIAR ESTADO DE COTIZACION
app.put('/cotizacion/put/aplazarEstado', aplazarCotizacion); // CAMBIAR ESTADO DE COTIZACION










const server = app.listen(PORT, () => {
    db.sync();
    console.log(`Server running on port ${PORT}`);
});
 