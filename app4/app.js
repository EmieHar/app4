const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const User = require ("./model/User");
const router = require("./router/router")
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Message = require('./model/Message');



const port = 8000
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

mongoose.connect('mongodb://127.0.0.1:27017/projet', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));




app.set('view engine', 'ejs');


io.on('connection', (socket) => {
  console.log("Connection s");

  socket.on('new message', (obj) => {
    
      io.sockets.emit('reponse', obj );
  })

  socket.on('enregistre message', (obj) => {
      let newMessage = new Message({
                    iduser: obj.id,
                    message: obj.message,
                    firstname: obj.firstname,
                    lastname: obj.lastname,
                    date: Date.now()
      })
      console.log(newMessage);

      newMessage.save().then(() => {}).catch(err => console.log(err));


  })
});










http.listen(port, () => console.log(`Server running on port ${port}`));