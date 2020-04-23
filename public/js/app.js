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

  fetch(`/weather?address=${location}`).then(res => {
    res.json().then(data => {
      if(data.error) {
        // console.log(data.error);
        let showHTML = `
          <div class="forecast__error">
            <p>${data.error}</p>
          </div>
        `;
        div.innerHTML = showHTML;
      } else {
        let showHTML = '';
        data.forEach(record => {
          showHTML += `
          <div class="forecast__data">
            <div class="forecast__data--1">
              <img class="forecast__data__img" src="${record.forecast.weather_icons}" alt="Icon">
              <p class="forecast__data__location">${record.location}</p>
            </div>
            <p class="forecast__data__info">${record.forecast.weather_descriptions}. Today's temperature is ${record.forecast.temperature}&#176C, though feels like ${record.forecast.feelslike}&#176C.</p>
          </div>

        `;
        });
        div.innerHTML = showHTML;

        // console.log(data[0].location);
        // console.log(data[0].forecast);
      }
      button.textContent = 'Search';
      button.disabled = false;
    });
  });
});