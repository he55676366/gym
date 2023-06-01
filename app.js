var express = require("express");
var session = require('express-session');
var app = express();
var index = require('./router/index');
app.use(express.static('public'));

//解析 Form Data JSON
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded(); //解析 Form Data 
app.use(urlencodedParser);
var jsonParser = bodyParser.json();
app.use(jsonParser);

// 設定可存取資料的名單
// 在 3000 設定 5500 可以拿資料
var cors = require("cors");
app.use(cors());

// ------------------------------------

app.use(function(req, res, next){
    res.locals.session = req.session;
    next();
});


app.set('view engine','ejs');//渲染

//加密
app.use(session({
    secret: 'ttt1234567',
    resave: true,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 1000
    }
}));

app.use('/', index);

app.listen(5000);
console.log('5000');