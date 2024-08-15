const Annotations = require('../database/model')

module.exports = {
    async showPrioritiesNotesOnly(req, res){
        const priorityNotes = await Annotations.find({priority: true})

        return res.json(priorityNotes)
    },

    async updateNote(req, res){
        const annotation = await Annotations.findOne({
            _id : req.params.noteID
        })
        
        if(annotation.priority){
            annotation.priority = false
        }else{
            annotation.priority = true
        }

        await annotation.save()

        return res.json(annotation)
    }
}