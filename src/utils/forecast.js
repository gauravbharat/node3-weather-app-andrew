// const request = require('request');
const axios = require('axios');
const lc = require('./logcolors');

// setting default as empty object to the destructured object parameter

const forecast = async ({latitude, longitude} = {}) => {
  const url = `http://api.weatherstack.com/current?access_key=${process.env.WEATHERSTACK_ACCESS_KEY}&query=${latitude},${longitude}`;
  let errorString;

  try {
    let response = await axios(url);  

    if(response.data.error) {
      return new Promise((resolve, reject) => {
        errorString = 'Unable to find location.';
        console.log(`
          ${lc.errorColor(errorString)}
          ${lc.errorColorBG('*** RETURN ERROR ***')}
          ${lc.errorColor('Code:')} ${lc.errorColor(response.data.error.code)}
          ${lc.errorColor('Type:')} ${lc.errorColor(response.data.error.type)}
          ${lc.errorColor('Error:')} ${lc.errorColor(response.data.error.info)}`);

        reject(errorString);  
      });    
    }

    return new Promise((resolve, reject) => {
      resolve(
        {
          country: response.data.location.country,
          name: response.data.location.name,
          region: response.data.location.region,
          weather_descriptions: response.data.current.weather_descriptions[0],
          temperature: response.data.current.temperature,
          feelslike: response.data.current.feelslike,
          weather_icons: response.data.current.weather_icons[0],
          humidity: response.data.current.humidity,
          cloudcover: response.data.current.cloudcover,
          wind_speed: response.data.current.wind_speed,
          visibility: response.data.current.visibility
        }        
      );
    });

  } catch (e) {
    console.log(lc.errorColor(e));
    return new Promise((resolve, reject) => {
      errorString = 'Unable to connect to weather service!';
      console.log(`
      ${lc.errorColor(errorString)}
      ${lc.errorColorBG('Code:')} ${lc.errorColorBG(e.code)}
      ${lc.errorColor('Error:')} ${lc.errorColor(e.Error)}`);

      reject(errorString);  
    });
  }

};

module.exports = forecast;