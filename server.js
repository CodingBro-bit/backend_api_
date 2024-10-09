import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
// import path from 'path';
import { fileURLToPath } from 'url';  // Required to construct __dirname in ES modules
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from './services/server_service.js';

import { Connection } from './database/database.js';
import { routes } from './routes/index.js';

const connection = new Connection();

const server = new Server(process.env.PORT , [] , routes , connection)
server.addMiddlwares(cors())
server.addMiddlwares(cookieParser())
server.addMiddlwares(express.json())
server.addMiddlwares(express.urlencoded({ extended: false }))
server.configureMiddlwares();

server.configureRoutes();
console.log(server.getMiddlwares())
server.start().then( () => {
    console.log('connected')
})
.catch( error => {
    console.log(error)
});
