const express = require('express');
const routes = express.Router()

const annotationsController = require('./controllers/annotationsController')
const priorityController = require('./controllers/piorityController')

routes.get('/annotations', annotationsController.showNotes)
routes.get('/priorities', priorityController.showPrioritiesNotesOnly)

routes.post('/create_annotation', annotationsController.createNote)
routes.post('/update_priorty/:noteID', priorityController.updateNote)

routes.delete('/delete_annotation/:noteID', annotationsController.deleteNote)

module.exports = routes