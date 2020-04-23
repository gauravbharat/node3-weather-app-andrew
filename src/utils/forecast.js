const request = require('request');
const lc = require('./logcolors');

// setting default as empty object to the destructured object parameter
const forecast = ({latitude, longitude} = {}, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=${process.env.WEATHERSTACK_ACCESS_KEY}&query=${latitude},${longitude}`;
  
  request({url, json: true}, (error, response) => {
    let errorString;
    if(error) {
      console.log(lc.errorColor(error));
      
      errorString = `
      ${lc.errorColor('Unable to connect to weather service!')}
      ${lc.errorColorBG('Code:')} ${lc.errorColorBG(error.code)}
      ${lc.errorColor('Error:')} ${lc.errorColor(error.Error)}
      `;
      callback(errorString, undefined);
    } else if(response.body.error) {
      errorString = `
      ${lc.errorColor('Unable to find location.')}
      ${lc.errorColorBG('*** RETURN ERROR ***')}
      ${lc.errorColor('Code:')} ${lc.errorColor(response.body.error.code)}
      ${lc.errorColor('Type:')} ${lc.errorColor(response.body.error.type)}
      ${lc.errorColor('Error:')} ${lc.errorColor(response.body.error.info)} 
      `;
      callback(errorString, undefined);
    } else {
      callback(undefined, {
        country: response.body.location.country,
        name: response.body.location.name,
        region: response.body.location.region,
        weather_descriptions: response.body.current.weather_descriptions[0],
        temperature: response.body.current.temperature,
        feelslike: response.body.current.feelslike,
        weather_icons: response.body.current.weather_icons[0],
        humidity: response.body.current.humidity,
        cloudcover: response.body.current.cloudcover,
        wind_speed: response.body.current.wind_speed,
        visibility: response.body.current.visibility
      });
    } 
  });  
};

module.exports = forecast;