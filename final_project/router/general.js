const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let num = parseInt(req.params.isbn)
    if (num < 1 || num > 10) {
        // Send error message
        res.send("Select a correct isbn");
    } else {
        res.send("Book Searched: " + JSON.stringify(books[num], null, 4));
    }

 }); 
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorName = req.params.author;
    const result = {};
    
    // Iterate through books object
    Object.keys(books).forEach(isbn => {
      if (books[isbn].author.toLowerCase() === authorName.toLowerCase()) {
        result[isbn] = books[isbn];
      }
    });
    
    if (Object.keys(result).length === 0) {
      return res.status(404).json({message: "No books found for this author"});
    }
    
    res.json(result);
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const titleName = req.params.title;
    
    const result = {};

    // Iterate through books 
    Object.keys(books).forEach(isbn => {
        if (books[isbn].title.toLowerCase().replaceAll(" ", "") === titleName.toLocaleLowerCase()) {
            result[isbn] = books[isbn];
        }
    });

    if (Object.keys(result).length === 0) {
        return res.status(404).json({message: "No Books found by this title"});
    }

    res.json(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = parseInt(req.params.isbn);
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
