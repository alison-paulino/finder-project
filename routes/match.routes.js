const express = require('express');
const matchRouter = express.Router();
const Job = require('../models/job.model');
const Candidate = require('../models/candidate.model');
const Recruiter = require('../models/recruiter.model');
const mongoose = require('mongoose');

const query = Candidate.find();
query instanceof mongoose.Query; 
matchRouter.get('/matchCandidate/candidateDetails/:id', (req, res) =>{
  const { id } = req.params;
	const { currentUser } = req.session;
  Candidate.findById(id)
		.then((candidateFromDB) => {
			if(!req.session.currentUser){
				res.redirect('/');
				return;
			}
      res.render('match/candidateDetails', { candidateFromDB, currentUser });
		});
})

matchRouter.post('/matchCandidate/:id', async (req, res) => {
	let matchedJobs = [];
	const { id } = req.params;
	let jobsFromDB;
	let resultJobs;
	const { currentUser } = req.session;
	try {
		jobsFromDB = await Job.find({ recruiter_id: id });
	
	} catch (error) {
		console.log(error);
	}
	let query = {};
	for (let i = 0; i < jobsFromDB.length; i += 1) {
		query = { $or: [] };
		for (let j = 0; j < jobsFromDB[i].skills.length; j += 1) {
			query.$or.push({ skills: { $all: [jobsFromDB[i].skills[j]] } });
		}
		try {
		
			resultJobs = await Candidate.find(query);
				console.log("retorno find candidatos",resultJobs);
				
		} catch (error) {
			console.log(error);
		}
		matchedJobs.push({ ...jobsFromDB[i]._doc, candidates: resultJobs });
	}

	let filterMatchedJobs =	matchedJobs.filter(element => {
		return element.candidates.length > 0;
	})
	console.log
	
		
	res.render('match/matchCandidate', { matchedJobs:filterMatchedJobs, currentUser });
});


matchRouter.get('/matchJob/jobDetails/:id', (req, res) => {
	const { id } = req.params;
	const { currentUser } = req.session;
	Job.findById(id)
		.populate('recruiter_id')
		.then((jobFromDB) => {
      console.log(jobFromDB);
			res.render('match/jobDetails', { jobFromDB, currentUser });
		});
});

matchRouter.post('/matchJob/:id', async (req, res) => {
	const { id } = req.params;
	let candidateFromDB;
	let resultJobs;
	const { currentUser } = req.session;
	try {
		candidateFromDB = await Candidate.findById(id);
		
	} catch (error) {
		console.log(error);
	}

	try {
		let query = { $or: [] };
		for (let i = 0; i < candidateFromDB.skills.length; i += 1) {
			query.$or.push({ skills: { $all: [candidateFromDB.skills[i]] } });
		}
		
		resultJobs = await Job.find(query).populate('recruiter_id');
			
		if(!resultJobs.length ){
			 res.render('candidate/profileCandidate', { currentUser, errorMessage: 'Nenhuma vaga correspondente as suas skills' });
			 return;
		}
	} catch (error) {
		console.log('resultJobs erro:', error);
	}

	

	res.render('match/matchJob', { resultJobs, currentUser });
});

module.exports = matchRouter;
