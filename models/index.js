var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/library");
mongoose.set("debug", true);

module.exports.Book = require("./book");