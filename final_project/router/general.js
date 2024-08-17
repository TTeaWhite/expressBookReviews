const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  return new Promise((resolve, reject) => {
    if (username && password) {
      if (!isValid(username)) {
        users[username] = password;
        resolve(res.status(200).json({ message: "User registered successfully" }));
      } else {
        reject(res.status(409).json({ message: "User already exists" }));
      }
    } else {
      reject(res.status(400).json({ message: "Invalid request" }));
    }
  });
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  return new Promise((resolve, reject) => {
    resolve(res.status(200).json(books));
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn; // 获取请求参数中的 ISBN
  return new Promise((resolve, reject) => {
    const book = books[isbn]; // 根据 ISBN 查找书籍

    if (book) {
      resolve(res.status(200).json(book)); // 如果找到书籍，返回书籍信息
    } else {
      reject(res.status(404).json({ message: "book not found" })); // 如果未找到书籍，返回 404 状态码和错误信息
    }
  });
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author; // 获取请求参数中的作者名
  return new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter(book => book.author === author); // 根据作者名过滤书籍

    if (booksByAuthor.length > 0) {
      resolve(res.status(200).json(booksByAuthor)); // 如果找到书籍，返回书籍信息
    } else {
      reject(res.status(404).json({ message: "book not found" })); // 如果未找到书籍，返回 404 状态码和错误信息
    }
  });
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title; // 获取请求参数中的书名
  return new Promise((resolve, reject) => {
    const booksByTitle = Object.values(books).filter(book => book.title === title); // 根据书名过滤书籍

    if (booksByTitle.length > 0) {
      resolve(res.status(200).json(booksByTitle)); // 如果找到书籍，返回书籍信息
    } else {
      reject(res.status(404).json({ message: "book not found" })); // 如果未找到书籍，返回 404 状态码和错误信息
    }
  });
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(res.status(200).json(book.reviews));
    } else {
      reject(res.status(404).json({ message: "book not found" }));
    }
  });
});

module.exports.general = public_users;
