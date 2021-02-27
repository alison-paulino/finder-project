const express = require('express');
const matchRouter  = express.Router();
const Job= require('../models/job.model');
const Candidate = require('../models/candidate.model');
const Recruiter = require('../models/recruiter.model');
const mongoose = require('mongoose');

const query = Candidate.find();
query instanceof mongoose.Query; // true


  matchRouter.post('/matchCandidate/:id', async (req, res) =>{
    let matchedJobs = [];
    const { id } = req.params;
    let jobsFromDB;
    let resultJobs;
    try {
       jobsFromDB = await Job.find({recruiter_id : id})  
    } catch (error) {
      console.log(error);
    }
    let query = {};
    for(let i = 0; i < jobsFromDB.length; i +=1){
      query ={ $or : []};
      for(let j = 0; j < jobsFromDB[i].skills.length; j +=1){
        query.$or.push({skills:{$all:[jobsFromDB[i].skills[j]]}});
      }
      try {
        resultJobs = await Candidate.find(query);  
      } catch (error) {
        console.log(error);
      }
     matchedJobs.push({...jobsFromDB[i]._doc,candidates: resultJobs})
    }
    console.log("===> Result Jobs ",matchedJobs);
     const {currentUser} = req.session;
    res.render('match/matchCandidate', {matchedJobs, currentUser});
  })
  matchRouter.post('/matchJob/:id', async (req, res) =>{
    const {id} = req.params;
    let candidateFromDB;
    let resultJobs;
    try {
      candidateFromDB = await Candidate.findById(id)
      console.log('===> Candidato ',candidateFromDB);
    } catch (error) {
      console.log(error)
    }
    
    try {
    let query ={ $or : []};
    for(let i = 0; i < candidateFromDB.skills.length; i +=1){
      query.$or.push({skills:{$all:[candidateFromDB.skills[i]]}});
    }  
    resultJobs = await Job.find(query).populate('recruiter_id');
    console.log('===> Vagas ',resultJobs);
    } catch (error) {
      console.log('resultJobs erro:',error);
    }
    
     const {currentUser} = req.session;
      res.render('match/matchJob', {resultJobs, currentUser});
  })

module.exports = matchRouter;