import { UI_ELEMENTS, renderNow, createFavouriteElement, setStateFavourite } from "./view.js";
import { favouriteCities, STORAGE_ACTIONS } from "./storage.js";
import { getUrlByCity, getCityData } from './async_actions.js';

STORAGE_ACTIONS.loadStorage();

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

  STORAGE_ACTIONS.saveFavouriteCities(favouriteCities);
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
    STORAGE_ACTIONS.setCurrentCity(cityName);
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
        STORAGE_ACTIONS.setCurrentCity(cityData.name);
      })
  }
});