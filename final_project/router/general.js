const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const booksdb = require("./booksdb");

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      // Assuming inValid function checks if username already exists
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    // Asynchronously retrieve books
    const books = await booksdb.getBooksAsync();
    // Send the books object as a response
    res.send(JSON.stringify(books, null, 4));
  } catch (error) {
    // Handle any potential errors
    res.status(500).send("Error retrieving books: " + error.message);
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const bookDetails = await getBookDetailsByISBN(isbn);
    if (bookDetails) {
      res.send(bookDetails);
    } else {
      res.status(404).send("Book not found");
    }
  } catch (error) {
    handleInternalServerError(res, error);
  }
});

// Function to get book details by ISBN
async function getBookDetailsByISBN(isbn) {
  return new Promise((resolve, reject) => {
    // Simulated asynchronous operation to fetch book details by ISBN
    setTimeout(() => {
      // Assuming books is available somewhere
      // Replace this with your actual book retrieval logic
      const bookDetails = books[isbn];
      if (bookDetails) {
        resolve(bookDetails);
      } else {
        reject(new Error("Book not found"));
      }
    }, 1000); // Simulated delay of 1 second
  });
}

// Get book details based on author
// Retrieve books by author
public_users.get("/author/:author", async function (req, res) {
  try {
    const author = req.params.author;
    const authorBooks = await getBooksByAuthor(author);
    if (authorBooks.length > 0) {
      res.json(authorBooks);
    } else {
      res.status(404).send("No books found by this author");
    }
  } catch (error) {
    res.status(500).send("Error retrieving books by author: " + error.message);
  }
});

// Function to get books by author
async function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    // Simulated asynchronous operation to fetch books by author
    setTimeout(() => {
      // Assuming books is available somewhere
      // Replace this with your actual book retrieval logic
      const bookKeys = Object.keys(books);
      const authorBooks = bookKeys.reduce((acc, key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          acc.push(books[key]);
        }
        return acc;
      }, []);
      resolve(authorBooks);
    }, 1000); // Simulated delay of 1 second
  });
}

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  try {
    const title = req.params.title;
    const titleBooks = await getBooksByTitle(title);
    if (titleBooks.length > 0) {
      res.json(titleBooks);
    } else {
      res.status(404).send("No books found with this title");
    }
  } catch (error) {
    handleInternalServerError(res, error);
  }
});

// Function to get books by title
async function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    // Simulated asynchronous operation to fetch books by title
    setTimeout(() => {
      // Assuming books is available somewhere
      // Replace this with your actual book retrieval logic
      const bookKeys = Object.keys(books);
      const titleBooks = bookKeys.reduce((acc, key) => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
          acc.push(books[key]);
        }
        return acc;
      }, []);
      resolve(titleBooks);
    }, 1000); // Simulated delay of 1 second
  });
}

// Get book review
public_users.get("/review/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      if (book.reviews && book.reviews.length > 0) {
        res.json(book.reviews);
      } else {
        res.status(404).send("No reviews found for this book");
      }
    } else {
      res.status(404).send("Book not found");
    }
  } catch (error) {
    handleInternalServerError(res, error);
  }
});

// Centralized function to handle internal server errors
function handleInternalServerError(res, error) {
  res.status(500).send("Internal Server Error: " + error.message);
}

module.exports.general = public_users;
