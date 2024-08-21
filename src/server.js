const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
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

server.use(session({
    store: MongoStore.create({ 
        mongoUrl: 'mongodb+srv://db_user:se_db_user_manugin@ynotescluster.aewclyc.mongodb.net/?retryWrites=true&w=majority&appName=yNotesCluster',
    }),
    secret: 'YCFandeixisekeidoapp',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}));

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