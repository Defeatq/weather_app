import { UI_ELEMENTS, renderNow, createFavouriteElement, setStateFavourite, renderDetails, clearCityList, renderForecast } from "./view.js";
import { favouriteCities, STORAGE_ACTIONS } from "./storage.js";
import { getUrlByCity, getCityData, getForecastByCity } from './requests.js';

STORAGE_ACTIONS.loadStorage();

function getClickedPlace(elem, className) {
  return elem.target.classList.contains(className)
}

function deleteCityFromFavList(cityName) {
  const cityIdStorage = favouriteCities.indexOf(cityName);
  favouriteCities.splice(cityIdStorage, 1);

  STORAGE_ACTIONS.saveFavouriteCities(favouriteCities);
}

function removeFromFavourites(elem) {
  const storageCityItem = elem.target.parentElement;
  const cityName = storageCityItem.firstElementChild.textContent.trim();

  getCityData(getUrlByCity(cityName))
    .then(data => {
      deleteCityFromFavList(cityName);
      renderNow(data.name, Math.round(data.main.temp), data.weather[0].icon);
      renderDetails(data.name, Math.round(data.main.temp), Math.round(data.main['feels_like']), data.weather[0].main, data.sys.sunrise, data.sys.sunset);
      storageCityItem.remove();
    });
}

UI_ELEMENTS.SEARCH_FORM.addEventListener('submit', event => {
  event.preventDefault();

  const inputValue = event.target.firstElementChild.value;
  const cityData = getCityData(getUrlByCity(inputValue));
  const forecastData = getCityData(getForecastByCity(inputValue));

  cityData.then((data => {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const weatherIconId = data.weather[0].icon;
    const feelsLike = Math.round(data.main['feels_like']);
    const weather = data.weather[0].main;
    const sunrise = data.sys.sunrise; 
    const sunset = data.sys.sunset;
    
    renderNow(cityName, temperature, weatherIconId);
    renderDetails(cityName, temperature, feelsLike, weather, sunrise, sunset);
    STORAGE_ACTIONS.setCurrentCity(cityName);
  }))
  .catch(errorData => {
    alert(errorData.message);
    renderNow(errorData.message, '0');
    renderDetails(errorData.message);
  });

  forecastData.then(cityData => {
    renderForecast(cityData.city.name, cityData.list);
  })
  .catch(errorData => {
    alert(errorData.message);
    renderForecast(errorData.message, []);
  })

  event.target.firstElementChild.value = '';
});

document.body.addEventListener('click', (checkElem) => {
  const isDeleteButton = getClickedPlace(checkElem, 'history__close')
  const isFavouriteButton = getClickedPlace(checkElem, 'now__favourite');
  const isSavedCity = getClickedPlace(checkElem, 'history__text');

  if (isDeleteButton) {
    removeFromFavourites(checkElem);
  }

  if (isFavouriteButton) {
    const isLiked = checkElem.target.checked;
    const cityName = checkElem.target.parentElement.firstElementChild.textContent.trim();

    if (isLiked) {
      favouriteCities.push(cityName);
      STORAGE_ACTIONS.saveFavouriteCities(favouriteCities);
      UI_ELEMENTS.HISTORY.insertAdjacentHTML('beforeend', createFavouriteElement(cityName));
    } else {
      const historyList = document.querySelectorAll('.history__text');
      deleteCityFromFavList(cityName);
      clearCityList(cityName, historyList)
    }
  }

  if (isSavedCity) {
    const cityName = checkElem.target.textContent.trim();

    getCityData(getUrlByCity(cityName))
      .then(cityData => {
        renderNow(cityData.name, Math.round(cityData.main.temp), cityData.weather[0].icon);
        renderDetails(cityData.name, Math.round(cityData.main.temp), Math.round(cityData.main['feels_like']), cityData.weather[0].main, cityData.sys.sunrise, cityData.sys.sunset);
        STORAGE_ACTIONS.setCurrentCity(cityData.name);
      })

    getCityData(getForecastByCity(cityName))
      .then(cityData => {
        renderForecast(cityData.city.name, cityData.list)
      })
  }
});