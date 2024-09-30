import React, { useEffect, useState } from "react";
import "./App.css";
import CurrentCond from "./Components/CurrentCondition/CurrentCond";
import getIPGeolocation from "./currentlocation";

import Autocomplete from "react-google-autocomplete";

import "./Styles/CurrCondstyles.css";

function App() {
  const [location, setLocation] = useState(null);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [error, setError] = useState(null);
  //

  useEffect(() => {
    getIPGeolocation()
      .then((loc) => {
        setLocation(loc.city);
        setLat(loc.lat);
        setLon(loc.lon);
      })
      .catch((err) => {
        setError("Error in App for Inital Location");
      });

    // Refreshes the page every 5 minutes
    const interval = setInterval(() => {
      window.location.reload();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    setLocation(location);
    console.log(location);
  };

  if (error) return <p>Error in App.js for loading: {error}</p>;
  if (!location) return <p> Working to get the location</p>;

  return (
    <div className="App">
      <form
        className="search"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <Autocomplete
          style={{ width: "250px" }}
          id="autocomplete"
          apiKey={"AIzaSyCw9RDk7SEeuxTxzo6p-UBTYLPvevEta-g"}
          onPlaceSelected={(place) => {
            setLocation(place.address_components[0].long_name);
          }}
        />
      </form>
      <CurrentCond location={location} lat={lat} lon={lon} />
    </div>
  );
}

export default App;
