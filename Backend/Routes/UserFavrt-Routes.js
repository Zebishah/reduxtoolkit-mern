import express from 'express';
import { addFavrt, showFavrts } from '../Controllers/UserFavrt-Controller.js';

const UserFavrtRoutes = express.Router();

UserFavrtRoutes.post('/addFavrt/:id', addFavrt);
UserFavrtRoutes.get('/showFavrt', showFavrts);
UserFavrtRoutes.post('/removeFavrt/:id', addFavrt);
export default UserFavrtRoutes;
