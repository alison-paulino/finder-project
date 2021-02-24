const express = require('express');
const authRouterLogin  = express.Router();
const Recruiter = require('../models/recruiter.model');
const Candidate = require('../models/candidate.model');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;


authRouterLogin.get('/login', (req,res) =>{



  res.render('auth/login');
})

authRouterLogin.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    console.log(req.body);

if (email === '' || password === '') {
  res.render('auth/login', {
      errorMessage: 'Os dois campos são obrigatorios!'
    });
    return;
  }
 
  Recruiter.findOne({ email })
    .then(user => {
     if(user.email === email){
      if (!user) {
        res.render('auth/login', { errorMessage: 'Email não está registrado. Por favor, tente outro email' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
          req.session.currentUser = user;
        res.redirect('/profileRecruiter');
      } else {
       res.render('auth/login', { errorMessage: 'Password incorreto.' });
      }
    }else{
      // vai para Candidate se não for recruiter
    }
    })

    Candidate.findOne({ email })
    .then((candidate) => {
      if (!candidate) {
        res.render("auth/login", {
          errorMessage:
            "Email não está registrado. Por favor, tente outro email.",
        });
        return;
      } else if (bcryptjs.compareSync(password, candidate.passwordHash)) {
        //res.render("auth/loginCandidate", { candidate });
        req.session.currentUser = candidate;
        res.redirect("/profileCandidate");
      } else {
        res.render("auth/login", { errorMessage: "Password Incorreta." });
      }
    })
    .catch((error) => next(error));

});
  
authRouterLogin.post('/logout', (req, res) => {
  
    req.session.destroy();
    res.redirect('/');
  });

  module.exports = authRouterLogin;
