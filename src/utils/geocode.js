const request = require('request');
const lc = require('./logcolors');

const geocode = (address, limit, callback) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}&limit=${limit}`;

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

      let attribution = response.body.attribution;

      let returnData = {
        attribution,
        forecast: []
      };
      
      response.body.features.forEach( record => {
        returnData.forecast.push({
          latitude: record.center[1],
          longitude: record.center[0],
          location: record.place_name
        });
      });

      callback(undefined, returnData);
    }
  });
};

module.exports = geocode;