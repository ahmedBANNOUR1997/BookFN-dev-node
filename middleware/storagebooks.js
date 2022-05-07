const multer = require("multer")
const path = require('path')



const storage = multer.diskStorage({


   destination : function(request,file,callback){

        
        callback(null,'./uploads/books');

    },



    filename : function(request,file,callback){

           callback(null,Date.now() +'-'+ makeid(5) + file.originalname);


  }
  
    })






const upload = multer({

storage : storage,

})

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


module.exports = upload,makeid;