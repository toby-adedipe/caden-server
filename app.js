const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');

mongoose.promise = global.Promise;

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
  secret: 'passport-tutorial', 
  cookie: { 
    maxAge: 60000 
  }, 
  resave: false,
  saveUninitialized: false
}));

if(!isProduction) {
  app.use(errorHandler());
}

//Configure Mongoose
console.log('processURIss: ', process.env)
mongoose.connect(process.env.MONGO_URL);
mongoose.set('debug', true);

//Models & Routes
//require('./models/Users');

if(!isProduction) {
  // app.use((err, req, res) => {
  //   res.status(err.status || 500);

  //   res.json({ errors: { message: err.message, error: {} }});
  // });

  app.get('/', (req, res) => {
    res.json({ success: true, developmentMode: true })
  })
}

app.get('/', (req, res) => {
  res.json({ success: true })
})
// app.use((err, req, res) => {
//   res.status(err.status || 500);

//   res.json({ errors: { message: err.message, error: {} }});
// })

app.listen(8000, () => console.log('Server running on http://localhost:8000/'));
