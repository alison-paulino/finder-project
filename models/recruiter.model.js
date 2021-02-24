const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recruiterSchema = new Schema(
  {
      name: {
        type: String,
        time: true,
        required: [true, 'Nome é obrigatório.'],
       
      },
      lastName: {
        type: String,
        required: [true, 'Sobrenome é obrigatório.']
    },
      email: {
        type: String,
        required: [true, 'Email é obrigatório.'],
        match: [/^\S+@\S+\.\S+$/, 'Por favor, use um email válido.'],
        unique: true,
        lowercase: true,
        trim: true
      },
      passwordHash: {
        type: String,
        required: [ true, 'Password é obrigatório.']
      },
      city: {
        type: String,
        required: [true, 'Cidade é obrigatório'],
      },
      phone: {
        type: Number,
        required: [true, 'Telefone é obrigatório'],
      },

      company: {
        type: String,
        required: [true, 'Empresa é obrigatório'],
      },
  },
  {
    timestamps : true
  }
  );

const Recruiter = mongoose.model('Recruiter', recruiterSchema);
module.exports = Recruiter;