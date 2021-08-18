// require mongoose
const mongoose = require('mongoose');

// Require Schema from mongoose
const Schema = mongoose.Schema;
const Bookmodel = require("./Bookmodel").schema;
// Create the user schema
const demandeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, ref: 'User' 
        
      },
    book:Bookmodel,

  status: {
    type: String,
    required: true,
  },
  
});

module.exports = Demande =  mongoose.model('demande', demandeSchema);