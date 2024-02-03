const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const paginate = require('express-paginate');
const flash = require('connect-flash');
const session = require('express-session');

mongoose.connect('mongodb://localhost/medicalStore');
let db = mongoose.connection;

db.on('error', function(err) {
    console.log(err);
});
db.once('open', function() {
    console.log("Connected to mongodb");
})

const app = express();

app.use(paginate.middleware(3, 50));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))
  
app.use(flash());
app.use(function(req, res, next) {
    res.locals.messages= require('express-messages')(req, res);
    next();
  })
app.use(function(req, res, next){
    if (!req.session.username && req.path != '/user/login'  && req.path != '/user/register') {
        res.redirect('/user/login')
    }
    next();
})

let Medicine =require('./models/medicine');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));

let medicines = require('./router/medicines');
app.use('/medicines', medicines);
 
// app.get('/', function(req, res) {
//     Medicine.find({})
//     .then((doc)=> {
//         res.render('index', {
//             title: 'Medicines',
//             medicines: doc
//         });
//     })
//     .catch((err)=> console.log(err));
// });

let users = require('./router/user');
app.use('/user', users);

app.listen(3000, function() {
    console.log('Server started on port 3000...')
});