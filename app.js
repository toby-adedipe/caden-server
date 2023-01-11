const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
const { Loaders } = require('./loaders');
// var { expressjwt: jwt } = require("express-jwt");

mongoose.promise = global.Promise;

const app = express();

let server;

app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
  secret: 'caden-server', 
  cookie: { 
    maxAge: 60000 
  }, 
  resave: false,
  saveUninitialized: false
}));

//Configure Mongoose
mongoose.connect('mongodb://127.0.0.1:27017');
mongoose.set('debug', true);

//Models & Routes
require('./models/Users');
require('./config/passport');

function terminateProcessGracefully(code) {
  console.log('Process terminated successfully');
  process.exit(code);
}

const startServer = async () =>  {
  await Loaders.init(app)
}

(async () => {
  server = app.listen(8000, async () => {
    console.log('listening on port: 8000')
    await startServer();
  })

  server.on('error', async (err) => {
    const { code, syscall } = err;
    if (syscall !== 'listen') {
      throw err;
    }
    // handle specific listen errors with friendly messages
    if (code === 'EACCES') {
      console.error('Port requires elevated privileges');
      terminateProcessGracefully(1);
    }
    if (code === 'EADDRINUSE') {
      console.error('Port is already in use');
      // await exec(`kill -9 $(lsof -t -i:${httpPort})`);
      terminateProcessGracefully(1);
      bootServer();
    }
    if (code === 'ECONNREFUSED') {
      console.error('No connection could be made because the target machine actively refused it.');
      terminateProcessGracefully(1);
    }
    console.error('Error occured while booting the server');
    console.error(err);
    throw err;
  })
})()