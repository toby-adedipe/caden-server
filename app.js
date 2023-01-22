const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
const { Loaders } = require('./loaders');

// var { expressjwt: jwt } = require("express-jwt");

const passport = require("./config/passport");

mongoose.promise = global.Promise;

const app = express();

let server;

app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


//Configure Mongoose
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(console.log(`MongoDb connected ${process.env.MONGO_URL}`))
  .catch(err=> console.log(`MongoDb error: ${err}`));
mongoose.set('debug', true);

app.use(session({ 
  secret: 'caden-server', 
  cookie: { 
    maxAge: 60000 
  }, 
  resave: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URL}),
  saveUninitialized: false
}));

//Models & Routes
require('./models/Users');

async function terminateProcessGracefully(code) {
  console.log('Process terminated successfully');
  process.exit(code);
}

const startServer = async () =>  {
  await Loaders.init(app);
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