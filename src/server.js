
const http = require('http');
const express = require('express');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

// Cria a aplicação Express
const app = express();

// Configuração do Cors
const ORIGIN = "https://ynotes-client.vercel.app/";

const corsOptions = {
  origin: ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'user-id', 'token'], // Cabeçalhos permitidos
  credentials: true, // Permitir envio de cookies de credenciais
};

// Configuração da aplicação Express
app.use(cors());

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