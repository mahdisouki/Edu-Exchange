const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  products: {type:mongoose.Types.ObjectId , ref : "Product"}
});

module.exports = mongoose.model("user", UserSchema);