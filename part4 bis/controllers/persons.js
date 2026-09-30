const PersonsRouter = require('express').Router()
const Person = require('../models/person')

PersonsRouter.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then((count) => {
      response.send(
        `<p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>`,
      );
    })
    .catch((error) => next(error));
});

PersonsRouter.get('/', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

PersonsRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

PersonsRouter.post('/', (request, response, next) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: 'Name is required',
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'Number is required',
    });
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
    id: Math.random().toString(16).slice(2),
  });

  newPerson
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

PersonsRouter.put('/:id', (request, response, next) => {
  const { name, number } = request.body;

  if (!name) {
    return response.status(400).json({
      error: 'Name is required',
    });
  }

  if (!number) {
    return response.status(400).json({
      error: 'Number is required',
    });
  }

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    {
      returnDocument: 'after',
      runValidators: true,
      context: 'query',
    },
  )
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

PersonsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) => next(error));
});

PersonsRouter.get(
  '/.well-known/appspecific/com.chrome.devtools.json',
  (request, response) => {
    response.status(204).end();
  },
);

module.exports = PersonsRouter