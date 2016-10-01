var mongoose = require('mongoose');

var dishSchema = new mongoose.Schema({
  dishId: { type: String, unique: true, index: true },
  name: String,
  description: String,
  image: String,
  link: String,
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  reports: { type: Number, default: 0 },
  random: { type: [Number], index: '2d', default: [0,0] },
  voted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Dish', dishSchema);