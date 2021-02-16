const { Schema, model, Mongoose } = require('mongoose');

const candidateSchema = new Schema(
    {
        name: {
            type: String,
            time: true,
            required: [true, 'Nome é obrigatório.'],
            unique: true
        },
        
        sobrenome: {
            type: String,
            required: [true, 'Sobrenome é obrigatório.']
        },

        telefone: {
            type: Number,
            required: [true, 'Telefone é obrigatório'],
        },

        cidade: {
            type: String,
            required: [true, 'Cidade é obrigatório'],
        },

        skills: {
            type: [String],
            required: [true, 'Obrigatório o preenchimento de, pelo menos, 5 skills']
        },

        salario: {
            type: Number,
            required: [true, 'Salario é obrigatório']
        },


        email: {
            type: String,
            required: [true, 'Email is required.'],
            match: [/^\S+@\S+\.\S+$/, 'Por favor, use um email válido.'],
            unique: true,
            lowercase: true,
            trim: true
        },

        
          username: {
              type: String,
              time: true,
              required: [true, 'Username is required.'],
              unique: true
          },

        
        passwordHash: {
            type: String,
            required: [ true, 'Password is required.']
    }
    },
    {
        timestamps: true
    }
);

module.exports = model('Candidate', candidateSchema);