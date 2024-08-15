const Annotations = require('../database/model')

module.exports = {
    async showNotes(req, res){
        const annotationsList = await Annotations.find()
        return res.json(annotationsList)
    },

    async createNote(req, res){
        const { title, notes, priority } = req.body;

        if(!notes || !title){
            return res.status(400).json({error: "Necessário um título/anotação!"})
        }else{
            const annotationCreated = await Annotations.create({
                title,
                notes,
                priority
            })
    
            return res.json(annotationCreated)
        }
    },

    async deleteNote(req, res){
        const noteID = req.params.noteID

        const annotationDeleted = await Annotations.findOneAndDelete({
            _id : noteID
        })

        return annotationDeleted? res.json(annotationDeleted) : res.status(401).json({ error: "Não foi encontrado o registro para deletar!s"})
    }
}