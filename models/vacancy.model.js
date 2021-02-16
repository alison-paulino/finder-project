const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Recruiter = require('../models/recruiter.model');

const vacancySchema = new Schema(
  {
    title: {
      type: String,
      time: true,
      required: [true, 'Nome é obrigatório.'],
      unique: true
    },
    skills: {
      type: [String],
      required: [true, 'Obrigatório o preenchimento de, pelo menos, 5 skills']
   },
   city: {
    type: String,
    required: [true, 'Cidade é obrigatório'],
    },
    wage: {
      type: Number,
      required: [true, 'Salario é obrigatório']
  },
    company: {
    type: String,
    required: [true, 'Cidade é obrigatório'],
    },
  recruiter_id: {  
    type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter'
  },
  },
  {
    timestamps: true
  }
  );

const Vacancy = mongoose.model('Vacancy', vacancySchema);
module.exports = Vacancy;