const { Router } = require("express");
const authCandidate = new Router();
const Candidate = require("../models/candidate.model");
const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const saltRound = 10;

authCandidate.get("/create", (req, res, next) =>
  res.render("candidate/cadastro")
);

authCandidate.post("/create", (req, res, next) => {
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
    res.render("candidate/cadastro", {
      errorMessage:
        "Todos os campos são obrigatórios. Por favor, preencha com o seu Sobrenome, Telefone, Cidade, 05(cinco) Skills, Salário pretendido e Password",
    });
  return;
  }

const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
if (!regex.test(password)) {
  res.status(500).render("candidate/cadastro", {
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
    res.redirect("/profile");
  })

  .catch((error) => {
    if (error instanceof mongoose.Error.ValidationError) {
      res
        .status(500)
        .render("candidate/cadastro", { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render("candidate/cadastro", {
        errorMessage: "E-mail já está sendo utilizado.",
      });
    } else {
      next(error);
    }
  });
});

authCandidate.get("/login", (req, res, next) => res.render("auth/login"));

authCandidate.post("/login", (req, res, next) => {
  console.log("Session====>", req.session);

  const { email, password } = req.body;

  if (!email || !password) {
    res.render("auth/login", {
      errorMessage: "Por favor, email e password são obrigatórios.",
    });
    return;
  }

  Candidate.findOne({ email })
    .then((candidate) => {
      if (!candidate) {
        res.render("auth/login", {
          errorMessage:
            "Email não está registrado. Por favor, tente outro email.",
        });
        return;
      } else if (bcrypt.compareSync(password, candidate.passwordHash)) {
        res.render("auth/login", { candidate });
        req.session.currentUser = candidate;
        res.redirect("/profile");
      } else {
        res.render("auth/login", { errorMessage: "Password Incorreta." });
      }
    })
    .catch((error) => next(error));
});

authCandidate.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = authCandidate;
