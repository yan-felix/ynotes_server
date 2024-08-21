const mongoose = require('mongoose')

const AnnotationDataSchema = new mongoose.Schema({
    user_id: String,
    title: String,
    notes: String,
    priority: Boolean,
})

module.exports = mongoose.model('Annotations', AnnotationDataSchema)