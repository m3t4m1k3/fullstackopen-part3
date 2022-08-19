const { json } = require('express');
const express = require('express');

const app = express();
const port = 3001;

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>Phonebook Backend</h1>');
});

app.get('/info', (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `);
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  console.log(body);

  if (!body.name) {
    return res.status(400).json({
      message: 'name is missing.',
    });
  }

  if (!body.number) {
    return res.status(400).json({
      message: 'number is missing.',
    });
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000000),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);

  res.status(201).json(newPerson);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const deleteIndex = persons.map((person) => person.id).indexOf(id);

  if (deleteIndex !== -1) {
    persons.splice(deleteIndex, 1);
    res.send({ message: `Person id ${id} removed.` });
  } else {
    res.status(404).json({ message: `Person id ${id} not found on server.` });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
