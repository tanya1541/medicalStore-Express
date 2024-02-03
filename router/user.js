const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

let User = require('../models/users');

router.get('/login', function(req, res) {
    res.render('login')
})

router.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        console.log(err)
        res.redirect('/user/login')
    });
});

router.post('/login', async function(req, res) {
    let query = {username: req.body.username, password: req.body.password};

    User.findOne(query)
    .then((user)=>{
     if(user)
        {
            req.session.username = user.username;
            res.redirect('/medicines');
        }
    else{
        req.flash('danger', 'Invalid Login');
        res.render('login');
    }
    })
    .catch((err)=> {
       console.log(err);
    });
});

router.get('/register', function(req,res) {
    res.render('register');
});

router.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
],
 function(req,res) {
    let errors = validationResult(req);

    if(!errors.isEmpty()) {
        res.render('register', {
            errors: errors.array()
        })
    }
    else {
        let user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;
        user.save()
        .then((doc)=> {
            req.flash('success', 'Account Registered')
            res.redirect('/medicines');
        })
        .catch((err)=> console.log(err));
    }
})

module.exports = router;