import { UI_ELEMENTS, renderNow, createFavouriteElement, renderDetails, clearCityList, renderForecast } from "./view.js";
import { favouriteCitiesStorage, LOCAL_STORAGE_ACTIONS } from "./storage.js";
import { getUrlByCity, getCityData, getForecastByCity } from './requests.js';

LOCAL_STORAGE_ACTIONS.loadStorage();

const ERROR_MESSAGES = ['No such city', 'City name'];

function checkClickedPlace(elem, className) {
  return elem.target.classList.contains(className)
}

function removeFromFavourites(elem) {
  const storageCityItem = elem.target.parentElement;
  const cityName = storageCityItem.firstElementChild.textContent.trim();

  getCityData(getUrlByCity(cityName))
    .then(cityData => {
      favouriteCitiesStorage.deleteCity(cityName);
      renderNow(cityData);
      renderDetails(cityData);
      storageCityItem.remove();
    });

  getCityData(getForecastByCity(cityName))
  .then(cityData => {
    renderForecast(cityData)
  })
}

UI_ELEMENTS.SEARCH_FORM.addEventListener('submit', event => {
  event.preventDefault();

  const inputValue = event.target.firstElementChild.value;
  const cityData = getCityData(getUrlByCity(inputValue));
  const forecastData = getCityData(getForecastByCity(inputValue));

  cityData.then((cityData => {
    renderNow(cityData);
    renderDetails(cityData);
    LOCAL_STORAGE_ACTIONS.setCurrentCity(cityData.name);
  }))
  .catch(errorData => {
    alert(errorData.message);
    renderNow(new Error('No such city'));
    renderDetails(new Error('No such city'));
  });

  forecastData.then(cityData => {
    renderForecast(cityData);
  })
  .catch(errorData => {
    alert(errorData.message);
    renderForecast(new Error('No such city'));
  })

  event.target.firstElementChild.value = '';
});

document.body.addEventListener('click', (checkElem) => {
  const isDeleteButton = checkClickedPlace(checkElem, 'history__close')
  const isFavouriteButton = checkClickedPlace(checkElem, 'now__favourite');
  const isSavedCity = checkClickedPlace(checkElem, 'history__text');

  if (isDeleteButton) {
    removeFromFavourites(checkElem);
  }

  if (isFavouriteButton) {
    const isLiked = checkElem.target.checked;
    const cityName = checkElem.target.parentElement.firstElementChild.textContent.trim();
    checkElem.target.checked = false;

    if (isLiked && !ERROR_MESSAGES.includes(cityName)) {
      checkElem.target.checked = true;
      favouriteCitiesStorage.addCity(cityName);
    } else {
      const favouriteList = document.querySelectorAll('.history__text');
      favouriteCitiesStorage.deleteCity(cityName);
      clearCityList(cityName, favouriteList)
    }
  }

  if (isSavedCity) {
    const cityName = checkElem.target.textContent.trim();

    getCityData(getUrlByCity(cityName))
      .then(cityData => {
        renderNow(cityData);
        renderDetails(cityData);
        LOCAL_STORAGE_ACTIONS.setCurrentCity(cityData.name);
      })

    getCityData(getForecastByCity(cityName))
      .then(cityData => {
        renderForecast(cityData)
      })
  }
});