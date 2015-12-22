var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

// Conexion BD
mongoose.connect('mongodb://localhost:27017/montex');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  
});

var todoSchema = mongoose.Schema({
  text: String
});
var Todo = mongoose.model('todos', todoSchema);

// Listar
router.get('/todos',function(req, res){
  Todo.find(function(err, todos){
    if(err) res.send(err);
     res.json(todos);
  });
});

// Agregar
router.post('/todos', function(req, res){
  Todo.create({
    text:req.body.text,
    done:false
  },function(err, todo){
    if(err) res.send(err);
    Todo.find(function(err,todos){
      if(err) res.send(err);
      res.json(todos);  
    });
  });
});

// Eliminar
router.delete('/todos/:todo',function(req, res){
  Todo.remove({
    _id:req.params.todo
  },function(err, todo){
    if(err) res.send(err);
    Todo.find(function(err, todos){
      if(err) res.send(err);
      res.json(todos);
    });
  });
});



// var messages = [{  
//     author: "Carlos",
//     text: "Hola! que tal?"
// },{
//     author: "Pepe",
//     text: "Muy bien! y tu??"
// },{
//     author: "Paco",
//     text: "Genial!"
// }];

module.exports = router;

// module.exports = function (io) {
//   io.on('connection', function(socket) {  
//     console.log('Un cliente se ha conectadooooo');
//     socket.emit('messages', messages);
//   });
//   return router;
// };