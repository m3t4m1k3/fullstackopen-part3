const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const Person = require('./models/person');
const { update } = require('./models/person');

morgan.token('body', function (req, _res) {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

// Middleware
app.use(express.json());

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.use(cors());

app.use(express.static('build'));

app.get('/', (_req, res) => {
  res.send('<h1>Phonebook Backend</h1>');
});

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

app.get('/api/persons', (_req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

// Create
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;

  if (!name) {
    return res.status(400).json({
      error: 'name is missing',
    });
  }

  if (!number) {
    return res.status(400).json({
      error: 'number is missing',
    });
  }

  new Person({ name, number })
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

// Update
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;
  const { id } = request.params;
  const person = { name, number };

  Person.findByIdAndUpdate(id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// Delete
app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then((deletedPerson) => {
      if (deletedPerson) {
        res.status(204).end();
      } else {
        res.status(404).send({ error: 'id not found in database' });
      }
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, _request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
