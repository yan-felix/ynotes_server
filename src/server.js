const express = require('express');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const route = require('./routes')
const server = express();
const PORT = process.env.PORT || 3030;

require('./database/config')

const corsOptions = {
    origin: 'https://ynotes-client.vercel.app/', // Substitua por sua URL específica
    optionsSuccessStatus: 200 // Alguns navegadores antigos (como o IE11) podem precisar disso
};

server.use(session({secret: 'YCFandeixisekeidoapp'}));

server.use(express.json());

server.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'temp')
}));

server.use(cors());

server.use(route)

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`)
})