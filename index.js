const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();
const Person = require("./models/person");
const { response } = require("express");
const app = express();

morgan.token("body", function (req, res) {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static("build"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/", (req, res) => {
  res.send("<h1>Phonebook Backend</h1>");
});

app.get("/info", (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `);
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  console.log(body);

  if (!body.name) {
    return res.status(400).json({
      message: "name is missing",
    });
  }

  if (
    persons
      .map((person) => person.name.toLowerCase())
      .includes(body.name.toLowerCase())
  ) {
    return res.status(400).json({
      message: "name must be unique",
    });
  }

  if (!body.number) {
    return res.status(400).json({
      message: "number is missing",
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

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const deleteIndex = persons.map((person) => person.id).indexOf(id);

  if (deleteIndex !== -1) {
    persons.splice(deleteIndex, 1);
    res.send({ message: `Person id ${id} removed.` });
  } else {
    res.status(404).json({ message: `Person id ${id} not found on server.` });
  }
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
