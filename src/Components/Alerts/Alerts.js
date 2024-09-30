import { useState, useEffect } from "react";
import axios from "axios";

// const API_KEY = "kYvp89KtCmsecgD2fcFaZoEiZ3ajTGGi";
const API_KEY = "ALB3pcB6ae82uEQubJ4svYMiURaVykII"; // out of calls
//const API_KEY = "qFXw9fIsTbwjSrMl3Gyu8Qbs2lGD4T7r";
const BUFFER = 5;

const Alerts = ({ lat, lon }) => {
  // const [alertContents, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    try {
      const options = {
        method: "GET",
        url: "https://api.tomorrow.io/v4/events",
        params: {
          location: `${lat},${lon}`,
          insights: [
            "air",
            "fires",
            "tornado",
            "wind",
            "temperature",
            "floods",
            "thunderstorms",
            "tropical",
            "marine",
            "fog",
            "winter",
          ],
          buffer: BUFFER,
          apikey: API_KEY,
        },
        headers: {
          accept: "application/json",
          "Accept-Encoding": "gzip",
          "content-type": "application/json",
        },
      };
      axios
        .request(options)
        .then(function (response) {
          const alertInformation = response.data.data.events[0];
          console.log(lat, lon);
          console.log(alertInformation);
          // setAlerts(alertInformation);
          // Handling the case if there are no alerts
          if (alertInformation === undefined) {
            console.log("No alerts found");
            return;
          }
          setLoading(false);

          if (Notification.permission === "granted") {
            new Notification(
              `Weather Alert: ${alertInformation.eventValues.title}`,
              {
                body: `Headline: ${alertInformation.eventValues.headline} -Severity: ${alertInformation.severity} - Certainty: ${alertInformation.certainty}`,
              }
            );
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [lat, lon]);

  if (loading) return <p></p>;
  if (error) return <p> Error: {error}</p>;

  return null;
};
export default Alerts;
