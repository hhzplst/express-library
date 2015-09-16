//server side JS

var express = require("express"),
    app = express(),
    morgan = require("morgan"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override");
    db = require("./models");

app.set("view engine", "ejs");
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public/"));

var currentID;
  
app.get("/", function(req, res){
  res.redirect("/books");
});

app.get("/books", function(req, res){ 
  res.render("index");
});

app.get("/books/new", function(req, res){
  res.render("new");
});

app.post("/submit", function(req, res){
  db.Book.create({
    title: req.body.title,
    author: req.body.author,
    year: req.body.year,
    url: req.body.url
  }, function(){
    res.render("index");
  });
});

app.get("/books/edit/:id", function(req, res){
  currentID = req.params.id;
  res.render("read", {id: currentID});
});


app.get("/database", function(req, res){
  if(req.query.id !== undefined){
    db.Book.findById(req.query.id, function(err, book){
      res.json("read", book);
    });
  }else if(req.query.title !== undefined){
    db.Book.find({title: req.query.title}, function(err, book){
      res.json("index", book[0]);
    });
  }else if(req.query.author !== undefined){
    db.Book.find({author: req.query.author}, function(err, book){
      res.json("index", book[0]);
    });                                         
  }                                 
});

app.put("/books/edit/:id", function(req, res){
  db.Book.findByIdAndUpdate(req.params.id, {
    $set: {
      title: req.body.title,
      author: req.body.author,
      year: req.body.year,
      url: req.body.pic
    }
  }, function(err, book){
    res.redirect("/books");    
  });
});

app.delete("/books/edit/:id", function(req, res){
  db.Book.findByIdAndRemove(req.params.id, function(){
    res.redirect("/books");    
  });
});

app.get('*', function(req, res){
  res.send("Sorry, there is no such page", 404);
});

app.listen(3000, function(){
  console.log("Server Starting at Port 3000:");
});