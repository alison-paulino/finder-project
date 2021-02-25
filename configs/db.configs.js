const mongoose = require('mongoose');
require('dotenv').config();

mongoose
  .connect(`mongodb+srv://${process.env.UserBD}@cluster0.rvgoa.mongodb.net/FinderDB?retryWrites=true&w=majority`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));