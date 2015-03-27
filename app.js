/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var settings = require('./settings');
var logger = require('morgan');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var routes = require('./routes/index');
var app = express();

// all environments
app.set('port', process.env.PORT || 2015);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/images/icon.png'));
app.use(bodyParser.json());            //json、urlencoded这两行
app.use(bodyParser.urlencoded({extended: false}));    // 相当于以前的app.use(express.bodyParser())
app.use(express.static(path.join(__dirname, 'public')));    //设置根目录下的public为存放images,js,css等静态文件的文件夹
app.use(cookieParser());
app.use(session({
    secret: settings.cookieSecret,
    key: settings.db,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    },
    store: new MongoStore({
        db: settings.db
    }),
    resave: false,
    saveUninitialized: true
}));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('服务器已打开！本地端口为：' + app.get('port'));
});
module.exports = app;
