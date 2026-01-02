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
public_users.get("/", (req, res) => {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const { isbn } = req.params;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json({ [isbn]: books[isbn] });
});
  
// Get book details based on author
public_users.get("/author/:author", (req, res) => {
    const { author } = req.params;
  
    const matched = Object.keys(books)
      .filter((isbn) => books[isbn].author.toLowerCase() === author.toLowerCase())
      .reduce((result, isbn) => {
        result[isbn] = books[isbn];
        return result;
      }, {});
  
    if (Object.keys(matched).length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }
  
    return res.status(200).json(matched);
  });

// Get all books based on title
public_users.get("/title/:title", (req, res) => {
    const { title } = req.params;
  
    const matched = Object.keys(books)
      .filter((isbn) => books[isbn].title.toLowerCase() === title.toLowerCase())
      .reduce((result, isbn) => {
        result[isbn] = books[isbn];
        return result;
      }, {});
  
    if (Object.keys(matched).length === 0) {
      return res.status(404).json({ message: "No books found for this title" });
    }
  
    return res.status(200).json(matched);
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
