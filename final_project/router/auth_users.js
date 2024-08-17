const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username: "user1", password: "password1"}];

const isValid = (username) => {
  // 检查用户名是否存在于用户记录中
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  // 检查用户名和密码是否匹配
  if (isValid(username)) {
    user=users.find(user => user.username === username);
    return user.password === password;
  }
  return false;
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;
  if (username && password) {
    if (authenticatedUser(username, password)) {
      let token = jwt.sign({username: username}, "your_secret_key", {expiresIn: 60 * 60});
      req.session.token = {token,username}; // Store the token in the session
      return res.status(200).json({accessToken: token});
    } else {
      return res.status(200).json({message: "Invalid username or password"});
    }
  } else {
    return res.status(400).json({message: "Invalid request"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review = req.query.review; // 使用 req.query 来获取查询参数
  let user = req.session.token?.username; // 确保用户名存在
  if (isbn && review) {
    if (books[isbn]) {
      if (!books[isbn].reviews) {
        // 如果 reviews 属性不存在，则初始化为一个空对象
        books[isbn].reviews = {};
      }

      // 更新或添加书评
      books[isbn].reviews[user] = review;

      return res.status(200).json({ message: "Review added/updated successfully" });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } else {
    return res.status(400).json({ message: "Invalid request" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let user = req.session.token?.username; // 确保用户名存在

  if (isbn && user) {
    if (books[isbn]) {
      if (books[isbn].reviews && books[isbn].reviews[user]) {
        // 如果 reviews 属性存在，并且用户的书评存在，则删除用户的书评
        delete books[isbn].reviews[user];
        return res.status(200).json({ message: "Review deleted successfully" });
      } else {
        // 如果用户的书评不存在
        return res.status(404).json({ message: "Review not found" });
      }
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } else {
    return res.status(400).json({ message: "Invalid request" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
