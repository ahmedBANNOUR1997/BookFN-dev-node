var Playlist = require('../model/playlist');
var Userdb = require('../model/model');

  //show the list of Playlists
  exports.index = (req, res, next) => {
    Playlist.find().populate('bookid')
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'an error Occured!'
        })
    })
}
exports.deleteallLikes = async(req, res, next) => {
    let playlistid = req.body.playlistid
    
    await Playlist.findById(playlistid)
    .then(playlist => {
        var i = 0
        playlist.like.forEach(function(currentValue, index, arr){

            let updatedData = {
                favPlaylist : playlistid
            }
            Userdb.findByIdAndUpdate(currentValue, {$pull: updatedData})
            .then(() => {
                console.log("deletedLikes")
        }).catch(error => {  
            console.log(error.message)
        })
       
    })
    Playlist.findByIdAndRemove(playlistid)
    .then(() => {
        res.json({
            message: 'deleted'
        })
    })
    
}).catch(error => {
    res.json({
        message: 'an error Occured !'
    })
})}

// Show single Playlist
exports.show = async (req, res, next) => {
    let PlaylistId = req.body.playlistid
    var listBooks = []
    await Playlist.findById(PlaylistId)
    //.populate("bookid")
    .then(response => {
            var i = 0
            response.bookid.forEach(function(currentValue, index, arr){

                listBooks[i] = currentValue
                i++
            });
            if(listBooks.length == 0)
            {
                res.send({
                    message: "nandata"
                  })
            }
            else
            {
                res.send({
                    listBooks
                  })
            }
    })
    .catch(error => {  
        res.json({
            message: 'an error Occured!'
        })
    })
} 

exports.showSingle = async (req, res, next) => {
    let playlistid = req.body.playlistid
    await Playlist.findById(playlistid)
    //.populate('like','name')
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'an error Occured!'
        })
    })
} 

exports.findPlaylists = async (req, res)=>{
    var search = req.body.txt;
    if(search.length == 0)
    {
        search = "765dsfsq86s5f432se5643q12z7987456eq3s1d56e48zeez86er4645!"
    }
    var usersSrch = []
    await Playlist
  .find()
    .then(response => {
            var i = 0
            response.forEach(function(currentValue, index, arr){
                if(currentValue.title.includes(search))
                { 
                    
                    usersSrch[i] = currentValue
                    i++
                }
            });
            if(usersSrch.length == 0)
            {
                res.send({
                    message: "nandata"
                  })
            }
            else
            {
                res.send({
                    usersSrch
                  })
            }
    })
    .catch(error => {
        res.json({
            message: 'an error Occured!'
        })
    })
   

}

exports.findHomePlaylists = async (req, res)=>{
    var search = req.body.txt;
   /* if(search.length == 0)
    {
        search = "765dsfsq86s5f432se5643q12z7987456eq3s1d56e48zeez86er4645!"
    }*/
    var usersSrch = []
  await  Playlist
  .find()
    .then(response => {
            var i = 0
            response.forEach(function(currentValue, index, arr){
                    
                    usersSrch[i] = currentValue
                    i++
                
            });
            if(usersSrch.length == 0)
            {
                res.send({
                    message: "nandata"
                  })
            }
            else
            {
                res.send({
                    usersSrch
                  })
            }
    })
    .catch(error => {
        res.json({
            message: 'an error Occured!'
        })
    })
   

}

exports.findPlaylistUser = async (req, res)=>{
    var search = req.body.txt;
    var usersSrch = []
    Playlist
  .find()
    .then(response => {
            var i = 0
            response.forEach(function(currentValue, index, arr){
                if(currentValue.userid == search )
                { 
                    
                    usersSrch[i] = currentValue
                    i++
                }
            });
            if(usersSrch.length == 0)
            {
                res.send({
                    message: "nandata"
                  })
            }
            else
            {
                res.send({
                    usersSrch
                  })
            }
    })
    .catch(error => {
        res.json({
            message: 'an error Occured!'
        })
    })
   

}

//add new Playlist
exports.create = async(req, res) => {
    const playlists = new Playlist({
        userid : req.body.iduser,
        title : req.body.titlep,
        image : req.body.imagep
       
    })
   await playlists.save()
        .then(response => {
            res.json({
                message: 'Playlist is Added Successfully'
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
            
    }

//update Playlist
exports.update = (req, res, next) => {
    let PlaylistId = req.body.PlaylistId

    let updatedData = {
       title : req.body.title,
        image :req.body.image,
        description : req.body.description,
    }

    Playlist.findByIdAndUpdate(PlaylistId, {$set: updatedData})
    .then(() => {
        res.json({
            message: 'Playlist Updated Successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'an error Occured !'
        })
    })
}

//delete Playlist
exports.destroy = (req, res, next) => {
    let PlaylistId = req.body.PlaylistId
    Playlist.findByIdAndRemove(PlaylistId)
    .then(() => {
        res.json({
            message: 'Playlist deleted successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'an error Occured !'
        })
    })
}


// Update Book in Playlist

exports.addBooks = (req, res, next) => {
    let PlaylistId = req.body.playlistid

    let updatedData = {
        bookid : req.body.bookid
    }

    Playlist.findByIdAndUpdate(PlaylistId, {$push: updatedData})
    .then(() => {
        res.json({
            message: 'Playlist Updated Successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'an error Occured !'
        })
    })
}

// Show Likes List From a Single Playlist
exports.showLike = async(req, res, next) => {
    let playlistid = req.body.bookid
    let userId = req.body.userid
    var usersSrch = []
    let isliked = false
    await Playlist.findById(playlistid)
    .then(user => {
        var i = 0
        user.like.forEach(function(currentValue, index, arr){
            if(currentValue == userId )
            { 
                
                isliked = true
                return
           }
        });
    
    if(isliked)
    {
        res.send({
            message: "true"
          })
    }
    else
    {
        res.send({
            message: "false"
          })
    }
    })
    .catch(error => {  
        res.json({
            message: 'an error Occured!'
        })
    })
} 


// Update Likes in Books

exports.addLikes = (req, res, next) => {
    let playlistid = req.body.bookid

    let updatedData = {
        like : req.body.userid
    }
    let updatedDatap = {
        favPlaylist : playlistid
    }

    Playlist.findByIdAndUpdate(playlistid, {$push: updatedData})
    .then(() => {
        Userdb.findByIdAndUpdate(req.body.userid, {$push: updatedDatap})
        .then(() => {
        res.json({
            message: 'likeadded'
        })
    }).catch(error => {
        res.json({
            message: error.message
        })
    })
})
    .catch(error => {
        res.json({
            message: error.message
        })
    })
}


// Delete Like From Playlist

exports.deleteLikes = (req, res, next) => {
    let playlistid = req.body.bookid
  
    let updatedData = {
        like : req.body.userid
    }
    let updatedDatap = {
        favPlaylist : playlistid
    }
    Playlist.findByIdAndUpdate(playlistid , {$pull: updatedData})
    .then(() => {
        Userdb.findByIdAndUpdate(req.body.userid, {$pull: updatedDatap})
        .then(() => {
        res.json({
            message: 'removed'
        })
    }).catch(error => {
        res.json({
            message: error.message
        })
    })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
}



// Views Increment Action  
exports.upviews = (req, res, next) => {
    let PlaylistId = req.body.PlaylistId


    Playlist.findByIdAndUpdate(PlaylistId, {$inc: {nbVue : 1}})
    
    .then(() => {
        res.json({
            message: 'Playlist Updated Successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'an error Occured !'
        })
    })
}


    

    
    