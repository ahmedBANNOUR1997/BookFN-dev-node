var Userdb = require('../model/model');
var emailSender = require('../Outils/emailApi');
const bcrypt = require('bcrypt');
var jwtUtils  = require('../Outils/jwt.utils');
const fs = require("fs");

 
    exports.create = async (req,res)=>{
    
        if(!req.body){
            res.status(400).send({ message : "Content can not be emtpy!"});
            return;
        }
        const hash = bcrypt.hashSync(req.body.pwd,10)
      const randCode = randomCode(10000,99999) 

        const user = new Userdb({
            firstName : req.body.firstName.toLowerCase(),
            lastName : req.body.lastName.toLowerCase(),
            email : req.body.email.toLowerCase(),
            pwd : hash,
            emailCode : randCode
        })

        user.save(user)
            .then(data => {
               res.send({message  : randCode.toString()})
               var mailOptions = {
                from: 'ahmed.bannour@esprit.tn',
                to: req.body.email,
                subject: 'Verification de votre email',
                text: 'le code de verification :'+randCode
              };
              

              emailSender.transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
         });

            })
            .catch(err =>{
                res.status(500).send({
                    message : err.message || "Some error occurred while creating a create operation"
                });
            });
      
        }

        exports.createWithgoogle = async (req,res)=>{
    
            if(!req.body){
                res.status(400).send({ message : "Content can not be emtpy!"});
                return;
            }
          
    
            const user = new Userdb({
                firstName : randomUsername().toLocaleLowerCase(),
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                email : req.body.email.toLowerCase(),
                img : req.body.img
            
            })
    
    
    
           
             
            
            user.save(user)
                .then(data => {
                  res.send({message : data.email})
                  console.log({message : data.email})
                })
                .catch(err =>{
                    res.status(500).send({
                        message : err.message || "Some error occurred while creating a create operation"
                    });
                });
          
            }
            
            exports.editProfilePicture = async (req, res, next) => {


                let user = await Userdb.findOneAndUpdate(
                  { email: req.body.email.replace(/["]+/g, '') },
                  {
                    $set: {
                      img: req.file.filename,
                    },
                  }
                );
              
                if(user != null)
                {
                  if(user.img)
                  {
                    fs.unlink("uploads/users/"+user.img,function(err) {
                      if(err && err.code == 'ENOENT') {
                          // file doens't exist
                          console.info("File doesn't exist, won't remove it.");
                      } else if (err) {
                          // other errors, e.g. maybe we don't have enough permission
                          console.error("Error occurred while trying to remove file");
                      } else {
                          console.info(`removed`);
                      }
                    });
                  }
              
                  res.send({message:"success", user: user, img: req.file.filename });
              
                }else
                {
                  res.status(204).send({message:"echec"});
              
                }
                
              
              };

            exports.delete = async (req, res) => {

                const user = await User.findById(req.params.user_id)
                if(user.profilePicture)
                {
                  fs.unlink("uploads/images/"+user.profilePicture,function(err) {
                    if(err && err.code == 'ENOENT') {
                        // file doens't exist
                        console.info("File doesn't exist, won't remove it.");
                    } else if (err) {
                        // other errors, e.g. maybe we don't have enough permission
                        console.error("Error occurred while trying to remove file");
                    } else {
                        console.info(`removed`);
                    }
                  });
                }
                user = await user.remove();
              
                res.send({ user });
              };
              
            exports.showListBooks = async (req, res, next) => {
                let userid= req.body.userid
                var listBooks = []
                await Userdb.findById(userid).populate('favBook')
                .then(response => {
                        var i = 0
                        response.favBook.forEach(function(currentValue, index, arr){
            
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
            
            exports.showLastReadBook = async (req, res, next) => {
                let userid= req.body.userid
                
                await Userdb.findById(userid).populate('favBook')
                .then(response => {
                        
                    var lastBook = response.favBook[response.favBook.length-1]
                    ;
                        if(lastBook.length == 0)
                        {
                            res.send({
                                message: "nandata"
                              })
                        }
                        else
                        {
                            res.send({
                                lastBook
                              })
                        }
                })
                .catch(error => {  
                    res.json({
                        message: 'an error Occured!'
                    })
                })
            } 

            exports.showPlayLists = async (req, res, next) => {
                let userid= req.body.userid
                var listBooks = []
                await Userdb.findById(userid)
                .then(response => {
                        var i = 0
                        response.favPlaylist.forEach(function(currentValue, index, arr){
            
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

exports.findQuery = (req, res)=>{

    if(req.query.id){
        const id = req.query.id;
          
        Userdb.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found user with id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving user with id " + id})
            })

    }else{
        Userdb.find()
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    }

    
}

exports.find =  async (req, res)=>{

    if(req.body.token){
        var userId  = jwtUtils.getUserId(req.body.token);
          
        Userdb.findById(userId)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found user with id "})
                }else{
                    res.send({ message : "Not found user with id "})
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving user with id " })
            })

    }

    
}


exports.update = async (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

   
    Userdb.updateOne({ _id: req.body.id }, { 
        firstName: req.body.firstName ,
        lastName : req.body.lastName,
        email: req.body.email,
        tel: req.body.tel 
        })
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
            }else{
                res.send({ message : "uploaded" })
            }
        })
        .catch(err =>{
            res.status(500).send({ message : err.message})
        })
}


exports.verifMail = async (req, res)=>{
    const email = req.body.email;
    Userdb.updateOne({ email: email }, { emailEtat: 'valide' })
    .then(data => {
        if(!data){
            res.status(404).send({ message : "Cannot Update user"})
        }else{
            res.send({message : "verified"})
        }
    })
    .catch(err =>{
        res.status(500).send({ message : "Error Update user information"})
    })
}

// Show Likes List From a Single Playlist
exports.showAbone = async(req, res, next) => {
    let userId = req.body.userid
    await Userdb.findById(userId)
  
    .then(user => {
        var i = 0
        user.abonne.forEach(function(currentValue, index, arr){
            i++
        });
    
        res.send({
            message: i.toString()
          })
    
   
      
    })
}
    exports.showAbonnement = async(req, res, next) => {
        let userId = req.body.userid
        await Userdb.findById(userId)
      
        .then(user => {
            var i = 0
            user.abonnenement.forEach(function(currentValue, index, arr){
                i++
            });
        
            res.send({
                message: i.toString()
              })
        
       
          
        })
    }
exports.findUsers = async (req, res)=>{
    var search = req.body.txt;
    if(search.length == 0)
    {
        search = "765dsfsq86s5f432se5643q12z7987456eq3s1d56e48zeez86er4645!"
    }
    var usersSrch = []
    Userdb
  .find()
    .then(response => {
            var i = 0
            response.forEach(function(currentValue, index, arr){
                if(currentValue.firstName.includes(search) ||  currentValue.lastName.includes(search) )
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

exports.showAbonne = async(req, res, next) => {
    let useridact = req.body.useridact
    let userId = req.body.userid
    var usersSrch = []
    let isabon = false
    await Userdb.findById(useridact)
    .then(user => {
        var i = 0
        user.abonne.forEach(function(currentValue, index, arr){
            if(currentValue == userId )
            { 
                
                isabon = true
                return
           }
        });
    
    if(isabon)
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


exports.addabonne = (req, res, next) => {
    let useridact = req.body.useridact

    let updatedData = {
        abonne : req.body.userid
    }
    let updatedDatat = {
        abonnenement  : useridact
    }

    Userdb.findByIdAndUpdate(useridact, {$push: updatedData})
    .then(() => {
        Userdb.findByIdAndUpdate(req.body.userid, {$push: updatedDatat})  
        .then(() => {
        res.json({
            message: 'added'
        })
    }).catch(error => {
        res.json({
            message: error.message
        })
    })
    })
    .catch(error => {
        res.json({
            message: 'an error Occured !'
        })
    })
}


exports.deleteabon = (req, res, next) => {
    let useridact = req.body.useridact

    let updatedData = {
        abonne : req.body.userid
    }
    let updatedDatat = {
        abonnenement : useridact
    }

    Userdb.findByIdAndUpdate(useridact, {$pull: updatedData})
    .then(() => {
        Userdb.findByIdAndUpdate(req.body.userid, {$pull: updatedDatat})
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
            message: 'an error Occured !'
        })
    })
}

exports.findHomeUsers = async (req, res)=>{
    var search = req.body.txt;
    var usersSrch = []
  await  Userdb
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

exports.emailForlogin = async (req, res)=>{
    const email = req.body.email;
    const randCode = randomCode(10000,99999) 
    var mailOptions = {
     from: 'ahmed.bannour@esprit.tn',
     to: email,
     subject: 'Verification de votre email',
     text: 'le code de verification :'+randCode
   };
   

   emailSender.transporter.sendMail(mailOptions, function(error, info){
     if (error) {
       console.log(error);
       } else {
         console.log('Email sent: ' + info.response);
       }
});
    
    Userdb.updateOne({ email: email }, {emailCode: randCode})
    .then(data => {
        if(!data){
            res.status(404).send({ message : "notExist"})
        }else{
            res.send({message : randCode.toString()})
        }
    })
    .catch(err =>{
        res.status(500).send({ message : "notExist"})
    })
}



    


exports.login = async (req, res)=>{ 
    const email = req.body.email
    const pwd = req.body.pwd 
    await Userdb.findOne({ email: email }) 
    .then(data => {
         if(!data)
         { 
             res.status(404).send({ message : "usernotexist"}) }
         else if(data.emailEtat == "valide")
         {
              bcrypt.compare(pwd, data.pwd)
              .then(pwdEx => {
                  if(!pwdEx)
                  {
                    res.status(404).send({ message : "pwdinvalide"})
                  }
                  else
                  {
                      const token = jwtUtils.generateTokenForUser(data)
                      Userdb.updateOne({ email: email }, { token: token })
                      .then(tok => {
                        if(!tok){
                            res.status(404).send({ message : "Cannot Update user"})
                        }else{
                            res.send({message : data })
                        }
                    })
                    .catch(err =>{
                        res.status(500).send({ message : "Error Update user information"})
                    })
                    
                  }
              }

              )
         }
         else
         {
            res.send({message : "emailnotvalide"}) 
            
         }
             }) 
                   .catch(err =>{ res.status(500).send({ message : "Error user information"})
                 })
}

exports.verifforpwd = async (req, res)=>{ 
    const email = req.body.email
    
    const randCode = randomCode(10000,99999) 
   
    await Userdb.findOne({ email: email }) 
    .then(data => {
         if(!data)
         { 
             res.status(404).send({ message : "notExist"}) }
         else
         {
            var mailOptions = {
                from: 'ahmed.bannour@esprit.tn',
                to: email,
                subject: 'Verification de votre email pour changer le mot de passe',
                text: 'le code de verification :'+randCode
              };
              
           
              emailSender.transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
           });
                      Userdb.updateOne({ email: email }, {emailCode: randCode})
                      .then(tok => {
                        if(!tok){
                            res.status(404).send({ message : "notExist"})
                        }else{
                            res.send({message : randCode.toString() })
                        }
                    })
                    .catch(err =>{
                        res.status(500).send({ message : "notExist"})
                    })
                     
         }
        
             }) 
                   .catch(err =>{ res.status(500).send({ message : "notExist"})
                 })
}

exports.logingoogle = async (req, res)=>{ 
    const email = req.body.email
    await Userdb.findOne({ email: email }) 
    .then(data => {
         if(!data)
         { 
             res.status(404).send({ message : "usernotexist"}) }
         else
         {
            
                      const token = jwtUtils.generateTokenForUser(data)
                      Userdb.updateOne({ email: email }, { token: token })
                      .then(tok => {
                        if(!tok){
                            res.status(404).send({ message : "Cannot Update user"})
                        }else{
                            res.send({message : token})
                        }
                    })
                    .catch(err =>{
                        res.status(500).send({ message : "Error Update user information"})
                    })
            
         }
    
             }) 
                   .catch(err =>{ res.status(500).send({ message : "Error user information"})
                 })
}

exports.getUser = async (req, res)=>{ 

    var auth  = req.body.token;
    Userdb.findOne({token: auth}).populate('favBook')
    .then(data => {
        if(!data)
        { 
            res.status(404).send({ message : "EGU0"}) } // token invalid
        else
        {
           
            var userId  = jwtUtils.getUserId(auth);
   
            Userdb.findById(userId) 
            .then(dataid => {
                 if(!dataid)
                 { 
                     res.status(404).send({ message : "NUser"}) }
                 else
                 {
                    
                    res.status(200).send({dataid}) 
        
                      
                 }
               
                     }).catch(err =>{ res.status(500).send({ message :"EXPT"}) }) // expire token
                    
                }
      
            }) 
                  .catch(err =>{ res.status(500).send({ message :"ERFU"}) // user not found
                })
   
}

exports.getUserbyId = async (req, res)=>{ 

    var id  = req.body.id;
    
           await Userdb.findById(id).populate('favBook') 
            .then(dataid => {
                 if(!dataid)
                 { 
                     res.status(404).send({ message : "NUser"}) }
                 else
                 {
                    
                    res.status(200).send({dataid}) 
        
                      
                 }
               
                     }).catch(err =>{ res.status(500).send({ message :"EXPT"}) }) // expire token
                    
}
  
exports.getUserid = async (req, res)=>{ 

    var auth  = req.body.email;
    Userdb.findOne({email: auth}).populate('favBook')
    .then(data => {
        if(!data)
        { 
            res.status(404).send({ message : "EGU0"}) } // token invalid
        else
        {
            res.status(200).send({data}) 
                    
                }
      
            }) 
                  .catch(err =>{ res.status(500).send({ message :"ERFU"}) // user not found
                })
   
}

    function randomCode (minimum,maximum)
    {
        const generateRandomNumber = (min, max) =>  {
            return Math.floor(Math.random() * (max - min) + min);
              };

            return generateRandomNumber(minimum ,maximum);
    }
    function randomUsername ()
    {
        var user = "User"
            return user + randomCode(100, 999) + makeid(1) + randomCode(1000, 9999);
    }
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
    
    