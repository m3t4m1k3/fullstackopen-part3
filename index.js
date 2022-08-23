const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const Person = require('./models/person');

morgan.token('body', function (req) {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

// Middleware
app.use(express.json());

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.use(cors());

app.use(express.static('build'));

// Root
app.get('/', (_req, res) => {
  res.send('<h1>Phonebook Backend</h1>');
});

// Info
app.get('/info', (_req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
      `);
    })
    .catch((error) => next(error));
});

// Create
app.post('/api/persons', (req, res, next) => {
  const { name, number, } = req.body;

  new Person({ name, number, })
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

// Read All
app.get('/api/persons', (_req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => next(error));
});

// Read One
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).send({ error: 'id not found in database', });
      }
    })
    .catch((error) => next(error));
});

// Update
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number, } = request.body;
  const { id, } = request.params;
  const person = { name, number, };

  Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// Delete
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((deletedPerson) => {
      if (deletedPerson) {
        res.status(204).end();
      } else {
        res.status(404).send({ error: 'id not found in database', });
      }
    })
    .catch((error) => next(error));
});

// Middlware to handle unknown endpoint requests
const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: 'unknown endpoint', });
};

app.use(unknownEndpoint);

// Middleware for error handling
const errorHandler = (error, _request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id', });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message, });
  }

  next(error);
};

app.use(errorHandler);

// Run Express app

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
