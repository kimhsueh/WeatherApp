import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../Styles/CurrCondstyles.css";

const API_KEY = "o18gwd0RtxBP7Wu0UUhxwtORYW53mY0c";
const BUFFER = 5;

function CustomAlerts({ currentTemperature, location, lat, lon }) {
  const [alerts, setAlerts] = useState([
    {
      operator: "greater",
      temperature: "",
      alertMessage: "",
      id: 1,
      isEditing: true,
    },
  ]);

  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (location) {
      alerts.forEach((alert, index) => {
        if (!alert.isEditing) {
          handleCheckTemperature(index);
        }
      });
    }
  }, [location, currentTemperature]);

  const handleCheckTemperature = (index) => {
    const userTemperature = parseFloat(alerts[index].temperature);

    if (isNaN(userTemperature)) {
      console.log("Please enter a valid temperature.");
      return;
    }

    let conditionMet = false;
    let conditionText = "";
    switch (alerts[index].operator) {
      case "greater":
        conditionMet = currentTemperature > userTemperature;
        conditionText = "greater than";
        break;
      case "less":
        conditionMet = currentTemperature < userTemperature;
        conditionText = "less than";
        break;
      case "equal":
        conditionMet = currentTemperature === userTemperature;
        conditionText = "equal to";
        break;
      default:
        break;
    }

    if (conditionMet) {
      sendNotification(alerts[index].alertMessage, conditionText);
    } else {
      console.log("Condition not met.");
    }

    const updatedAlerts = alerts.map((alert, i) =>
      i === index ? { ...alert, isEditing: false } : alert
    );
    setAlerts(updatedAlerts);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedAlerts = [...alerts];
    updatedAlerts[index][name] = value;
    setAlerts(updatedAlerts);
  };

  const deleteAlert = (index) => {
    const updatedAlerts = [...alerts];
    updatedAlerts.splice(index, 1);
    setAlerts(updatedAlerts);
  };

  const addAlert = () => {
    const newAlert = {
      operator: "greater",
      temperature: "",
      alertMessage: "",
      id: alerts.length + 1,
      isEditing: true,
    };
    setAlerts([...alerts, newAlert]);
  };

  const sendNotification = (message, conditionText) => {
    try {
      const options = {
        method: "GET",
        url: "https://api.tomorrow.io/v4/events",
        params: {
          location: `${lat},${lon}`, //Using lat long for accuracy but pushing the location name through
          insights: [
            "air",
            "fires",
            "tornado",
            "wind",
            "temperature",
            "floods",
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
          if (alertInformation === null) {
            console.log("No alerts found");
            return;
          }

          if (Notification.permission === "granted") {
            new Notification(`Weather Alert`, {
              body: `${message}`,
            });
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Notification Settings</h3>
      {alerts.map((alert, index) => (
        <form
          key={index}
          onSubmit={(event) => {
            event.preventDefault();
            handleCheckTemperature(index);
          }}
        >
          <label>
            Condition:
            <select
              name="operator"
              value={alert.operator}
              onChange={(event) => handleInputChange(index, event)}
              disabled={!alert.isEditing}
            >
              <option value="greater">Greater than</option>
              <option value="less">Less than</option>
              <option value="equal">Equal to</option>
            </select>
          </label>
          <br></br>
          <label>
            Temperature:
            <input
              type="number"
              name="temperature"
              value={alert.temperature}
              onChange={(event) => handleInputChange(index, event)}
              placeholder="Enter temperature"
              disabled={!alert.isEditing}
            />
          </label>
          <br></br>
          <label>
            Alert Message:
            <input
              type="text"
              name="alertMessage"
              value={alert.alertMessage}
              onChange={(event) => handleInputChange(index, event)}
              placeholder="Enter alert message"
              disabled={!alert.isEditing}
            />
          </label>
          {alert.isEditing ? (
            <button className="alert-button" type="submit">
              Confirm Alert
            </button>
          ) : (
            <button
              className="alert-button"
              type="button"
              onClick={() => deleteAlert(index)}
            >
              Delete Alert
            </button>
          )}
          <br />
        </form>
      ))}
      <br></br>
      <button className="alert-button" onClick={addAlert}>
        Add Alert
      </button>
      <br></br>
    </div>
  );
}

export default CustomAlerts;
