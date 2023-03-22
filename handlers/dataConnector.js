require('dotenv').config()

const mongoose = require('mongoose')

connect = () => {
    const db = mongoose.connection

    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.DB_NAME
    })

    db.on('error', (error) => console.error(error))
    db.once('open', () => console.log('Connected to Double J Movies Database'))
}

module.exports = {
    connect
}