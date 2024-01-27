import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import Product from '../Models/Product.js';
import Admin from '../Models/Admin.js';
import mongoose from 'mongoose';
import BookProduct from '../Models/BookProduct.js';
//addProduct

export const buyProduct = async (req, res, next) => {
    let products = [];
    const extractedToken = req.header("auth-token");
    let userId;
    if (!extractedToken || extractedToken.trim() == "") {
        res.status(400).json({ message: "No user token found..." })
    }

    jwt.verify(extractedToken, process.env.JWT_SECRET, (err, decrypted) => {
        if (err) {
            return res.status(400).json({ message: "wrong one token is not authenticated...", error: err })
        }
        else {
            userId = decrypted.id;
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
