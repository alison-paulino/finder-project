const express = require('express');
const routerRecruiter  = express.Router();
const Recruiter = require('../models/recruiter.model');
const Job = require('../models/job.model');
const fileUploader = require('../configs/cloudinary.config');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

// rota get para rederizar pre cadastro  
routerRecruiter.get('/recruiterPre', (req, res)=>{
    let formRecruiter = '';
    formRecruiter =`
    <form action="/recruiterPre" method="POST" class="form-group">
     <label for="name"></label>
     <input type="text" name="name" id="name-recruiter" placeholder="Nome" class="form-control">
     <label for="email"></label>
     <input type="email" name="email" id="email" placeholder="E-mail" class="form-control">
     <br>
     <button type="submit" class="btn btn-primary">Criar</button>
    </form>
    `
res.render('index', {formRecruiter}) 
})
// rota post para receber pre cadastro e renderizar formulario complete cadastro
routerRecruiter.post('/recruiterPre', (req, res) =>{
 const {name, email} = req.body;
 console.log(req.body);

 res.render('recruiter/cadastroRecruiter',{name, email });
})
routerRecruiter.get('/profileRecruiter', (req, res) =>{
  if(!req.session.currentUser){
    res.redirect('/');
    return;
  }
  res.render('recruiter/profileRecruiter', {currentUser : req.session.currentUser} )
})

// rota post para receber cadastro e criar recrutador no banco
routerRecruiter.post('/createRecruiter', fileUploader.single('image'),(req, res, next) =>{
  const {name,lastName,email,city,phone,company,password} = req.body;
  console.log('SESSION =====> ', req.session);
  const {currentUser} = req.session;
  
  if (!lastName || !city || !password || !phone|| !company ) {
    res.render('recruiter/cadastroRecruiter', { currentUser ,errorMessage: 'Todos os campos são mandatorios. Por favor verifique o preenchimento' });
    return;
  }
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
    res.status(500).render('recruiter/cadastroRecruiter', { currentUser , errorMessage: 'Password precisa ter pelo menos 6 caracteres, possuir pelo menos 1 numeral, 1 letra maiuscula e uma letra minuscula! e 1 caracter especial' });
    return;
  }
  
  bcryptjs
  .genSalt(saltRounds)
  .then(salt => bcryptjs.hash(password, salt))
  .then(hashedPassword => {
    return Recruiter.create({name,lastName,email,city,phone,company,passwordHash: hashedPassword, imageUrl: req.file.path});
  })

  .then( recruiterFromDB => {
    console.log(`Recrutador criado com sucesso ${recruiterFromDB.name}`)
    req.session.currentUser = recruiterFromDB;
    res.redirect('/profileRecruiter');

  })
  .catch(error => {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render('recruiter/cadastroRecruiter', { currentUser, errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render('recruiter/cadastroRecruiter', {currentUser,
         errorMessage: 'E-mail precisa ser unico. Esse e-mail já está cadastrado.'
      });
    } else {
      next(error);
    }
  });
  
});


// rota get para pegar id e trazer dados para edição
routerRecruiter.get('/editRecruiter/:id', (req, res)=>{
  
  const { id } = req.params;
  
  Recruiter.findById(id)
  .then(dadosList =>{
    if(!req.session.currentUser){
      res.redirect('/');
      return;
    }
    res.render("recruiter/editProfileRecruiter", {dadosList})
    
  })
})

// rota post pegar dados do formulario editado e alterar no banco
routerRecruiter.post('/editRecruiter/:id', fileUploader.single('image'),(req, res, next)=>{
    const {id} = req.params;
    const {name, lastName,city, phone, company, password} = req.body;
    let imageUrl;
    const {currentUser} = req.session;
      if (req.file) {
        imageUrl = req.file.path;
      } else {
        imageUrl = req.body.existingImage;
      }

      if (!lastName || !city || !password || !phone|| !company| !name ) {
        res.render('recruiter/editProfileRecruiter', { currentUser, errorMessage: 'Todos os campos são mandatorios. Por favor verifique o preenchimento' });
        return;
      }
        const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
      if (!regex.test(password)) {
        res.status(500).render('recruiter/editProfileRecruiter', { currentUser , errorMessage: 'Password precisa ter pelo menos 6 caracteres, possuir pelo menos 1 numeral, 1 letra maiuscula e uma letra minuscula! e 1 caracter especial' });
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
        passwordHash : hash1,
        imageUrl
    }, {new : true})
     .then(userFromDB => {
     
      res.redirect('/profileRecruiter')
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('recruiter/editProfileRecruiter', { currentUser, errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('recruiter/editProfileRecruiter', {
          currentUser, errorMessage: 'E-mail precisa ser unico. Esse e-mail já está cadastrado.'
        });
      } else {
        next(error);
      }
    });
  });

routerRecruiter.get('/createJob/:id', (req, res) => {
  const { id } = req.params;
  
  res.render('recruiter/newJob', {id} );
})
// rota para pegar dados do formulario e criar vaga no banco

routerRecruiter.post('/createJob/:id', (req, res, next) =>{
  const { id } = req.params;
  const {title,city,skills,company, wage} = req.body;
  const {currentUser} = req.session;
  
  if (!title || !city || !skills || !company || !wage ) {
    res.render('recruiter/newJob', { currentUser, errorMessage: 'Todos os campos são mandatorios. Por favor verifique o preenchimento' });
    return;
  }
  let newSkills = skills.split(','); 

  Job.create({title,city, wage, skills : newSkills,company, recruiter_id : id})

      .then( jobFromDB => {
        console.log(`Vaga criada com sucesso ${jobFromDB.title}`)
        
        res.render('recruiter/profileRecruiter',{currentUser} );
        
    })
      .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          res.status(500).render('recruiter/newJob', {currentUser, errorMessage: error.message });
        } else {
          next(error);
        }
  });
});

routerRecruiter.post('/listJobs/:id', (req, res)=>{

const { id } = req.params;
  Job.find({recruiter_id : id})
  .then( jobsFromDB =>{
    const {currentUser} = req.session;
    res.render('recruiter/profileRecruiter', {jobsFromDB, currentUser})
  })
  .catch( err =>{
    res.render('recruiter/profileRecruiter', {  currentUser, errorMessage:'Nenhuma vaga a ser exibida, crie novas vagas!'})
})
})



module.exports = routerRecruiter;
