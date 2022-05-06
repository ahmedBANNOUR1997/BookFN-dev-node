
const mongoose = require('mongoose');

var bookschema = new mongoose.Schema({
    title : {
        type : String,
        required: true
    },
    author : {
        type : String,
        required: true
    },
    price : {
        type : Number,
        required: false,
        default: 0
    },
    description : {
        type: String,
        required: true
    },
    coverImage : {
        type: String,
        required : true
    },
    category : {
        type: String,
        required: true  
    },
    nbPages : {
        type: Number,
        default: 0  
    },
    filePDF :{
        type: String,
        required : true
    },
    fileAudio :{
        type: String
    },
    like : [{
        type: mongoose.Schema.Types.ObjectId, ref:"users"
    }],
    nbVue :{
        type: Number,
        required: false,
        default: 0
    },
    userid:
    {
        type: String,
        required : true
    },
    isPodcast:
    {
        type: String,
        default: "0"
    }
    
   
}

,{
    timestamps: true
}

)




const Book = mongoose.model('books', bookschema);

module.exports = Book;
