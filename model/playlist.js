const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    userid : {
        type : String,
        required: true
    },
   
    title : {
        type: String,
        required : true
    },
    image : {
        type: String,
        required: true
    },
    like :[{
        type: mongoose.Schema.Types.ObjectId, ref:"users"
    }],
    bookid : [{
        type: mongoose.Schema.Types.ObjectId, ref:"books"
    }]
    
   
}

,{
    timestamps: true
}

)

const Playlist = mongoose.model('playlists', schema);

module.exports = Playlist;