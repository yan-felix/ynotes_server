const express = require('express');
const routes = express.Router();

const notesController = require('./controllers/notesController');
const accessController = require('./controllers/accessController');
const accountController = require('./controllers/accountController');

// Rotas de GET
routes.get('/auth', accessController.authUser);
routes.get('/my_notes', notesController.myNotes);

// Rotas de POST
routes.post('/login', accessController.login);
routes.post('/sign_up', accessController.signUp);
routes.post('/logout', accessController.logout);
routes.post('/create_note', notesController.createNote);
routes.post('/update_priority', notesController.toggleNotePriority);
routes.post('/change_name', accountController.changeAccountName);
routes.post('/change_email', accountController.changeAccountEmail);
routes.post('/change_password', accountController.changeAccountPassword)

// Rotas de DELETE
routes.delete('/delete_note/:noteID', notesController.deleteNote);
/* Rota a serem implementadas no front-end: */
routes.delete('/delete_account', accountController.deleteAccount)

module.exports = routes;
