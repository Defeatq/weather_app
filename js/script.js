import { UI_ELEMENTS, renderNow, setStateFavourite } from "./view.js";
import { favouriteCities } from "./storage.js";

const URLS = {
  WEATHER_URL: {
    SERVER_URL: 'https://api.openweathermap.org/data/2.5/weather',
    API_KEY: 'f660a2fb1e4bad108d6160b7f58c555f&units=metric',
  },
}

function getCityData(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(urlBody => urlBody.json())
      .then(urlContent => {
        checkErrorCode(urlContent.cod) ? resolve(urlContent) : reject(urlContent)
      });
  });
};

function getUrlByCity(cityName) {
  const url = `${URLS.WEATHER_URL.SERVER_URL}?q=${cityName}&appid=${URLS.WEATHER_URL.API_KEY}`;
  return url
}

function checkErrorCode(code) {
  return code === 200
}

function isPlaceClicked(elem, className) {
  return elem.target.classList.contains(className)
}

function clearCityList(toRemove, list) {
  list.forEach((city) => {
    const currentCityName = city.textContent.trim();

    if (currentCityName === toRemove) {
      city.parentElement.remove();
      return
    }
  })
}

function deleteCityFromFavList(cityName) {
  const cityIdStorage = favouriteCities.indexOf(cityName);
  favouriteCities.splice(cityIdStorage, 1);
}

function removeFromFavourites(elem) {
  const storageCityItem = elem.target.parentElement;
  const cityName = storageCityItem.firstElementChild.textContent.trim();

  getCityData(getUrlByCity(cityName))
    .then(data => {
      deleteCityFromFavList(cityName);
      renderNow(data.name, Math.round(data.main.temp), data.weather[0].icon);
      storageCityItem.remove();
    });
}

UI_ELEMENTS.SEARCH_FORM.addEventListener('submit', event => {
  event.preventDefault();

  const inputValue = event.target.firstElementChild.value;
  const cityUrl = getUrlByCity(inputValue);
  const cityData = getCityData(cityUrl);

  cityData.then((data => {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const weatherIconId = data.weather[0].icon;
    
    renderNow(cityName, temperature, weatherIconId);
  }))
  .catch(errorData => {
    alert(errorData.message)
    renderNow(errorData.message, '0')
  });

  event.target.firstElementChild.value = '';
});

document.body.addEventListener('click', (checkElem) => {
  const isDeleteButton = isPlaceClicked(checkElem, 'history__close')
  const isFavouriteButton = isPlaceClicked(checkElem, 'now__favourite');
  const isSavedCity = isPlaceClicked(checkElem, 'history__text');

  if (isDeleteButton) {
    removeFromFavourites(checkElem);
  }

  if (isFavouriteButton) {
    const isLiked = checkElem.target.checked;
    const cityName = checkElem.target.parentElement.firstElementChild.textContent.trim();

    if (isLiked) {
      favouriteCities.push(cityName);
      
      UI_ELEMENTS.HISTORY.insertAdjacentHTML('beforeend', `
            <div class="history__element font-style">
              <div class="history__text">
                ${cityName}
              </div>
              <button class="history__close"></button>
            </div>`);
    } else {
      const historyList = document.querySelectorAll('.history__text');
      deleteCityFromFavList(cityName);
      clearCityList(cityName, historyList)
    }
  }
  console.log(favouriteCities)
  if (isSavedCity) {
    const cityName = checkElem.target.textContent.trim();

    getCityData(getUrlByCity(cityName))
      .then(data => {
        renderNow(data.name, Math.round(data.main.temp), data.weather[0].icon);
      })
  }
});