const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check missing fields
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    // Check if user already exists
    if (users[username]) {
        return res.status(409).json({
            message: "User already exists!"
        });
    }

    // Register user
    users[username] = {
        password: password
    };

    return res.status(201).json({
        message: "User successfully registered. Now you can login"
    });

});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get("http://localhost:5001/");
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get(`http://localhost:5001/isbn/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details" });
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        const response = await axios.get(`http://localhost:5001/author/${author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    axios.get(`http://localhost:5001/title/${title}`)
        .then(response => {
            return res.status(200).json(response.data);
        })
        .catch(error => {
            return res.status(500).json({ message: "Error fetching books by title" });
        });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json({
            reviews: books[isbn].reviews
        });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }


});

module.exports.general = public_users;
