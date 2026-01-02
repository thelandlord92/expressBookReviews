const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return typeof username === "string" && username.trim().length > 0;
  };

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    if (!isValid(username) || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }
  
    const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });
  
    req.session.authorization = {
      accessToken,
      username,
    };
  
    return res.status(200).json({ message: "Login successful" });
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
  
    if (!review || typeof review !== "string") {
      return res.status(400).json({ message: "Review query parameter is required" });
    }
  
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    const username = req.user && req.user.username;
    if (!username) {
      return res.status(403).json({ message: "User not authenticated" });
    }
  
    if (!book.reviews) {
      book.reviews = {};
    }
  
    // Add new or modify existing review for this user
    book.reviews[username] = review;
  
    return res.status(200).json({
      message: "Review added/updated successfully",
      reviews: book.reviews,
    });
  });

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
  
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    const username = req.user && req.user.username;
    if (!username) {
      return res.status(403).json({ message: "User not authenticated" });
    }
  
    if (!book.reviews || !book.reviews[username]) {
      return res.status(404).json({ message: "No review found for this user" });
    }
  
    delete book.reviews[username];
  
    return res.status(200).json({
      message: "Review deleted successfully",
      reviews: book.reviews,
    });
  });
  
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
