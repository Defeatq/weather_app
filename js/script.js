import { UI_ELEMENTS, renderNow, createFavouriteElement, renderDetails, clearCityList, renderForecast } from "./view.js";
import { favouriteCities, STORAGE_ACTIONS } from "./storage.js";
import { getUrlByCity, getCityData, getForecastByCity } from './requests.js';

STORAGE_ACTIONS.loadStorage();

const ERROR_MESSAGES = ['No such city', 'City name'];

function getClickedPlace(elem, className) {
  return elem.target.classList.contains(className)
}

function deleteCityFromFavList(cityName) {
  favouriteCities.delete(cityName);
  STORAGE_ACTIONS.saveFavouriteCities(favouriteCities);
}

function removeFromFavourites(elem) {
  const storageCityItem = elem.target.parentElement;
  const cityName = storageCityItem.firstElementChild.textContent.trim();

  getCityData(getUrlByCity(cityName))
    .then(cityData => {
      deleteCityFromFavList(cityName);
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
    const cityName = cityData.name;
    
    renderNow(cityData);
    renderDetails(cityData);
    STORAGE_ACTIONS.setCurrentCity(cityName);
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
    renderForecast(new Error('No such city'), []);
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
    checkElem.target.checked = false;

    if (isLiked && !ERROR_MESSAGES.includes(cityName)) {
      checkElem.target.checked = true;
      favouriteCities.add(cityName);
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
        renderNow(cityData);
        renderDetails(cityData);
        STORAGE_ACTIONS.setCurrentCity(cityData.name);
      })

    getCityData(getForecastByCity(cityName))
      .then(cityData => {
        renderForecast(cityData)
      })
  }
});