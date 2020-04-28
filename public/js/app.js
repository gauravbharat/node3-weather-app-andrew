// console.log('Client-side javascript file loaded!');

// fetch can't be used on server-side, nodejs js files. However, we are using it here since this is a client-side js file

// fetch('http://puzzle.mead.io/puzzle').then((response) => {
//   response.json().then((data) => {
//     console.log(data);
//   });
// });

// fetch('http://localhost:3000/weather?address=Boston').then(res => {
//   res.json().then(data => {
//     if(data.error) {
//       console.log(data.error);
//     } else {
//       console.log(data[0].location);
//       console.log(data[0].forecast);
//     }
//   })
// });

const weatherForm = document.querySelector('form');
const search = document.querySelector('form input');
const button = document.querySelector('form button');
const div = document.querySelector('.forecast');



weatherForm.addEventListener('submit', (e) => {
  div.innerHTML = '';

  e.preventDefault();
  const location = search.value;
  // console.log(location);

  button.textContent = 'Loading...';
  button.disabled = true;

  fetch(`/weather?address=${location}&limit=${(window.location.pathname === '/more-weather') ? 10 : 1}`).then(res => {
    res.json().then(data => {

      // console.log(data);

      if(data.e) {
        // console.log(data.e);
        let showHTML = `
          <div class="forecast__error">
            <p>${data.e}</p>
          </div>
        `;
        div.innerHTML = showHTML;
      } else {
        let showHTML = '';
        data.weather_data.forEach(record => {
          showHTML += `
          <div class="forecast__data">
            <div class="forecast__data--1">
              <img class="forecast__data__img" src="${record.forecast.weather_icons}" alt="Icon">
              <p class="forecast__data__location">${record.location}</p>
            </div>
            <p class="forecast__data__info">${record.forecast.weather_descriptions}. Today's temperature is <strong>${record.forecast.temperature}&#176C</strong>, though feels like ${(record.forecast.temperature === record.forecast.feelslike) ? 'the same' : record.forecast.feelslike + '&#176C'}. The humidity is ${record.forecast.humidity}%, cloud cover of ${record.forecast.cloudcover}%, wind speed at ${record.forecast.wind_speed} kilometers/hr and a visibility level of ${record.forecast.visibility} kilometers.</p>
          </div>
        `;
        });
        showHTML += `
        <p class='attribution'>${data.attribution}</p>
        `;
        div.innerHTML = showHTML;

        // console.log(data[0].location);
        // console.log(data[0].forecast);
      }
      button.textContent = 'Search';
      button.disabled = false;
    });
  });
});