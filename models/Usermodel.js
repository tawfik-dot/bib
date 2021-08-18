// require mongoose
const mongoose = require('mongoose');

// Require Schema from mongoose
const Schema = mongoose.Schema;

// Create the user schema
const userSchema = new Schema({
    id_user: {
        type: String,
        
      },
    role: {
        type: String,
        required: true,
      },

  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  addres:{
      type:String
  },
  tel:{
      type:Number
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports  = mongoose.model('User', userSchema);
