const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = {};

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    return username in users;
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    return users[username]?.password === password;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here

    const username = req.body.username;
    const password = req.body.password;

    // check input
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    // check user exists + password correct
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    // generate JWT
    const token = jwt.sign(
        { username: username },
        "secret_key",   // lab usually uses this exact string
        { expiresIn: "1h" }
    );

    // store token in user record
    users[username].accessToken = token;

    return res.status(200).json({
        message: "Login successful",
        token: token
    });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username;

    // check book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // check review provided
    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    // add or update review
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
