
const jwt = require("jsonwebtoken")
const env = require("dotenv")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
// const { default: axios } = require("axios")
const Product = require("../Models/modelProduct");
const uploadImage = require("../utils/uploadImage");
// const ADMIN_SECRET_KEY = process.env.JWT_SECRET_KEY
// const cloudinary = require('cloudinary').v2;
env.config()



module.exports.userwelcome = async (req, res) => {
    res.status(200).json({ message: "Welcome to Bridal Image" })
}


module.exports.getallproducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Error fetching products" });
    }
}

module.exports.addproducts = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);

        let imageURLs = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await uploadImage(file.buffer);
                imageURLs.push(result.secure_url);
            }
        }

        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            category: req.body.category,
            imageURLs, // store as array
        });
        console.log(product, "Product to be saved");

        await product.save();

        res.json(product);
    } catch (err) {
        console.log("UPLOAD ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

module.exports.editproducts = async (req, res) => {
    try {
        let updateData = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            category: req.body.category,
        };

        let existingImages = [];
        if (req.body.existingImages) {
            if (Array.isArray(req.body.existingImages)) {
                existingImages = req.body.existingImages;
            } else {
                existingImages = [req.body.existingImages];
            }
        }

        let newImageURLs = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await uploadImage(file.buffer);
                newImageURLs.push(result.secure_url);
            }
        }
        updateData.imageURLs = [...existingImages, ...newImageURLs];
        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Error updating product" });
    }
};

module.exports.deleteproducts = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);

        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting product" });
    }
}   