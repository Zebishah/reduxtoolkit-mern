import express, { json } from 'express';
import connectDB from '../Backend/Db.js';
const app = express();
import AdminRoutes from './Routes/Admin-Routes.js';
import { config } from 'dotenv';
config();
import cors from 'cors';
import ProductRoutes from './Routes/Product-Routes.js';
import UserRoutes from './Routes/User-routes.js';


app.use(cors({
    origin: "http://localhost:3000", // Replace with your actual frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(json())
const port = process.env.PORT || 5000;
connectDB();
let host = process.env.REACT_APP_API_HOST
// app.get('/', (req, res, next) => {
//     res.json({ message: 'API is up and running' });
// });
app.use('/Admin', AdminRoutes);
app.use('/User', UserRoutes);
app.use('/Product', ProductRoutes);
app.listen(port, () => {
    console.log("Server is Listening at Port" + host);
})