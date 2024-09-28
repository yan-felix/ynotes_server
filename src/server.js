
const http = require('http');
const express = require('express');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

// Cria a aplicação Express
const app = express();
const server = http.createServer(app);

// Configuração do Cors
const ORIGIN = "http://localhost:3000";

const corsOptions = {
  origin: ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'user-id', 'token'], // Cabeçalhos permitidos
  credentials: true, // Permitir envio de cookies de credenciais
};

// Configuração da aplicação Express
app.use(cors(corsOptions));

app.use(session({ secret: 'YCFandeixisekeidoapp' }));

app.use(express.json());

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, 'temp')
}));

app.use(routes);

// Inicialização do servidor
const PORT = parseInt(process.env.PORT, 10) || 3030;
app.listen(PORT, () => {
  console.log(`Server running at PORT: ${PORT}`);
});

/*
import * as http from 'http';
import express from 'express';
import { Application } from 'express';

const routes = require('./routes');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');

//Cria a aplicação Express
const app: Application = express();
const server: http.Server = http.createServer(app);

//Configuração do Cors
const ORIGIN = "http://localhost:3000"

const corsOptions = {
  origin: ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'user-id', 'token'], // Cabeçalhos permitidos
  credentials: true, // Permitir envio de cookies de credenciais
};

//Configuração da aplicação Express
app.use(cors(corsOptions));

app.use(session({secret: 'YCFandeixisekeidoapp'}));

app.use(express.json());

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'temp')
}));

app.use(routes);

//Inicialização do servidor 
const PORT: number = parseInt(process.env.PORT as string, 10) || 3030;
app.listen(PORT, () => {
  console.log(`Server running at PORT: ${PORT}`);
});
*/