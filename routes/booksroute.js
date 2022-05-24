
const express = require('express');
const routet = express.Router()

const controller = require('../repository/booksRepository');
const upload = require('../middleware/storagebooks');
const path = require('path')
const sharp = require("sharp");
const fs = require("fs");
//API
/**
 * @swagger
 * tags:
 *  name: Books
 *  description: Books
 *  /api/allBooks:
 *  get:
 *    tags: [allBooks]
 *    parameters:
 *    responses:
 *      default:
 *        description: This is the default response
 *  */
routet.get('/allBooks',controller.index)
routet.get('/allBooksWithViews',controller.findViewsBooks)
routet.post('/upPDF',upload.fields([{name:'filePDF'}]),async(req,res)=>{
        const files = req.files.file[0].filename
        res.send({message : files})
    })

    routet.post('/upimgbook', upload.single('coverImage'),async (req, res) => {
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
       
});
            
routet.post('/showbooksuser',controller.findBookUser)

routet.post('/addbook',upload.fields([{
  name: 'coverImage', maxCount: 1
}, {
  name: 'filePDF', maxCount: 1
}]),controller.store)

routet.post('/showbook',controller.show)

routet.post('/updateBook',upload.fields([{
  name: 'coverImage', maxCount: 1
}, {
  name: 'filePDF', maxCount: 1
}]),controller.update)

routet.post('/deleteBook',controller.deleteallLikes)
routet.post('/homebooks',controller.findHomeBook)
routet.post('/books/srch',controller.findBooks)
routet.post('/findpodcast',controller.findPodcasts)

//// Likes in Books
routet.post('/likebook', controller.showLike)
routet.post('/addLikesBook', controller.addLikes)
routet.post('/deleteLikesBook', controller.deleteLikes)

//// Views
routet.post('/viewsBook', controller.upviews)

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
module.exports = routet
