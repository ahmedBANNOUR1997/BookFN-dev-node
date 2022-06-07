var nodemailer = require('nodemailer');

exports.transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bookfn1337@gmail.com',
    pass: 'aesmbhacwhhiqhue'
  }
});




