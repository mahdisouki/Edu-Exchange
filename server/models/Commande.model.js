const mongoose = require("mongoose");

const CommandeSchema = new mongoose.Schema({
  dataCommande: { type: String, required: true },
  quantity: { type: String, required: true },

  
  
});

module.exports = mongoose.model("Commande", CommandeSchema);