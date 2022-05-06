// Imports
var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'lkmojio34çàçDSEflmsq856qd4444785s662wq+6sdqwqsddfsdf9qzako,IKJK';

// Exported functions
module.exports = {
  generateTokenForUser: function(userData) {
    return jwt.sign({
      userId: userData.id,
      isAdmin: userData.isAdmin
    },
    JWT_SIGN_SECRET/*,
    {
      expiresIn: '1h'
    }*/)
  },
  parseAuthorization: function(authorization) {
    return (authorization != null) ? authorization.replace('Bearer ', '') : null;
  },
  getUserId: function(token) {
    var userId = -1;
    if(token != null) {
      try {
        var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
        if(jwtToken != null)
          userId = jwtToken.userId;
      } catch(err) 
       { 

       }
    }
    return userId;
  }
}