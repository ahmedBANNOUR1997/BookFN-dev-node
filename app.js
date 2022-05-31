
const express = require('express');
//const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');

const connectDB = require('./db/connectionMdb');
const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');


const app = express();

//dotenv.config( { path : 'config.env'} )
const PORT = process.env.PORT || 3000

// log requests
app.use(morgan('tiny'));


// Upload File
app.use('/uploads', express.static('uploads'));
// mongodb connection
connectDB();

// parse request to body-parser
app.use(bodyparser.json({ etype: 'application/json'}))
app.use(bodyparser.urlencoded({ extended : true}))


// load routers
app.use('/', require('./routes/index'))
app.use('/api', require('./routes/users'))
app.use('/api', require('./routes/booksroute'))
app.use('/api', require('./routes/playlistroute'))
app.use("/api/messagerie", require("./routes/messagerie-route"))

//app.listen(3000, '0.0.0.0');

app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});

// SWAGGER 
app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );


