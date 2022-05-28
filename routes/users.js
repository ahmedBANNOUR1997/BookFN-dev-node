const express = require('express');
const route = express.Router()
const upload = require('../middleware/storageUsers');
const controller = require('../repository/userRepository');
const path = require('path')
const sharp = require("sharp");
const fs = require("fs");

// API
route.post('/users', controller.create);
route.post('/signupgoogle', controller.createWithgoogle);
route.delete("/one/:user_id", controller.delete)
route.patch('/verifmail', controller.verifMail);
route.post('/login', controller.login);
route.post('/logingoogle', controller.logingoogle);
route.post('/getuser', controller.getUser);
route.post('/getuserid', controller.getUserid);
route.post('/getuserbyid', controller.getUserbyId);
route.patch('/updateuser', controller.update);
route.post('/login/verif', controller.emailForlogin);
route.post('/pwd/verif', controller.verifforpwd);
route.post('/users/srch', controller.findUsers);
route.post('/usershome', controller.findHomeUsers);
route.post('/addabon', controller.addabonne);
route.post('/deleteabon', controller.deleteabon);
route.post('/isabon', controller.showAbonne);
route.post('/showabon', controller.showAbone);
route.post('/showabonnement', controller.showAbonnement);


route.post("/forgot-password", controller.forgotPassword)

route.post("/change-password", controller.changePassword)

route.post("/reset-password", controller.resetPass)

route.post("/get-by-token", controller.getUserByToken)

route.put("/edit-profile-picture", upload.single('img'), controller.editProfilePicture)
/*route.post('/upimg',upload.fields([{name: 'image'}]),async(req,res)=>{
    const img = req.files.image[0].filename
        
        res.send({message : img})
    })*/
     route.post('/upimg', upload.single('image'),async (req, res) => {
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
    route.post('/listRecentlyRead', controller.showListBooks);
    route.post('/lastRecentlyRead', controller.showLastReadBook);
    route.post('/playlistf', controller.showPlayLists );

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
module.exports = route
