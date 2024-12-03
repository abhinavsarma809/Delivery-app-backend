const mongoose=require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true

    },
    password:{
        type:String,
        require:true

    },
    country:{
        type:String,
        require:true

    },
    gender:{
        type:String,
        require:true

    }









});

module.exports = mongoose.model('User',userSchema);