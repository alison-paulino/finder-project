const { response } = require('express');
const express = require('express');
const routerCandidate = express.Router();

routerCandidate.get('/candidatePre', (req, res)=>{
  
    let formCandidate = '';

    formCandidate = `

    <form action="/candidatePre" method="POST">
    <label for="name-candidate" >Nome</form>
    <input type="text" name ="name" id="name-candidate" placeholder= "Nome">
    <br><br>
    <label form="email">Nome</form>
    <input type="email" name="email" id="email-candidate" placeholder= "E-mail">
    <br><br>
    <button type="submit">Login</button>
    </form>

    `
    res.render('index', {formCandidate})
  })

  routerCandidate.post('/candidatePre', (req, res) =>{
    const {name, email} = req.body;
    console.log(req.body);
   
    res.render('candidate/profile',{name, email });
   })

  routerCandidate.get('/profile', (req, res) =>{
    const { name, email } = req.body;

    res.render('profile.hbs', { name, email })

  })

  module.exports = routerCandidate;

