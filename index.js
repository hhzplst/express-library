//server side JS

var express = require("express");
    app = express();
    morgan = require("morgan");
    bodyParser = require("body-parser");
    methodOverride = require("method-override");
    //partial = require("express-partial");
    Book = require("./public/app.js");

app.set("view engine", "ejs");
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public/"));
//app.use(partial());

var books = [{
    id: 0,
    title: "The Unbearable Lightness of Being", 
    author: "Milan Kundera",
    year: 1984,
    url: "http://www.prepwise.com/wp-content/uploads/Unbearable-Lightness.jpg"
  }], k=1, currentID;
  
app.get("/", function(req, res){ 
  res.render("index");
});

app.get("/new", function(req, res){
  res.render("new");
});

app.get("/edit/:id", function(req, res){
  currentID = req.params.id;
  res.render("read", {id: currentID});
});


app.get("/database", function(req, res){
  var id;
  if(req.query.id !== undefined){
    res.json("read", books[Number(req.query.id)]);    
  }else if(req.query.title !== undefined){
    books.forEach(function(el){
      if(el.title === req.query.title){
        id = el.id;
      }
    }); 
    res.json("index", books[id]);
  }else if(req.query.author !== undefined){
    books.forEach(function(el){
      if(el.author === req.query.author){
        id = el.id;
      }
    });                                          
    res.json("index", books[id]);
  }                                 
});

app.put("/edit/:id", function(req, res){
  books[currentID].title = req.body.title;
  books[currentID].author = req.body.author;
  books[currentID].year = req.body.year;
  books[currentID].url = req.body.pic;
  res.redirect("/");
});

app.delete("/edit/:id", function(req, res){
  books.splice(currentID, 1);
  res.redirect("/");
});

app.post("/submit", function(req, res){
  var book = new Book(k, req.body.title, req.body.author, req.body.year, req.body.url);
  books.push(book);
  k++;
  res.render("index");
});

app.get('*', function(req, res){
  res.send("Sorry, there is no such page", 404);
});

app.listen(3000, function(){
  console.log("Server Starting at Port 3000:");
});