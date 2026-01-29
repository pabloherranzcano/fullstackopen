const Country = ({ country, showDetails, setShowDetails, weather }) => {
  {
    if (showDetails[0] === country.name.common && showDetails[1] === true) {
      return (
        <>
          <h1>{country.name.common}</h1>
          <p>Capital: {country.capital}</p>
          <p>Area: {country.area}</p>
          <h2>Languages:</h2>
          <ul>
            {Object.values(country.languages).map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <br />
          <img
            src={country.flags.png}
            alt={`Flag of ${country.name.common}`}
            width="150"
          />
          <br />
          {weather && weather.temperature !== undefined ? (
            <>
              <h2>Weather in {country.capital?.[0] ?? country.name.common}</h2>
              <p>Temperature {weather.temperature} °C</p>
              {weather.icon && <img src={weather.icon} alt="Weather icon" />}
              <p>Wind {weather.wind} m/s</p>
            </>
          ) : null}
        </>
      );
    } else {
      return (
        <>
          <li>
            {country.name.common}{' '}
            <button onClick={() => setShowDetails([country.name.common, true])}>
              Show details
            </button>
          </li>
        </>
      );
    }
  }
};

export default Country;
