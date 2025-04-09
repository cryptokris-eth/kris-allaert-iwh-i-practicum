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

// ROUTE 2 - form to create

app.get('/form', (req, res) => {
    res.render('book-form', { title: 'Add a Book | HubSpot APIs' });
});

// ROUTE 3 - Create the book and redirect to homepage

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
        console.error(error);
        res.status(500).send('Error creating book');
    }
});

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/




// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));