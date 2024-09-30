import React from 'react';

const Map = ({lat, lon}) => {

  const mapUrl = `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=default&metricWind=default&zoom=5&overlay=wind&product=ecmwf&level=surface&lat=${lat}&lon=${lon}`;

  return (
    <div className="App">
      <iframe 
        title="Windy Map"
        width="650" 
        height="450" 
        src={mapUrl} 
        frameBorder="0"
      ></iframe>
    </div>
  );
}

export default Map;
