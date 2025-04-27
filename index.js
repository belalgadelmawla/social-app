import express from 'express';
import bootstrap from './src/app.controller.js';
import path from "path";
import dotenv from "dotenv";


path.join(process.cwd(), "src", "config", ".env")

// dotenv.config({path: path.join("./src/config/.env")})


const app = express();
const port = process.env.port || 5000;



await bootstrap(app, express);

app.listen( () => console.log(`Example app listening on port 3000 !`))