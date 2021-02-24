const { Schema, model, Mongoose } = require('mongoose');
const Job = require('../models/job.model');

const candidateSchema = new Schema(
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
        phone: {
            type: Number,
            required: [true, 'Telefone é obrigatório'],
        },
        city: {
            type: String,
            required: [true, 'Cidade é obrigatório'],
        },
        skills: {
            type: [String],
            required: [true, 'Obrigatório o preenchimento de, pelo menos, 5 skills']
        },
        wage: {
            type: Number,
            required: [true, 'Salario é obrigatório']
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
        job_id: {
            type: Schema.Types.ObjectId, ref: 'Job'
          }
    },
    {
        timestamps: true
    }
);
module.exports = model('Candidate', candidateSchema);