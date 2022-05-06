const express = require('express');
const routePL = express.Router()

const upload = require('../middleware/storageplaylist');
const controller = require('../repository/playlistRepository');
const path = require('path')
const sharp = require("sharp");
const fs = require("fs");

//API
routePL.get('/allPlaylists',controller.index)
/*routePL.post('/upimgplaylist',upload.fields([{name: 'image'}]),async(req,res)=>{
  const img = req.files.image[0].filename
  res.send({message : img})
  })*/
  routePL.post('/upimgplaylist', upload.single('image'),async (req, res) => {
       const { filename: image } = req.file;
       const img = Date.now() +'-'+ makeid(5) + "image.jpg";
    
       await sharp(req.file.path)
        .resize(500, 500)
        .jpeg({ quality: 90 })
        .toFile(
           path.resolve(req.file.destination,img)
        )
        fs.unlinkSync(req.file.path)
       res.send({message : img})
    })
routePL.post('/addplaylist',controller.create)
routePL.post('/showplaylist',controller.show)
routePL.post('/updatePlaylist',controller.update)
routePL.post('/deletePlaylist',controller.deleteallLikes)
routePL.post('/showplaylistuser',controller.findPlaylistUser)
routePL.post('/homePlaylist',controller.findHomePlaylists)
routePL.post('/showplaylistfav',controller.showSingle)
routePL.post('/playlist/srch',controller.findPlaylists)
//// Likes in Playlist
routePL.post('/likePlaylist', controller.showLike)
routePL.post('/addbooksplaylist', controller.addBooks)
routePL.post('/deleteLikesPlaylist', controller.deleteLikes)
routePL.post('/addLikesPlaylist', controller.addLikes)
//// Views
routePL.post('/viewsPlaylist', controller.upviews)

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
module.exports = routePL
