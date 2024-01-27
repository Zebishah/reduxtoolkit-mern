import express from 'express';
import { body } from 'express-validator';
import { get } from 'mongoose';
import { addProduct, deleteProduct, getProducts } from '../Controllers/Product-Controllers.js';
// const { query, validationResult, body } = require('express-validator');
const ProductRoutes = express.Router();
ProductRoutes.post('/addProduct', [
    body("name", "Please enter product name").notEmpty(),
    body("price", "Please enter product price").notEmpty(),
    body("company", "Please enter product company").notEmpty(),
    body("quantity", "Please enter product quantity").notEmpty(),
    body("sells", "Please enter product sells").notEmpty(),
    body("admins", "Please enter product admins").notEmpty(),
    body("buyers", "buyers can't be blank").notEmpty(),
], addProduct);
ProductRoutes.get('/getProducts', getProducts);
ProductRoutes.post('/deleteProduct/:id', deleteProduct);
export default ProductRoutes;