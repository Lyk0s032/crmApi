const express = require('express');
const bodyParser = require('body-parser');
const {Sequelize,  DataTypes, INTEGER } = require('sequelize');

const {db, Op } = require('./srcEvolution/db/db');
const { getAllClients, newFuente, newClient, dontCallIntentos, contestoSinInteres, contestoPeroLlamarDespues, contestoYTieneInteresReal, dontCallContacto, contestoPeroLlamarDespuesContacto, contestoSinInteresContacto, contestoYTieneInteresRealContacto, contestoSinInteresVisita, contestoPeroLlamarDespuesVisita, deseaOtroServicio, visitaACotizacion, changeStateToCotizacion, aplazarCotizacion, getClientsByState, getAllIntentos, getAllContactos, getAllVisitas, getAllCotizaciones, getCalendaryAll, getAllAprobadas } = require('./srcEvolution/controllers/client');
const { getCalendary } = require('./srcEvolution/controllers/calendary');

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

// GET
app.get('/clients/get/all/', getAllClients);

// CALENDARIO
        app.get('/calendario/get/all', getCalendaryAll);
// POST
app.post('/fuente/post/new', newFuente);
app.post('/client/post/new', newClient);


// TODO
app.get('/clients/get/all/panel', getClientsByState);
app.get('/clients/get/all/intentos', getAllIntentos);
app.get('/clients/get/all/contactos', getAllContactos);
app.get('/clients/get/all/visitas', getAllVisitas);
app.get('/clients/get/all/cotizaciones', getAllCotizaciones);
app.get('/clients/get/all/aprobadas', getAllAprobadas);



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
 