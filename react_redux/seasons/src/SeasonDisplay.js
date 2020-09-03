import './SeasonDisplay.css';
import React from 'react';

const seasonConfig = {
  Summer: {
    text: "Let's hit the beach!",
    iconName: 'sun'
  },
  Winter: {
    text: 'Burr it\'s cold',
    iconName: 'snowflake'
  }
}

const months = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const getSeason = (lat, month) => {
  if (month > 2 && month < 9) { return lat > 0 ? 'Summer' : 'Winter' };
  return lat > 0 ? 'Winter' : 'Summer';
}

const SeasonDisplay = (props) => {
  const date = new Date().getMonth();
  const season = getSeason(props.latitude, date);
  const { text, iconName } = seasonConfig[season];
  
  return (
    <div className={`season-display ${season}`}>
      <i className={`icon-left massive ${iconName} icon`} />
      <div className="center-text">
        <h3>Your latitude is: {props.latitude}</h3>
        <h2>{season} in {months[date]}</h2>
        <h1>{text}</h1>
      </div>
      <i className={`icon-right massive ${iconName} icon`} />
    </div>
  );
};

export default SeasonDisplay;