import Country from './components/Country';
import { useState } from 'react';
import { useEffect } from 'react';
import countriesService from './services/countries';
import weatherService from './services/weather';
import Search from './components/Search';
import Error from './components/Error';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [showDetails, setShowDetails] = useState(['', false]);
  const [weather, setWeather] = useState({});

  useEffect(() => {
    countriesService.getAll().then((response) => {
      setCountries(response);
    });
  }, []);

  useEffect(() => {
    if (!showDetails[1]) return;
    const country = filteredCountries.find(
      (c) => c.name.common === showDetails[0],
    );
    const capital = country?.capital?.[0];
    if (!capital) return;

    weatherService
      .getCountryWeather(capital)
      .then((data) => setWeather(data))
      .catch((err) => {
        console.error('Failed to fetch weather', err);
        setWeather({});
      });
  }, [showDetails, filteredCountries]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchName(value);
    console.log(value);

    const filteredResults = countries.filter((country) =>
      country.name.common.toLowerCase().includes(value.toLowerCase()),
    );

    if (value === '') {
      setErrorMessage(null);
      setFilteredCountries([]);
      return;
    }

    if (filteredResults.length === 1) {
      setErrorMessage(null);
      setFilteredCountries(filteredResults);
      setShowDetails([filteredResults[0].name.common, true]);
    } else if (filteredResults.length > 10) {
      setErrorMessage('Too many matches, specify another filter');
      setFilteredCountries([]);
      setShowDetails(false);
    } else {
      setErrorMessage(null);
      setFilteredCountries(filteredResults);
      setShowDetails(false);
    }
  };

  return (
    <>
      <Search searchName={searchName} onChange={handleSearchChange} />
      <Error message={errorMessage} />

      <ul>
        {filteredCountries.map((country) => (
          <Country
            key={country.name.common}
            country={country}
            showDetails={showDetails}
            setShowDetails={setShowDetails}
            weather={weather}
          />
        ))}
      </ul>
    </>
  );
};

export default App;
