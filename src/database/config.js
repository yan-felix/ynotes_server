const mongoose = require('mongoose')

mongoose.set('strictQuery', true)
//const dbConfig = "mongodb+srv://db_user:se_db_user_manugin@ynotescluster.aewclyc.mongodb.net/annotations?retryWrites=true&w=majority"
const URL_DB = 'mongodb+srv://db_user:se_db_user_manugin@ynotescluster.aewclyc.mongodb.net/annotations?retryWrites=true&w=majority&appName=yNotesCluster'
const connection = mongoose.connect(URL_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    sslValidate: true
})

module.exports = connection