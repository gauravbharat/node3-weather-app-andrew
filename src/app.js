const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');
const lc = require('./utils/logcolors');

const app = express();
const port = process.env.PORT || 3000;
const IP = process.env.IP || 'localhost';

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
      name: 'Gaurav Mendse'
    }
  );
});

app.get('/about', (req, res) => {
  res.render(
    'about', 
    {
      title: 'About Me',
      header: 'About Me',
      name: 'Gaurav Mendse'
    }
  );
});

app.get('/help', (req, res) => {
  res.render(
    'help', 
    {
      title: 'Help available',
      header: 'Help',
      name: 'System Admin',
      text: 'This is some helpful text'
    }
  );
});


app.get('/weather', (req, res) => {
  if(!req.query.address && req.query.address.length > 0) {
    return res.send({
      error: 'You must provide an address'
    });
  }
  const address = req.query.address;
  const recordLimit = (req.query.limit) ? (req.query.limit) : 1;

  geocode(address, recordLimit, (error, data) => {
    if(error) { 
      console.log(error); 
      return res.send({ error }); 
    }
    
    forecast(data, (error, forecastData) => {
      if(error) { 
        console.log(error);
        return res.send({ error });  
      }
      // console.log(data);
      // console.log(forecastData);

      // console.log(lc.successColorBG(data.location));
      // console.log(lc.successColor(`${forecastData.weather_descriptions}. Today's temperature is ${forecastData.temperature}, though feels like ${forecastData.feelslike}.`));

      res.send ([{
        location: data.location,
        forecast: {
          weather_descriptions: forecastData.weather_descriptions,
          temperature: forecastData.temperature,
          feelslike: forecastData.feelslike,
          weather_icons: forecastData.weather_icons
        },  
        address
      }]);
    });
  });
});

app.get('/help/*', (req, res) => {
  res.render('404', {error: 'Help article not found.'});
});

app.get('*', (req, res) => {
  res.render('404', {error: 'Page not found.'});
});

app.listen(port, IP, err => {
  console.log(`Server is up on port ${port} and IP ${IP}...`);
});