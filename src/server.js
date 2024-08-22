const express = require('express');
const fileUpload = require('express-fileupload');
//const cors = require('cors');
const path = require('path');
const route = require('./routes')
const server = express();
const PORT = process.env.PORT || 3030;

require('./database/config');

const ORIGIN = 'https://ynotes-client.vercel.app';
//const DEV_ORIGIN = 'http://localhost:3000'

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};


server.use(express.json());

server.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'temp')
}));

server.use(cors(corsOptions));

server.use(route)

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`)
})