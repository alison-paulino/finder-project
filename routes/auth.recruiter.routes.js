

const express = require('express');
const authRouterRecruiter  = express.Router();
const Recruiter = require('../models/recruiter.model');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

/*
authRouterRecruiter.post('/createRecruiter', (req, res, next) =>{
  const {name,lastName,email,city,phone,company,password} = req.body;
  console.log('SESSION =====> ', req.session);
  
  
  
  if (!lastName || !city || !password || !phone|| !company ) {
    res.render('recruiter/cadastroRecruiter', { errorMessage: 'Todos os campos são mandatorios. Por favor verifique o preenchimento' });
    return;
  }
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
    res.status(500).render('recruiter/cadastroRecruiter', { errorMessage: 'Password precisa ter pelo menos 6 caracteres, possuir pelo menos 1 numeral, 1 letra maiuscula e uma letra minuscula! e 1 caracter especial' });
    return;
  }
  
  bcryptjs
  .genSalt(saltRounds)
  .then(salt => bcryptjs.hash(password, salt))
  .then(hashedPassword => {
    return Recruiter.create({
      name,
      lastName,
      email,
      city,
      phone,
      company,
      passwordHash: hashedPassword
    });
  })

  .then( recruiterFromDB => {
    console.log(`Recrutador criado com sucesso ${recruiterFromDB.name}`)
    req.session.currentUser = recruiterFromDB;
    res.redirect('/profileRecruiter');

  })
  .catch(error => {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render('recruiter/cadastroRecruiter', { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render('recruiter/cadastroRecruiter', {
         errorMessage: 'E-mail precisa ser unico. Esse e-mail já está cadastrado.'
      });
    } else {
      next(error);
    }
  });
  
});
*/

module.exports = authRouterRecruiter;
