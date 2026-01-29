import { useState } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import PersonsService from './services/personService';
import { useEffect } from 'react';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterName, setFilterName] = useState('');
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [isErrorNotification, setNotificationType] = useState(false);

  const getPersons = () => {
    PersonsService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  };

  useEffect(getPersons, []);

  const filteredPersons =
    filterName === ''
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filterName.toLowerCase()),
        );

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };
    const existingPerson = persons.find(
      (person) =>
        person.name.toLocaleLowerCase() ===
        personObject.name.toLocaleLowerCase(),
    );

    if (existingPerson) {
      window.confirm(`Update ${existingPerson.name}'s number?`) &&
        PersonsService.update(existingPerson.id, personObject)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : response,
              ),
            );
            setNotificationType(false);
            setNotificationMessage(`'${personObject.name}' updated`);
            setTimeout(() => {
              setNotificationMessage(null);
            }, 5000);
          })
          .catch((error) => {
            console.log(error);
            setNotificationType(true);
            setNotificationMessage(
              `There has been a problem trying to update '${personObject.name}' number`,
            );
            setTimeout(() => {
              setNotificationMessage(null);
            }, 5000);
          });
      setNewName('');
      setNewNumber('');
      return;
    }

    PersonsService.create(personObject)
      .then((response) => {
        setPersons(persons.concat(response));
        setNotificationType(false);
        setNotificationMessage(`'${personObject.name}' added`);
        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
      })
      .catch((error) => {
        console.log(error);
        setNotificationType(true);
        setNotificationMessage(
          `There has been a problem trying to add '${personObject.name}'`,
        );
        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
      });
    setNewName('');
    setNewNumber('');
  };

  const deletePerson = (id) => {
    window.confirm('Are you sure you want to delete this person?') &&
      PersonsService.deletePerson(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setNotificationType(false);
          setNotificationMessage(
            `${persons.find((p) => p.id === id)?.name} deleted`,
          );
          setTimeout(() => {
            setNotificationMessage(null);
          }, 5000);
        })
        .catch((error) => {
          console.log(error);
          setNotificationType(true);
          setNotificationMessage(
            `There has been a problem trying to delete ${persons.find((p) => p.id === id)?.name}`,
          );
          setTimeout(() => {
            setNotificationMessage(null);
          }, 5000);
        });
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification
        message={notificationMessage}
        isErrorNotification={isErrorNotification}
      />

      <Filter filterName={filterName} onChange={handleFilterName} />

      <h2>Add a new</h2>

      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
      ></PersonForm>

      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} handleDelete={deletePerson} />
    </div>
  );
};

export default App;
