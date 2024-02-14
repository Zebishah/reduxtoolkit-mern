import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Product from '../Models/Product.js';
import User from '../Models/User.js';
import Admin from '../Models/Admin.js';
import UserFavrt from '../Models/UserFavrt.js';
import SubCategory from '../Models/SubCategory.js';
let success = null;
export const addFavrt = async (req, res, next) => {
    let products = [];
    let user;
    let { size } = req.body;
    let pro_id = req.params.id;
    const extractedToken = req.header("auth-token");
    let userId, i = 0;
    if (!extractedToken || extractedToken.trim() == "") {
        success = false;
        return res.status(400).json({ success, message: "No user token found..." })
    }

    jwt.verify(extractedToken, process.env.JWT_SECRET, (err, decrypted) => {
        if (err) {
            success = false;
            return res.status(400).json({ success, message: "wrong one token is not authenticated...", error: err })
        }
        else {
            userId = decrypted.id;
        }
    })

    // let { name, price, company, quantity, sells, pic, buyers, available } = req.body;

    let discountedPrice, quant, BQuantity = 1;
    try {
        user = await User.findById(userId);
    } catch (error) {
        return next(error);
    }
    if (!user) {
        success = false;
        return res.status(400).json({ success, message: "This user is not existed " });
    }
    let existingProduct;
    try {
        existingProduct = await Product.findById(pro_id);

        var { proId, name, price, company, discount, pics, sells, quantity, parentId, sizes, description, rating, available } = existingProduct;

    } catch (error) {
        return console.log(error);
    }

    if (!existingProduct) {
        success = false;
        return res.status(400).json({ success, message: "Product not existed u cant add it in Favorities" });
    }
    let product, productExists = [], proFind;
    try {
        productExists = await UserFavrt.find();
    } catch (error) {
        return console.log(error);
    }
    let category;
    category = await SubCategory.findById(parentId);
    if (!category) {
        success = false;
        return res.status(400).json({ success, message: "Category is not existed" })
    }

    // if (productExists.proId) {


    // const isUserInArray = (array, idToCheck) => {
    //     return array.some(obj => obj.buyer === idToCheck);
    // };
    // const userExists = isUserInArray(productExists, userId);
    if (!user.wishList.includes(existingProduct.id)) {
        try {

            product = new UserFavrt({ proId: existingProduct.id, name, price, company, discount, pics, sells, buyer: user.id, quantity, category: category.name, sizes, description, rating, available })
            // product2 = new CartProduct({ name, pic, price, company, buyer: userId, quantity: quantity, category, discount })
            await product.save();

            products.push({ proId: existingProduct.id, name, price, company, discount, pics, sells, buyer: user.id, quantity, category: category.name, sizes, description, rating, available });


            const session = await mongoose.startSession();
            session.startTransaction();
            await existingProduct.save({ session });
            // existingProduct.buyers.push(user.id);
            // existingProduct.sells = existingProduct.sells + 1;
            // existingProduct.quantity = existingProduct.quantity - 1;
            // quant = 1;
            // let initPrice = price;
            // discountedPrice = (initPrice * quant) * (1 - 0.02);
            // totalPrice = totalPrice + discountedPrice;
            // totalDiscount = totalDiscount + existingProduct.discount;
            // deliveryCharges = "free";
            // finalPrice = totalPrice;
            // bill.push({ totalDiscount: totalDiscount, totalPrice: totalPrice, deliveryCharges: deliveryCharges, finalPrice: finalPrice })
            if (!user.wishList.includes(existingProduct.id)) {
                user.wishList.push(existingProduct.id);
            }

            await existingProduct.save({ session });

            await user.save({ session });
            await session.commitTransaction();

        } catch (error) {
            return next(error);
        }

        success = true
        return res.status(200).json({ success, message: "product added in Favorities successfully", favorities: products, user: user, })
    }
    else {
        success = false;
        return res.status(200).json({ success, message: "product is already in Favorities ", favorities: products, user: user })
    }
}
export const showFavrts = async (req, res, next) => {
    const extractedToken = req.header("auth-token");
    let userId, i = 0;
    if (!extractedToken || extractedToken.trim() == "") {
        success = false;
        return res.status(400).json({ success, message: "No user token found..." })
    }

    jwt.verify(extractedToken, process.env.JWT_SECRET, (err, decrypted) => {
        if (err) {
            success = false;
            return res.status(400).json({ success, message: "wrong one token is not authenticated...", error: err })
        }
        else {
            userId = decrypted.id;
        }
    })

    let user;
    try {
        user = await User.findById(userId);
    } catch (error) {
        return next(error);
    }
    if (!user) {
        success = false;
        return res.status(400).json({ success, message: "This User is not existed" });
    }
    let userToCheck = [];
    try {

        userToCheck = await User.findById(user.id).populate("wishList");

    } catch (error) {
        return next(error);
    }
    if (!userToCheck) {
        success = false;
        return res.status(400).json({ success, message: "no user found in database" })
    }


    // if (productExists.proId) {
    // const isIdInArray = (array, idToCheck) => {
    //     return array.some(obj => obj.proId === idToCheck);
    // };
    // const idExists = isIdInArray(cartProducts, user.id);


    // const userExists = foundObject.buyer.toString() == user.id;

    // const userExists = foundObjects.some(obj => obj.buyer.toString() === user.id);

    success = true;
    res.status(200).json({ success, message: "here are your all products", cartProducts: userToCheck.wishList })
}
export const removeFromFavrt = async (req, res, next) => {
    let id = req.params.id;
    const extractedToken = req.header("auth-token");
    let userId, i = 0;
    if (!extractedToken || extractedToken.trim() == "") {
        success = false;
        return res.status(400).json({ success, message: "No user token found..." })
    }

    jwt.verify(extractedToken, process.env.JWT_SECRET, (err, decrypted) => {
        if (err) {
            success = false;
            return res.status(400).json({ success, message: "wrong one token is not authenticated...", error: err })
        }
        else {
            userId = decrypted.id;
        }
    })

    let user;
    try {
        user = await User.findById(userId);
    } catch (error) {
        return next(error);
    }
    if (!user) {
        success = false;
        return res.status(400).json({ success, message: "This User is not existed" });
    }
    let bill;
    try {
        bill = await Bill.findOne({ user: user.id });

    } catch (error) {
        return next(error);
    }
    if (!bill) {
        success = false;
        return res.status(400).json({ success, message: "This bill is not existed" });
    }
    let deletedProduct, product;

    try {

        deletedProduct = await BookProduct.findById(id);

        if (deletedProduct) {
            product = await Product.findById(deletedProduct.proId);
            const session = await mongoose.startSession();
            session.startTransaction();
            await bill.save({ session })
            await deletedProduct.save({ session });

            // existingProduct.buyers.push(user.id);
            // existingProduct.sells = existingProduct.sells + 1;
            // existingProduct.quantity = existingProduct.quantity - 1;


            // deletedProduct.quantity = deletedProduct.quantity - 1;
            // deletedProduct.discount = deletedProduct.discount - product.discount;
            // deletedProduct.discountPrice = deletedProduct.discountPrice - (product.price * (product.discount / 100));
            // deletedProduct.price = (product.price * deletedProduct.quantity) - (product.price * (deletedProduct.discount / 100));
            bill.totalPrice = bill.totalPrice - deletedProduct.price;
            bill.totalDiscount = bill.totalDiscount - deletedProduct.discountPrice;
            bill.finalPrice = bill.totalPrice - bill.totalDiscount;

            // console.log(cartProduct.price, cartProduct.discount, cartProduct.discountPrice, bill.totalPrice, bill.totalDiscount, bill.finalPrice)



            deletedProduct = await BookProduct.findByIdAndDelete(id);
            await deletedProduct.save({ session });
            await bill.save({ session });
            await session.commitTransaction();


            success = true;
            return res.status(200).json({ success, message: "product deleted successfully", deletedProduct: deletedProduct, bill: bill })
        }
        else (!deletedProduct)
        {
            success = false
            return res.status(400).json({ success, message: "product u wanna delete is not found" })
        }


    } catch (error) {
        return next(error);
    }


}