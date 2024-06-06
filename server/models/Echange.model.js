const mongoose = require("mongoose");
const EchangeSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String, required: true },
  prix: { type: Float32Array, required: true },
  quatityDispo: { type: String, required: true },
});

module.exports = mongoose.model("Echange", EchangeSchema);