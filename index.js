import express from 'express';
import bootstrap from './src/app.controller.js';
import dotenv from "dotenv";
import path from "path";


dotenv.config({path: path.join("./src/config/.env")})


const app = express();
const port = process.env.port || 5000;



await bootstrap(app, express);

app.listen( () => console.log(`Example app listening on port !`))