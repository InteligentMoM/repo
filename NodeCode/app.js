var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const fileUpload = require('express-fileupload');
const { exec } = require('child_process');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var intelimomRouter = require('./routes/intelimom');
var mongodb = require('./config/mongoConnection');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/wavs', express.static(path.join(__dirname, 'wavs')));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use(fileUpload());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/imom', intelimomRouter);

function callpython(fullpath) {
  var pypath = `Main_Run.py`;
  var spawn = require('child_process').spawn;
  var process = spawn('python', [`Main_Run.py`, '-a', fullpath]);

  process.stdout.on('data', function (data) {
    console.log(data.toString());
  });
}

app.post('/upload', (req, res, next) => {
  console.log(req);
  let imageFile = req.files.file;
  let fullpath = `${__dirname}/wavs/${imageFile.name}`;
  let relPath = `/wavs/${imageFile.name}`;
  imageFile.mv(fullpath, function (err) {
    if (err) {
      return res.status(500).send(err);
    } else {
      callpython(relPath);
    }
    res.send({
      message: 'successfull',
      filePath: `http://10.176.113.7:5000/wavs/${imageFile.name}`,
      fileName: imageFile.name,
    });
  });
});

//mongo connection
mongodb.connectToServer(function (err, client) {
  if (err) console.log(err);
  console.log('Connection to CosmosDB successful');
  // start the rest of your app here
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
