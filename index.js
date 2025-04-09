require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// ROUTE 1

app.get('/', async (req, res) => {
    const booksUrl = 'https://api.hubspot.com/crm/v3/objects/books?properties=name,price,publisher';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        const resp = await axios.get(booksUrl, { headers });
        const data = resp.data.results; // Lijst van Books
        //console.log('Raw API:', data); //log to check the output
        res.render('books', { title: 'My Personal Library | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching books');    
    }
});

// ROUTE 2 - create or update a book record

app.get('/form', (req, res) => {
    res.render('book-form', { 
        title: 'Add a Book | HubSpot APIs', 
        action: '/form', 
        method: 'POST',
        book: {} // empty object for a new book
    });
});

app.get('/edit/:id', async (req, res) => {
    const bookId = req.params.id;
    const bookUrl = `https://api.hubspot.com/crm/v3/objects/books/${bookId}?properties=name,price,publisher`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        const resp = await axios.get(bookUrl, { headers });
        const book = resp.data;
        res.render('book-form', { 
            title: 'Edit Book | HubSpot APIs', 
            action: `/edit/${bookId}`, 
            method: 'POST',
            book: book.properties //fill form with current properties
        });
    } catch (error) {
        console.error('Error retrieving book:', error.response ? error.response.data : error.message);
        res.status(500).send('Error loading book');
    }
});


// ROUTE 3 - create new book or update existing in HS
app.post('/form', async (req, res) => {
    const newBook = {
        properties: {
            book_name: req.body.name,
            name: req.body.name,
            price: req.body.price,
            publisher: req.body.publisher
        }
    };
    const createBookUrl = 'https://api.hubspot.com/crm/v3/objects/books';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        await axios.post(createBookUrl, newBook, { headers });
        res.redirect('/');
    } catch (error) {
        console.error('API error when creating:', error.response ? error.response.data : error.message);
        res.status(500).send('Error creating book: ' + (error.response ? error.response.data.message : error.message));
    }
});

app.post('/edit/:id', async (req, res) => {
    const bookId = req.params.id;
    const updatedBook = {
        properties: {
            book_name: req.body.name,
            name: req.body.name,
            price: req.body.price,
            publisher: req.body.publisher
        }
    };
    const updateBookUrl = `https://api.hubspot.com/crm/v3/objects/books/${bookId}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        await axios.patch(updateBookUrl, updatedBook, { headers });
        res.redirect('/');
    } catch (error) {
        console.error('API error when updating:', error.response ? error.response.data : error.message);
        res.status(500).send('Error updating book: ' + (error.response ? error.response.data.message : error.message));
    }
});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));