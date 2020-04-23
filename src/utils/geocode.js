const request = require('request');
const lc = require('./logcolors');

const geocode = (address, limit, callback) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiZ2FyeWRzYSIsImEiOiJjazk5cGNhNmwwNXd3M2RucmV6c2lvMndxIn0.JODx4FouHrzD0YKeHz6pkw&limit=${limit}`;

  request({url, json: true}, (error, response) => {
    let errorString;
    // Low level error
    if(error) {
      console.log(lc.errorColor(error));
      errorString = `
        ${lc.errorColor('Unable to connect to location services!')}
        ${lc.errorColorBG('Code:')} ${lc.errorColorBG(error.code)}
        ${lc.errorColor('Error:')} ${lc.errorColor(error.Error)}
      `;

      callback(errorString, undefined);

    // Search error 
    } else if(!response.body.features || response.body.features.length === 0) {

      errorString = `${lc.errorColor('Unable to find location. Try another search.')}`;
      if(response.body.search && response.body.search('<H1>400 ERROR</H1>') > 0) {
        errorString += `
        ${lc.errorColorBG(`*** RETURN ERROR ***`)}
        ${lc.errorColor(`Code: 400 ERROR`)}
        ${lc.errorColor(`Info: Bad request. The request could not be satisfied.`)}
        `;
      }  

      callback(errorString, undefined);

    // Success
    } else {
      callback(undefined, {
        latitude: response.body.features[0].center[1],
        longitude: response.body.features[0].center[0],
        location: response.body.features[0].place_name,
        attribution: response.body.attribution
      });
    }
  });
};

module.exports = geocode;