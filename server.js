import express from "express";
import path from 'path';
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Connection/database.js";
import morgan from "morgan";
import authRoute from "./routes/authRoute.js";
import categoryRoute from './routes/categoryRoute.js';
import productRoute from './routes/productRoute.js';

const app = express();
//configures env
dotenv.config();
// const PORT = process.env.PORT || 4500;
app.use(cors());
//Middleware
app.use(express.json());
app.use(morgan('dev'));

//DataBase Connect
connectDB();

//routes
app.use('/api/v1/auth', authRoute);
//Rooutes for Category
app.use('/api/v1/category', categoryRoute);
//Routes for Product
app.use('/api/v1/product', productRoute);

// Static files (e.g., React app) should be served using the absolute path, not __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, './ecommerce/build')));

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './ecommerce/build/index.html'));
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running at https://localhost:${PORT}`);
});
