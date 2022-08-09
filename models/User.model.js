const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
  activationLink: { 
    type: String,
  },
  role: {
    type: String,
    default: 'client'
  },
  phone: String,
  name: String,
  surname: String,
  driversLicense: Number,
  wallet: {
    type: Number,
    default: 0,
  },
  rating: [],
  counter: {
    type: Number,
    default: 0
  },
  averageRating: Number
})
const User = mongoose.model("User", userSchema);

module.exports = User