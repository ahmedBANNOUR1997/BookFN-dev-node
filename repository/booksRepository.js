var Book = require('../model/Book');
var Userdb = require('../model/model');

  //show the list of Books
  exports.index = (req, res, next) => {
    Book.find().populate('like')
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

exports.findBookUser = async (req, res)=>{
    var search = req.body.txt;
    var usersSrch = []
    Book
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

// Show single Book
exports.show = (req, res, next) => {
    let BookId = req.body.bookid
    Book.findById(BookId)
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

exports.findBooks = async (req, res)=>{
    var search = req.body.txt;
    if(search.length == 0)
    {
        search = "765dsfsq86s5f432se5643q12z7987456eq3s1d56e48zeez86er4645!"
    }
    var usersSrch = []
    Book
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


//add new Book
exports.store = async(req, res) => {

    const book = new Book({
        title : req.body.title,
        author : req.body.author, 
        price : req.body.price,
        description : req.body.description,
        coverImage : req.files.coverImage[0].filename,
        category:  req.body.category,
        nbPages:  req.body.nbPages,
        filePDF:  req.files.filePDF[0].filename,
        fileAudio:  req.files.fileAudio[0].filename,
        userid: req.body.userid
    })
    await book.save()
        .then(data => {
            res.send({message : "added"})
        })
        .catch(error => {
            res.status(500).send({
                message : error.message || "Some error occurred while creating a create operation"
            });
        })
            
    }

//update Book
exports.update = (req, res, next) => {
    let BookId = req.body.bookid

    let updatedData = {
            title : req.body.title,
            author : req.body.author,
            price : req.body.price,
            description : req.body.description,
            coverImage : req.files.coverImage[0].filename,
            category : req.body.category,
            nbPages : req.body.nbPages,
            filePDF:  req.files.filePDF[0].filename,
            fileAudio:  req.files.fileAudio[0].filename,
    }

    Book.findByIdAndUpdate(BookId, {$set: updatedData})
    .then(() => {
        res.json({
            message: 'Book Updated Successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'an error Occured !'
        })
    })
}

//delete Book
exports.destroy = (req, res, next) => {
    let BookId = req.body.bookid
    Book.findByIdAndRemove(BookId)
    .then(() => {
        res.json({
            message: 'deleted'
        })
    })
    .catch(error => {
        res.json({
            message: 'an error Occured !'
        })
    })
}

exports.deleteallLikes = async(req, res, next) => {
    let bookid = req.body.bookid
    
    await Book.findById(bookid)
    .then(book => {
        var i = 0
        book.like.forEach(function(currentValue, index, arr){

            let updatedData = {
                favBook : bookid
            }
            Userdb.findByIdAndUpdate(currentValue, {$pull: updatedData})
            .then(() => {
                console.log("deletedLikes")
        }).catch(error => {  
            console.log(error.message)
        })
       
    })
    Book.findByIdAndRemove(bookid)
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


// Show Likes List From a Single Playlist
exports.showLike = async(req, res, next) => {
    let bookid = req.body.bookid
    let userid = req.body.userid
    var usersSrch = []
    let isliked = false
    await Book.findById(bookid)
    .then(user => {
        var i = 0
        user.like.forEach(function(currentValue, index, arr){
            if(currentValue == userid )
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
    let bookid = req.body.bookid

    let updatedData = {
        userid : req.body.userid
    }
    let updatedDatat = {
        favBook : bookid
    }
     Book.findByIdAndUpdate(bookid, {$push: updatedData})
    .then(() => {
        Userdb.findByIdAndUpdate(req.body.userid, {$push: updatedDatat})
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
            message: 'an error Occured !'
        })
    })
}


// Delete Like From Playlist

exports.deleteLikes = (req, res, next) => {
    let BookId = req.body.bookid
  
    let updatedData = {
        like : req.body.userid
    }
    let updatedDatat = {
        favBook : BookId
    }

    Book.findByIdAndUpdate(BookId , {$pull: updatedData})
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





exports.findHomeBook = async (req, res)=>{
    var search = req.body.txt;
    var usersSrch = []
  await  Book
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

exports.findPodcasts = async (req, res)=>{
    var search = req.body.txt;
    var usersSrch = []
  await  Book
  .find()
    .then(response => {
            var i = 0
            response.forEach(function(currentValue, index, arr){
                    if(currentValue.isPodcast == "1")
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

// Views Increment Action  
exports.upviews = (req, res, next) => {
    let BookId = req.body.bookid


    Book.findByIdAndUpdate(BookId, {$inc: {nbVue : 1}})
    
    .then(() => {
        res.json({
            message: 'Book Updated Successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'an error Occured !'
        })
    })
}

    

