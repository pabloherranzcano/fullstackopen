const Persons = ({ filteredPersons }) => {
  return filteredPersons.map((person) => (
    <>
      <li key={person.id}>
        {person.name} {person.number}
      </li>
    </>
  ));
};

export default Persons;
