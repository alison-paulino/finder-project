const { Router } = require("express");
const authCandidate = new Router();
const Candidate = require("../models/candidate.model");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const saltRound = 10;
/*

authCandidate.get("/createCandidate", (req, res, next) =>
  res.render("candidate/cadastroCandidate")
);

authCandidate.post("/createCandidate", (req, res, next) => {
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

Candidate.create ({ name, lastName, email, phone, city, skills, wage, passwordHash: hashedPassword })
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
*/


module.exports = authCandidate;
