import React from "react";
import "../../Styles/SevenDayCard.css";

import clear from "../../icons/clear.png";
import mostly_clear from "../../icons/mostly_clear.png";
import partly_cloudy from "../../icons/partly_cloudy.png";
import mostly_cloudy from "../../icons/mostly_cloudy.png";
import cloudy from "../../icons/cloudy.png";
import light_fog from "../../icons/light_fog.png";
import fog from "../../icons/fog.png";
import drizzle from "../../icons/drizzle.png";
import light_rain from "../../icons/light_rain.png";
import rain from "../../icons/rain.png";
import heavy_rain from "../../icons/heavy_rain.png";
import thunderstorm from "../../icons/thunderstorm.png";

const GetIcon = ({ weatherCode, precipitationProbability }) => {
  let isRaining = false;
  const codeConversion = {
    1000: clear,
    1100: mostly_clear,
    1101: partly_cloudy,
    1102: mostly_cloudy,
    1001: cloudy,
    2100: light_fog,
    2000: fog,
    4000: drizzle,
    4200: light_rain,
    4001: rain,
    4201: heavy_rain,
    8000: thunderstorm,
  };
  if (
    weatherCode === 4000 ||
    weatherCode === 4200 ||
    weatherCode === 4201 ||
    weatherCode === 4001 ||
    weatherCode == 8000
  ) {
    isRaining = true;
  }
  console.log(codeConversion[weatherCode]);
  let weatherIcon = codeConversion[weatherCode];
  if (isRaining) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img className="rain-icons" alt={weatherIcon} src={weatherIcon}></img>
        <span id="precipitation-chance">
          {Math.round(precipitationProbability)}%
        </span>
      </div>
    );
  } else {
    return <img className="icons" alt="weatherIcon" src={weatherIcon}></img>;
  }
};

const DayOfWeek = ({ dateString }) => {
  const date = new Date(dateString);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = days[date.getDay()];
  if (dateString === "today") {
    return <div>Today</div>;
  } else {
    return <div>{dayOfWeek}</div>;
  }
};
function toFahrenheit(celsius) {
  this.props.toFahrenheit(celsius);
}
const SevenDayCard = (props) => {
  const cardClass = props.cardClass;
  const dayTextClass = props.dayTextClass;
  const minTempClass = props.temperatureMinClass;
  const maxTempClass = props.temperatureMaxClass;
  const weatherCode = props.weatherCode;
  const startTime = props.startTime;
  const temperatureMin = props.temperatureMin;
  const temperatureMax = props.temperatureMax;
  const precipitationProbability = props.precipitationProbability;

  return (
    <div className={cardClass}>
      <p className={dayTextClass}>
        <DayOfWeek dateString={startTime} />
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <GetIcon
          weatherCode={weatherCode}
          precipitationProbability={precipitationProbability}
        ></GetIcon>
      </div>
      <div className="temperatures">
        {/* style={temperatures} */}
        <p id={maxTempClass}>{Math.round(temperatureMax)}&deg;F</p>
        <p id={minTempClass}>{Math.round(temperatureMin)}&deg;F</p>
      </div>
    </div>
  );
};

export default SevenDayCard;
