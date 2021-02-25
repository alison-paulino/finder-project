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
     console.log("User===> ", user);
      if (!user) {
        console.log("Entrei no usuario null")
        Candidate.findOne({ email })
        .then((candidate) => {
          console.log("Candidate ===>", candidate);
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
            console.log(bcryptjs.compareSync(password, candidate.passwordHash))
            res.render("auth/login", { errorMessage: "Password Incorreta." });
          }
        })
        .catch((error) => next(error));
    
       

        
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
          req.session.currentUser = user;
        res.redirect('/profileRecruiter');
        return;
      } else {
       res.render('auth/login', { errorMessage: 'Password incorreto.' });
       return;
      
      }
    });

    })

    
  
authRouterLogin.post('/logout', (req, res) => {
  
    req.session.destroy();
    res.redirect('/');
  });

  module.exports = authRouterLogin;
