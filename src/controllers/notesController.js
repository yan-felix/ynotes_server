const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function generateNoteID(userID){
  return `${userID}_${Math.floor((Math.random() * 9) * 1000000000)}`;
};

module.exports = {
  async myNotes(req, res) {
    const userID = req.headers['user-id'];
    const token = req.headers['token'];

    if(!userID || !token) return res.status(401).json({ auth: false, index: 9, type: 'auth_failed', message: 'Error de autenticação, userID e/ou token em falta. Tente se autenticar novamente: logout --> login.' });

    try {
      const notes = await prisma.notes.findMany({
        where: { userID: userID },
      });

      return res.json(notes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro interno ao acessar as notas.' });
    } finally {
      await prisma.$disconnect();
    };
  },

  async createNote(req, res){
    const userID = req.headers['user-id'];
    const token = req.headers['token'];
    const {title, content} = req.body;
    const newNoteID = generateNoteID(userID);

    if(!userID || !token) return res.status(401).json({ auth: false, index: 9, type: 'auth_failed', message: 'Error de autenticação, userID e/ou token em falta. Tente se autenticar novamente: logout --> login.' });

    try{
      await prisma.notes.create({
        data: {
          id: newNoteID,
          userID: userID,
          title: title,
          content: content,
          priority: false
        }
      });

      return res.send(201)
    }catch(error){
      console.log(error)
    }finally{
      await prisma.$disconnect();
    };
  },

  async toggleNotePriority(req, res) {
    const userID = req.headers['user-id'];
    const token = req.headers['token'];
    const noteID = req.body.noteID;

    if (!userID || !token) return res.status(401).json({ auth: false, index: 9, type: 'auth_failed', message: 'Error de autenticação, userID e/ou token em falta. Tente se autenticar novamente: logout --> login.' });

    try {
      const note = await prisma.notes.findUnique({
        where: { id: noteID },
      });

      await prisma.notes.update({
        where: { id: note.id },
        data:{ priority: !note.priority }
      });

      return res.send(200);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro interno ao acessar a nota.' });
    } finally {
      await prisma.$disconnect();
    };
  },

  async deleteNote(req, res){
    const userID = req.headers['user-id'];
    const token = req.headers['token'];
    const noteID = req.params.noteID;

    if (!userID || !token) return res.status(401).json({ auth: false, index: 9, type: 'auth_failed', message: 'Error de autenticação, userID e/ou token em falta. Tente se autenticar novamente: logout --> login.' });


    try{
      await prisma.notes.delete({
        where:{
          userID: userID,
          id: noteID
        }
      });

      return res.send(200)
    }catch(error){
      console.log(error)
    }finally{
      await prisma.$disconnect()
    };
  }
};
