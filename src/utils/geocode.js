// const request = require('request');
const axios = require('axios');
const lc = require('./logcolors');


const geocode = async (address, limit) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}&limit=${limit}`;
  let errorString;

  try {
    let response = await axios(url);  

    if(!response.data.features || response.data.features.length === 0) {
      return new Promise((response, reject) => {
        errorString = 'Unable to find location. Try another search.';
        console.log(`${lc.errorColor(errorString)}`);
        reject(errorString);
      });
    } 

    let attribution = response.data.attribution;

    let returnData = {
      attribution,
      forecast: []
    };
    
    await response.data.features.forEach( record => {
      returnData.forecast.push({
        latitude: record.center[1],
        longitude: record.center[0],
        location: record.place_name
      });
    });

    return new Promise((resolve, reject) => {
      resolve(returnData);
    });

  } catch (e) {
    console.log(lc.errorColor(e));
    return new Promise((resolve, reject) => {
      errorString = 'Unable to connect to location services!';
      console.log(`
      ${lc.errorColor(errorString)}
      ${lc.errorColorBG('Code:')} ${lc.errorColorBG(e.code)}
      ${lc.errorColor('Error:')} ${lc.errorColor(e.Error)}`);

      reject(errorString);  
    });
  }
};  

module.exports = geocode;