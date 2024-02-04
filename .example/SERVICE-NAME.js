require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const Gateway = require('micromq/gateway');

/*
 * create gateway instance
 */
const gateway = Gateway({
  microservices: process.env.GATEWAY_ACTION.split(','), // list of microservices
  rabbit: {
    url: process.env.RABBIT_URL,
  },
});

/*
* register gateway
*/
app.use(gateway.middleware());

/*
* cors
*/
app.use(require('cors')({
  credentials: true,
  origin: process.env.APP_URL,
}));

/*
* body parser
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
* express routes
*/
require('./RouteExpress')(app);

/*
* 404 error handler
*/
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

/*
* start express server
*/
let server = require('http').Server(app);
if (process.env.SSL_CERT) {
  let options = {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
  };
  server = require('https').Server(options, app);
}

server.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server started on ${process.env.HOST}:${process.env.PORT}`);

  /*
  * register micromq route
  */
 require('./RouteMicroMQ')();

  /*
  * connect mongo
  */
  require(`${process.env.COMMON_PATH}/Mongo`)();
});