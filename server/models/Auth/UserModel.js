const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    email: {
        type : String,
        required: true,
        unique: true,
        lowercase : true,
    },
    password: {
        type : String,
        required : true,
    },
    role: {
        type : String,
        required : true
    },
    userData: {
        type : String
    }
});

userSchema.pre('save', async function (next){
    const createdSalt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, createdSalt);
    next();
})

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;