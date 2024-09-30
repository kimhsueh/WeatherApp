import axios from 'axios';
import React, { useEffect, useState } from 'react';

const API_KEY = 'o18gwd0RtxBP7Wu0UUhxwtORYW53mY0c'; // Your API Key
const LOCATION = "New York";

const LatLong = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
   // const [lon, setLon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://api.tomorrow.io/v4/weather/realtime?location=${LOCATION}&apikey=${API_KEY}`);
                console.log('Response:', response); // Check the entire response for debugging


                const currentLocation = response.data.location;
                setCurrentLocation (currentLocation);
                setLoading(false);


            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const { lat, lon, name,  } = currentLocation;

return (
    <div>
        <p>{name}</p>
        <p>{lat}</p>
        <p>Longitude: {lon}</p>
    </div>
);
};

export default LatLong;
