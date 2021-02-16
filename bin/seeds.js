const mongoose = require('mongoose');
const Vacancy = require('../models/vacancy.model');
const Recruiter = require('../models/recruiter.model');
const Candidate = require('../models/candidate.model');
require('dotenv').config();

mongoose.connect(`mongodb+srv://${process.env.UserBD}@cluster0.rvgoa.mongodb.net/finderDB?retryWrites=true&w=majority`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});
/*
const candidate = [
  {
    name: 'Alison',
    lastName: 'Paulino',
    phone: 5599999999,
    city:"Holambra",
    skills:['css, javascript, html5, mongodb, regex'],
    wage: 5000,
    email: 'alisonadriel@hotmail.com',
    passwordHash:'12345',
    vacancy_id:'602b1be6bdb27d1907e1e7bb'
  }
]


const recruiter = [
  {
  name: 'Paulo',
  lastName:'Duarte',
  email: 'paulobart@outlook.com',
  passwordHash: 54321,
  city: 'Lisboa',
  phone: 35199999999,
  company: 'Finder'
  }
]
 
const vacancy = [
    {
        recruiter_id: "602b1b3254b15718b307b4de",
        title: 'Dev Javascript',
        skills:['css, html, javascript, nodejs, ajax'],
        city: 'São Paulo' ,
        wage: 5000,
        company: 'Finder',
    },
    {
      recruiter_id: "602b1b3254b15718b307b4de",
        title: 'Dev Php',
        skills:['css, html, php, nodejs, regex'],
        city: 'Lisboa' ,
        wage: 5000,
        company: 'Finder',
    }
]
Vacancy.create(vacancy)
.then(vacancyCreateDB => {
    console.log(`vacancy created ${vacancyCreateDB.length}`)
    mongoose.connection.close();
})              
.catch(err => console.log(err))

 
Recruiter.create(recruiter)
.then(recruiterCreateDB => {
    console.log(`Recruiter created ${recruiterCreateDB.length}`)
    mongoose.connection.close();
})
             
.catch(err => console.log(err))

Candidate.create(candidate)
.then(candidateCreateDB => {
    console.log(`Candidate created ${candidateCreateDB.length}`)
    mongoose.connection.close();
})
             
.catch(err => console.log(err))
*/