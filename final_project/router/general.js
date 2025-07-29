const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// In general.js, fix the register route:
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }

    if (isValid(username)) {
        return res.status(409).json({message: "User already exists"});
    }

    // Add to the users array (not object)
    users.push({
        username: username,
        password: password
    });

    return res.status(201).json({message: "User successfully registered"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      // Create a Promise to get books
      const getBooksPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          if (books) {
            resolve(books);
          } else {
            reject(new Error("Books data not available"));
          }
        }, 100);
      });
  
      // Await the Promise
      const booksData = await getBooksPromise;
      res.send(JSON.stringify(booksData, null, 4));
      
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving books",
        error: error.message
      });
    }
  });

  try {
    // Create a Promise 
    const getISBNPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (num > 1 && num < 10) {
                resolve
            }
        }
    })
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
      let num = parseInt(req.params.isbn);
      
      if (num < 1 || num > 10) {
        // Send error message
        res.send("Select a correct isbn");
      } else {
        // Create a Promise to get the book
        const getBookPromise = new Promise((resolve, reject) => {
          setTimeout(() => {
            if (books[num]) {
              resolve(books[num]);
            } else {
              reject(new Error("Book not found"));
            }
          }, 100); // Simulate async operation
        });
  
        // Await the Promise
        const book = await getBookPromise;
        res.send("Book Searched: " + JSON.stringify(book, null, 4));
      }
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving book",
        error: error.message
      });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
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
    } catch (error) {
        console.error('Error fetching books by author:', error);
        res.status(500).json({message: "Internal server error"});
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
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
    } catch(error) {
        console.error('Error fetching author:', error);
        res.status(500).json({message: "Internal server error"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = parseInt(req.params.isbn);
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
