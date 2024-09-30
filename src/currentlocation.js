// IPGeolocation.js
import axios from "axios";

const api_key = "at_g24eNkz86QDyV0qBRWEywQjrdkULS";
const api_url = "https://geo.ipify.org/api/v2/country,city";

const url = `${api_url}?apiKey=${api_key}`;

const getIPGeolocation = () => {
  return axios
    .get(url)
    .then((response) => {
      return {
        // ip: response.data.query,
        city: response.data.location.city,
        // region: response.data.regionName,
        // country: response.data.country,
        lat: response.data.location.lat,
        lon: response.data.location.lon,
        // timezone: response.data.timezone,
        // isp: response.data.isp
      };
    })
    .catch((err) => {
      console.error("Could not fetch location data", err);
      throw err;
    });
};

export default getIPGeolocation;
