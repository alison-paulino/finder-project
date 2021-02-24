const express = require("express");
const Candidate = require("../models/candidate.model");
const routerCandidate = express.Router();

routerCandidate.get("/candidatePre", (req, res) => {
  let formCandidate = "";

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

  `;
  res.render("index", { formCandidate });
});

routerCandidate.post("/candidatePre", (req, res) => {
  const { name, email } = req.body;
  console.log(req.body);

  res.render("candidate/cadastro", { name, email });
});

routerCandidate.get("/profile", (req, res) => {
  res.render("candidate/profile", {currentUser: req.session.currentUser});
});

routerCandidate.get("/editCandidate/:id", (req, res) => {
  const { id } = req.params;

  Candidate.findById(id)
    .then((candidateFromDB) => {
      
      res.render("./candidate/editProfile", {candidateFromDB})
    })
    .catch(error => console.log('Erro do edit', error));
});

routerCandidate.post("/editCandidate/:id" , (req, res, next) =>{
  const { id } = req.params;
  const { name, lastName, phone, city, skills, wage, password } = req.body;

  Candidate.findByIdAndUpdate(id, { name, lastName, phone, city, skills, wage, passwordHash: password }, {new: true})
  .then(candidateFromDB => {
    console.log(candidateFromDB);
    req.session.currentUser = candidateFromDB;
    res.redirect("/profile");
  })

  .catch((error) => {
    if (error instanceof mongoose.Error.ValidationError) {
      res
        .status(500)
        .render("candidate/editProfile", { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render("candidate/editeProfile", {
        errorMessage: "E-mail já está sendo utilizado.",
      });
    } else {
      next(error);
    }
  });

})

module.exports = routerCandidate;
