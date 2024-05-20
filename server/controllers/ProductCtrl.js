const Product = require('../models/ProductModel');
const User = require('../models/userModel');

const productCtrl = {
  createProduct: async (req, res) => {
    try {
      const { nom, description, prix, quatityDispo } = req.body;
      const userId = req.user.id;

      const newProduct = new Product({ nom, description, prix, quatityDispo });
      await newProduct.save();

      await User.findByIdAndUpdate(userId, { $push: { products: newProduct._id } });

      res.json({ msg: "Product created", newProduct });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  getProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ msg: "Product not found" });
      res.json(product);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find({});
      res.json(products);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { nom, description, prix, quatityDispo } = req.body;

      const updateFields = {};
      if (nom) updateFields.nom = nom;
      if (description) updateFields.description = description;
      if (prix) updateFields.prix = prix;
      if (quatityDispo) updateFields.quatityDispo = quatityDispo;

      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateFields, { new: true });
      res.json({ msg: "Product updated", updatedProduct });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ msg: "Product deleted" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
};

module.exports = productCtrl;
