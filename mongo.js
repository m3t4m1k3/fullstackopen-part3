require('dotenv').config();
const mongoose = require('mongoose');

// eslint-disable-next-line no-undef
if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  );
  // eslint-disable-next-line no-undef
  process.exit(1);
}

// eslint-disable-next-line no-undef
const name = process.argv[3];
// eslint-disable-next-line no-undef
const number = process.argv[4];
// eslint-disable-next-line no-undef
const password = process.argv[2];

const database = 'phonebookApp';

const url = `mongodb+srv://fullstackopen2022:${password}@cluster0.0lsbdjb.mongodb.net/${database}?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);
// eslint-disable-next-line no-undef
if (process.argv.length === 5) {
  mongoose
    .connect(url)
    .then(() => {
      console.log('connected');
      const person = new Person({ name, number, });

      return person.save();
    })
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`);
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
} else {
  mongoose
    .connect(url)
    .then(() => {
      console.log('connected');

      Person.find({}).then((persons) => {
        persons.forEach((person) => {
          console.log(`${person.name} ${person.number}`);
        });
      });
      mongoose.connection.close();
    })
    .catch((err) => console.log(err));
}
