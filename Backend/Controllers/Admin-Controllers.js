import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../Models/Admin.js';
import Product from '../Models/Product.js';
export const createAdmin = async (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        const errorMessages = result.array().map(error => error.msg);

        return res.status(400).json({ error: errorMessages });
    } else {
        let { name, email, password, addedProducts } = req.body;

        let existingAdmin;
        existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            res.status(400).json({ message: "user is already existed" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        let admin;
        try {
            admin = new Admin({ name, email, password: hashedPassword, addedProducts })
            admin = await admin.save();
        } catch (error) {
            return next(error);
        }
        if (!admin) {
            res.status(400).json({ message: "user not found" })
        }
        res.status(200).json({ message: "User signed up successfully", admin: admin })
    }
}

export const adminLogin = async (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        const errorMessages = result.array().map(error => error.msg);

        return res.status(400).json({ error: errorMessages });
    } else {
        let { email, password } = req.body;

        let existingAdmin;
        try {
            existingAdmin = await Admin.findOne({ email });
        } catch (error) {
            return next(error);
        }

        if (!existingAdmin) {
            res.status(400).json({ message: "Unauthenticated login detected" })
        }
        const isCorrectPassword = bcrypt.compareSync(password, existingAdmin.password)

        if (!isCorrectPassword) {
            res.status(400).json({ message: "user not found" })
        }
        const token = jwt.sign({ id: existingAdmin._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });
        res.status(200).json({ message: "User signed in successfully", token: token, id: existingAdmin._id, admin: existingAdmin })
    }
}

//get all admins
export const getAdmins = async (req, res, next) => {
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
    let Admins;
    try {
        Admins = await Admin.find();
    } catch (error) {
        return next(error);
    }

    if (!Admins) {
        res.status(400).json({ message: "no admins are here" })
    }

    res.status(200).json({ message: "here are your all admins", admin: Admins })
}





