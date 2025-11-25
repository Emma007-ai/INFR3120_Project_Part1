// Load environment variables from .env
require('dotenv').config();

var createError   = require('http-errors');
var express       = require('express');
var path          = require('path');
var cookieParser  = require('cookie-parser');
var logger        = require('morgan');

// ----- MongoDB (Mongoose) setup -----
const mongoose    = require('mongoose');
const session     = require('express-session');
const passport    = require('passport');

// Passport config (make sure you created config/passport.js)
require('./config/passport')(passport);

// Connect to MongoDB Atlas using the MONGO_URI from .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter  = require('./routes/auth');   // NEW: auth routes

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ----- SESSION + PASSPORT -----
app.use(
  session({
    secret: 'super-secret-key-change-this',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Make logged-in user available in all EJS views as `user`
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Routes
app.use('/', authRouter);   // /login, /register, /logout
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

