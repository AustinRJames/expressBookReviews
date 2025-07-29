const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

    // Return true if nay user withthe same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;
  
    // Validate input
    if (!review || review.trim() === "") {
      return res.status(400).json({message: "Review content cannot be empty"});
    }
  
    // Validate ISBN format (if using integer ISBNs)
    const isbnNum = parseInt(isbn);
    if (isNaN(isbnNum) || isbnNum < 1 || isbnNum > 10) {
      return res.status(400).json({message: "Invalid ISBN"});
    }
  
    // Check if book exists
    if (!books[isbn]) {
      return res.status(404).json({message: "Book not found"});
    }
  
    // Initialize reviews object if it doesn't exist
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
  
    // Check if user already has a review for this book
    const existingReview = books[isbn].reviews[username];
    const action = existingReview ? "updated" : "added";
  
    // Add or update the review
    books[isbn].reviews[username] = review.trim();
  
    return res.status(200).json({
      message: `Review ${action} successfully`,
      book: books[isbn].title,
      author: books[isbn].author,
      username: username,
      review: review.trim()
    });
  });

  // Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
  
    // Check if book exists
    if (!books[isbn]) {
      return res.status(404).json({message: "Book not found"});
    }
  
    // Check if the book has any reviews
    if (!books[isbn].reviews || Object.keys(books[isbn].reviews).length === 0) {
      return res.status(404).json({message: "No reviews found for this book"});
    }
  
    // Check if the user has a review for this book
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({message: "No review found for this user"});
    }
  
    // Delete the user's review
    delete books[isbn].reviews[username];
  
    return res.status(200).json({
      message: "Review deleted successfully",
      book: books[isbn].title,
      username: username
    });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;