import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Product from '../Models/Product.js';
import User from '../Models/User.js';
import Admin from '../Models/Admin.js';
export const createUser = async (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        const errorMessages = result.array().map(error => error.msg);

        return res.status(400).json({ error: errorMessages });
    } else {
        let { name, email, password, buyProducts } = req.body;

        let existingUser;
        existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "user is already existed" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        let user;
        try {
            user = new User({ name, email, password: hashedPassword, buyProducts })
            user = await user.save();
        } catch (error) {
            return next(error);
        }
        if (!user) {
            res.status(400).json({ message: "user not found" })
        }
        res.status(200).json({ message: "User signed up successfully", user: user })
    }
}

export const userLogin = async (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        const errorMessages = result.array().map(error => error.msg);

        return res.status(400).json({ error: errorMessages });
    } else {
        let { email, password } = req.body;

        let existingUser;
        try {
            existingUser = await User.findOne({ email });
        } catch (error) {
            return next(error);
        }

        if (!existingUser) {
            res.status(400).json({ message: "Unauthenticated login detected" })
        }
        const isCorrectPassword = bcrypt.compareSync(password, existingUser.password)

        if (!isCorrectPassword) {
            res.status(400).json({ message: "user not found" })
        }
        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });
        res.status(200).json({ message: "User signed in successfully", token: token, id: existingUser._id, user: existingUser })
    }
}

//get all admins
export const getUsers = async (req, res, next) => {
    const extractedToken = req.header("auth-token");
    let adminId;
    if (!extractedToken || extractedToken.trim() === "") {
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
    let admins;
    try {
        admins = await Admin.findById(adminId);
    } catch (error) {
        return next(error);
    }
    if (admins) {
        let user;
        try {
            user = await User.find();
        } catch (error) {
            return next(error);
        }

        if (!user) {
            res.status(400).json({ message: "no Users are here" })
        }

        res.status(200).json({ message: "here are your all Users", user: user })
    }
    else {
        res.status(400).json({ message: "unauthenticated admin" })
    }
}





