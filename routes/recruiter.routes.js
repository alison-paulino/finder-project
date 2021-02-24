const express = require('express');
const routerRecruiter  = express.Router();
const Recruiter = require('../models/recruiter.model');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

 
routerRecruiter.get('/recruiterPre', (req, res)=>{
    let formRecruiter = '';
    formRecruiter =`
    <form action="/recruiterPre" method="POST">
     <label for="name">Nome</label>
     <input type="text" name="name" id="name-recruiter" placeholder="Nome">
     <br><br>
     <label for="email">Email</label>
     <input type="email" name="email" id="email" placeholder="E-mail">
     <button type="submit">Login</button>
    </form>
    `
res.render('index', {formRecruiter}) 
})
routerRecruiter.post('/recruiterPre', (req, res) =>{
 const {name, email} = req.body;
 console.log(req.body);

 res.render('recruiter/cadastro',{name, email });
})
routerRecruiter.get('/profile', (req, res) =>{
 
  res.render('recruiter/profile', {currentUser : req.session.currentUser} )
})

routerRecruiter.get('/editRecruiter/:id', (req, res)=>{
  
  const { id } = req.params;
  
  Recruiter.findById(id)
  .then(dadosList =>{
  /*  
    let formListRecruiter = '';
    formListRecruiter =` 
    <form action = "/editRecruiter/${dadosList._id}" method = "post">
    <label for="name">Nome</label>
    <input type="text" name="name" id="name-recruiter" placeholder="Nome" value="${dadosList.name} ">
    </br></br>
    <label for="lastName">Sobrenome</label>
    <input type="text" name="lastName" id="last-recruiter" placeholder="Sobrenome" value="${dadosList.lastName}">
    </br></br>
    <label for="city">Cidade</label>
    <input type="text" name="city" id="city-recruiter" placeholder="Cidade da Empresa" value="${dadosList.city}">
    </br></br>
    <label for="phone">Telefone</label>
    <input type="text" name="phone" id="phone-recruiter" placeholder="Telefone" value="${dadosList.phone}">
    </br></br>
    <label for="company">Empresa</label>
    <input type="text" name="company" id="company" placeholder="Empresa onde trabalha" value="${dadosList.company}">
    </br></br>
    <label for="password">Password</label>
    <input type="password" name="password" id="password-recruiter" placeholder="********"/>
    </br></br>
    <button type="submit" id="update-recruiter">Salvar</button>
    </form>`
    */
    
    res.render('recruiter/editProfile', {dadosList})
  })
})
routerRecruiter.post('/editRecruiter/:id', (req, res, next)=>{
    const {id} = req.params;
    const {name, lastName,city, phone, company, password} = req.body;

      if (!lastName || !city || !password || !phone|| !company| !name ) {
        res.render('recruiter/editProfile', { errorMessage: 'Todos os campos são mandatorios. Por favor verifique o preenchimento' });
        return;
      }
        const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
      if (!regex.test(password)) {
        res.status(500).render('recruiter/editProfile', { flag: true , errorMessage: 'Password precisa ter pelo menos 6 caracteres, possuir pelo menos 1 numeral, 1 letra maiuscula e uma letra minuscula! e 1 caracter especial' });
        return;
      }
     const salt = bcryptjs.genSaltSync(saltRounds);
     const hash1 = bcryptjs.hashSync(password, salt);
     Recruiter.findByIdAndUpdate(id, {
        name,
        lastName,
        city,
        phone,
        company,
        passwordHash : hash1
    }, {new : true})
     .then(userFromDB => {
     req.session.currentUser = userFromDB;
      res.redirect('/profile')
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('recruiter/editProfile', { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('recruiter/editProfile', {
           errorMessage: 'E-mail precisa ser unico. Esse e-mail já está cadastrado.'
        });
      } else {
        next(error);
      }
    });
  });




module.exports = routerRecruiter;
