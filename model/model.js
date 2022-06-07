const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    firstName : {
        type : String,
        required: true
    },
    lastName :{
        type: String, 
        required: true
    },
    email :{
        type: String,
        required: true
    },
    pwd :{
        type: String,
        required: false
        
    },
    emailCode :{
        type: String,
        required: false,
        default: "nan" 
        
    },
    emailEtat :{
        type: String,
        required: false,
        default: "valide" 
        
    },
    token :{
        type: String, 
        default: "nan"   
    },
    img :{
        type: String, 
        default: "default.png"   
    },
    tel :{
        type: String, 
        default: ""  
         
    },
    abonne :[{
        type: mongoose.Schema.Types.ObjectId, ref:"users"
    }],
    abonnenement :[{
        type: mongoose.Schema.Types.ObjectId, ref:"users"
    }],
    isAdmin:{
        type: Boolean, 
        default: false   
    },
    favBook :[{
        type: mongoose.Schema.Types.ObjectId, ref:"books"
    }],
    favPlaylist :[{
        type: mongoose.Schema.Types.ObjectId, ref:"playlists"
    }],


   
} 
,{
    timestamps: true
}
)

const Userdb = mongoose.model('users', schema);

module.exports = Userdb;