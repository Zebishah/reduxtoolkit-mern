import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import Product from '../Models/Product.js';
import Admin from '../Models/Admin.js';
import mongoose from 'mongoose';

//addProduct

export const addProduct = async (req, res, next) => {
    const extractedToken = req.header("auth-token");
    let adminId;
    if (!extractedToken && extractedToken.trim() == "") {
        res.status(400).json({ message: "No token found..." })
    }

    jwt.verify(extractedToken, process.env.JWT_SECRET, (err, decrypted) => {
        if (err) {
            return res.status(400).json({ message: "wrong one token is not authenticated...", error: err })
        }
        else {
            adminId = decrypted.id;
        }
    })
    const result = validationResult(req);

    if (!result.isEmpty()) {
        const errorMessages = result.array().map(error => error.msg);

        return res.status(400).json({ error: errorMessages });
    } else {
        let { name, price, company, quantity, sells, pic, buyers, available } = req.body;
        if (quantity > 0) {
            available = true;
        }
        else {
            available = false
        }
        let admin;
        try {
            admin = await Admin.findById(adminId);
        } catch (error) {
            return next(error);
        }
        if (!admin) {
            res.status(400).json({ message: "This Admin is not existed " });
        }
        let existingProduct;
        try {
            existingProduct = await Product.findOne({ name });
        } catch (error) {
            return next(error);
        }

        if (existingProduct) {
            res.status(400).json({ message: "Product already existed " });
        }
        let product;
        try {
            product = new Product({ name, price, company, quantity, sells, pic, admins: adminId, buyers, available });

            const session = await mongoose.startSession();
            session.startTransaction();
            await product.save({ session });
            admin.addedProducts.push(product.id);
            await admin.save({ session });
            await session.commitTransaction();

        } catch (error) {
            return next(error);
        }
        if (!product) {
            res.status(400).json({ message: "product not created" });
        }

        res.status(200).json({ message: "product added successfully", product: product, admin: adminId })
    }
}

//get all products
export const getProducts = async (req, res, next) => {

    let Products;
    try {
        Products = await Product.find();
    } catch (error) {
        return next(error);
    }

    if (!Products) {
        res.status(400).json({ message: "no products found in store" })
    }

    res.status(200).json({ message: "here are your all products", Products: Products })
}

// delete a product
export const deleteProduct = async (req, res, next) => {
    const extractedToken = req.header("auth-token");
    let adminId;
    if (!extractedToken && extractedToken.trim() == "") {
        res.status(400).json({ message: "No token found..." })
    }

    jwt.verify(extractedToken, process.env.JWT_SECRET, (err, decrypted) => {
        if (err) {
            return res.status(400).json({ message: "wrong one token is not authenticated...", error: err })
        }
        else {
            adminId = decrypted.id;
        }
    })
    const result = validationResult(req);

    if (!result.isEmpty()) {
        const errorMessages = result.array().map(error => error.msg);

        return res.status(400).json({ error: errorMessages });
    }
    let id = req.params.id;
    let deletedProduct;
    try {
        deletedProduct = await Product.findByIdAndDelete(id);
    } catch (error) {
        return next(error);
    }

    if (!deletedProduct) {
        res.status(400).json({ message: "Product not existed that u are trying to delete" });
    }

    res.status(200).json({ message: "product deleted successfully", deletedProduct: deletedProduct, admin: adminId })
}

