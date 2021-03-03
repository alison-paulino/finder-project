const express = require("express");
const Candidate = require("../models/candidate.model");
const routerCandidate = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const saltRound = 10;

// rota get renderizar formulario de pre cadastro
routerCandidate.get("/candidatePre", (req, res) => {
  let formCandidate = "";

  formCandidate = `

  <form action="/candidatePre" method="POST" class="form-group">
  <label for="name"></label>
  <input type="text" name="name" id="name-candidato" placeholder="Nome" class="form-control">
  <label for="email"></label>
  <input type="email" name="email" id="email" placeholder="E-mail" class="form-control">
  <br>
  <button type="submit" class="btn btn-primary">Criar</button>
 </form>
 `;

  res.render("index", { formCandidate });
});

// rota post para pegar dados formularios pre cadastro e renderizar cadastro completo
routerCandidate.post("/candidatePre", (req, res) => {
  const { name, email } = req.body;
  console.log(req.body);

  res.render("candidate/cadastroCandidate", { name, email });
});

routerCandidate.get("/profileCandidate", (req, res) => {
  console.log("console candidate",{currentUser: req.session.currentUser});
  res.render("candidate/profileCandidate", {currentUser: req.session.currentUser});
});

// rota get renderizar formulario cadastro candidate
routerCandidate.get("/createCandidate", (req, res, next) =>
  res.render("candidate/cadastroCandidate")
);
// rota post pegar dados formulario e criar candidato no banco
routerCandidate.post("/createCandidate", (req, res, next) => {
   const {
    name,
    lastName,
    email,
    phone,
    city,
    skills,
    wage,
    password,
  } = req.body;

  if (
    !name ||
    !lastName ||
    !email ||
    !phone ||
    !city ||
    !skills ||
    !wage ||
    !password
  ) {
    res.render("candidate/cadastroCandidate", {
      errorMessage:
        "Todos os campos são obrigatórios. Por favor, preencha com o seu Sobrenome, Telefone, Cidade, 05(cinco) Skills, Salário pretendido e Password",
    });
  return;
  }

const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
if (!regex.test(password)) {
  res.status(500).render("candidate/cadastroCandidate", {
    errorMessage:
      "A password precisa ter, pelo menos, 6 caracteres, conter um número, uma letra maiúscula, uma letra minúscula e um caractere especial.",
  });
  return;
}

const salt = bcrypt.genSaltSync(saltRound);
const hashedPassword = bcrypt.hashSync(password, salt);
 newSkills = skills.split(',');
Candidate.create ({ name, lastName, email, phone, city, skills : newSkills, wage, passwordHash: hashedPassword })
  .then(candidateFromDB => {
    console.log(candidateFromDB);
    req.session.currentUser = candidateFromDB;
    res.redirect("/profileCandidate");
  })

  .catch((error) => {
    if (error instanceof mongoose.Error.ValidationError) {
      res
        .status(500)
        .render("candidate/cadastroCandidate", { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render("candidate/cadastroCandidate", {
        errorMessage: "E-mail já está sendo utilizado.",
      });
    } else {
      next(error);
    }
  });
});

// rota get para pegar id e trazer dados para edição
routerCandidate.get("/editCandidate/:id", (req, res) => {
  const { id } = req.params;

  Candidate.findById(id)
    .then((candidateFromDB) => {
      
      res.render("./candidate/editProfileCandidate", {candidateFromDB})
    })
    .catch(error => console.log('Erro do edit', error));
});
// rota post pegar dados do formulario editado e alterar no banco
routerCandidate.post("/editCandidate/:id" , (req, res, next) =>{
  const { id } = req.params;
  const { name, lastName, phone, city, skills, wage, password } = req.body;

  if (!lastName || !city || !password || !phone|| !skills|| !name|| !wage ) {
    res.render('candidate/editProfileCandidate', { errorMessage: 'Todos os campos são mandatorios. Por favor verifique o preenchimento' });
    return;
  }
const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render('canditate/editProfileCandidate', { flag: true , errorMessage: 'Password precisa ter pelo menos 6 caracteres, possuir pelo menos 1 numeral, 1 letra maiuscula e uma letra minuscula! e 1 caracter especial' });
    return;
  }

  Candidate.findByIdAndUpdate(id, { name, lastName, phone, city, skills, wage, passwordHash: password }, {new: true})
  .then(candidateFromDB => {
    console.log(candidateFromDB);
    req.session.currentUser = candidateFromDB;
    res.redirect("/profileCandidate");
  })

  .catch((error) => {
    if (error instanceof mongoose.Error.ValidationError) {
      res
        .status(500)
        .render("candidate/editProfileCandidate", { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render("candidate/editeProfileCandidate", {
        errorMessage: "E-mail já está sendo utilizado.",
      });
    } else {
      next(error);
    }
  });

})

module.exports = routerCandidate;
