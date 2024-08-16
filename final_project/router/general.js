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
public_users.get('/', function (req, res) {
  // 返回所有书籍的信息
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // 获取请求参数中的 ISBN
  const book = books[isbn]; // 根据 ISBN 查找书籍

  if (book) {
    return res.status(200).json(book); // 如果找到书籍，返回书籍信息
  } else {
    return res.status(404).json({ message: "book not found" }); // 如果未找到书籍，返回 404 状态码和错误信息
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author; // 获取请求参数中的作者名
  const booksByAuthor = Object.values(books).filter(book => book.author === author); // 根据作者名过滤书籍

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor); // 如果找到书籍，返回书籍信息
  } else {
    return res.status(404).json({ message: "book not found" }); // 如果未找到书籍，返回 404 状态码和错误信息
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title; // 获取请求参数中的书名
  const booksByTitle = Object.values(books).filter(book => book.title === title); // 根据书名过滤书籍

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle); // 如果找到书籍，返回书籍信息
  } else {
    return res.status(404).json({ message: "book not found" }); // 如果未找到书籍，返回 404 状态码和错误信息
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "book not found" });
  }
});

module.exports.general = public_users;
