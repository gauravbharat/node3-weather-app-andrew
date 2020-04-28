require('dotenv').config();
const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');
const lc = require('./utils/logcolors');

const app = express();
// const port = process.env.PORT || 3000;
// const IP = process.env.IP || 'localhost';

const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

/* Setup handlebars engine, views and partials location */
// Let express know/view which templating engine to use. app.set('key', 'value')
// Here we are using Mustache Handlebars templating engine (.hbs).
// Other popular templating engines are ejs, pug, etc.
app.set('view engine', 'hbs');
// Use custom directory for hbs templates/files. Instead of the default 'views' directory, use custom 'templates/views' directory
app.set('views', viewsPath);
hbs.registerPartials(partialsPath); 
/* Setup handlebars engine, views and partials location - END */

/* Setup static directory to serve. 
Direct express to serve the absolute public folder path */
app.use(express.static(publicDirPath));

app.get('', (req, res) => {
  res.render(
    'index', 
    {
      title: 'Weather App',
      header: 'Weather',
      name: 'Gaurav Mendse | Andrew Mead | Complete Nodejs Developer Course | Udemy'
    }
  );
});

app.get('/about', (req, res) => {
  res.render(
    'about', 
    {
      title: 'About Me',
      header: 'About Me',
      name: 'Gaurav Mendse | Andrew Mead | Complete Nodejs Developer Course | Udemy'
    }
  );
});

app.get('/help', (req, res) => {
  res.render(
    'help', 
    {
      title: 'Help available',
      header: 'Help',
      name: 'Gaurav Mendse | Andrew Mead | Complete Nodejs Developer Course | Udemy'
      // text: 'Happy to help!'
    }
  );
});


app.get('/weather', (req, res) => {
  getWeatherData(req, res);
});

app.get('/more-weather', (req, res) => {
  res.render(
    'more-weather', 
    {
      title: 'More Weather',
      header: 'Matching Locations',
      name: 'Gaurav Mendse | Andrew Mead | Complete Nodejs Developer Course | Udemy'
    }
  );
});

app.get('/help/*', (req, res) => {
  res.render('404', {error: 'Help article not found.'});
});

app.get('*', (req, res) => {
  res.render('404', {error: 'Page not found.'});
});

app.listen(process.env.PORT, err => {
  console.log(`Server is up on port ${process.env.PORT}`);
});


async function getWeatherData(req, res) {
  // console.log(req.query);
  if(!req.query.address || !req.query.address.trim().length > 0) {
    // console.log(req.query.address);
    return res.send({
      e: 'You must provide an address'
    });
  }

  const address = req.query.address;
  const recordLimit = (req.query.limit) ? req.query.limit : 1;

  console.log('address', address);

  try {
    const data = await geocode(address, recordLimit);
    
    
    let returnData = {
      attribution: data.attribution,
      address,
      weather_data: []
    };
  
    let forecastData;

    for(let i = 0; i < data.forecast.length; i++) {  
      forecastData = await forecast(data.forecast[i]);  

      await returnData.weather_data.push({
        location: data.forecast[i].location,
        forecast: {
          weather_descriptions: forecastData.weather_descriptions,
          temperature: forecastData.temperature,
          feelslike: forecastData.feelslike,
          weather_icons: forecastData.weather_icons,
          humidity: forecastData.humidity,
          cloudcover: forecastData.cloudcover,
          wind_speed: forecastData.wind_speed,
          visibility: forecastData.visibility
        }  
      });
    }  

    return res.send(returnData);

  } catch (e) {
    console.log(e); 
    return res.send({ e }); 
  }
}