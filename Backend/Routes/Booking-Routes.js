import express from 'express';
import { body } from 'express-validator';
import { get } from 'mongoose';
import { buyProduct } from '../Controllers/Booking-Controllers';

const bookingRoutes = express.Router();

bookingRoutes.post('/buyProduct/:id', buyProduct);

export default bookingRoutes;
