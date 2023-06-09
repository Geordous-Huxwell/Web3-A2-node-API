const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

    id: Number,
    details: {
        firstname: String,
        lastname: String,
        city: String,
        country: String
    },
    picture: {
        large: String,
        thumbnail: String
    },
    membership: {
        date_joined: String,
        last_update: String,
        likes: Number
    },
    email: String,
    password_bcrypt: String,
    apikey: String
});

userSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password_bcrypt);
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = mongoose.model('User', userSchema, 'users');