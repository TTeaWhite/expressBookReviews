const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // 检查请求头中是否包含授权信息
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // 提取令牌
        // 验证 JWT 令牌
        jwt.verify(token, 'your_secret_key', (err, user) => {
            if (err) {
                return res.status(403).json({ message: "用户未认证" });
            }
            req.user = user; // 将用户信息存储在请求对象中
            next(); // 继续执行下一个中间件或路由处理程序
        });
    } else {
        return res.status(403).json({ message: "用户未登录" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
