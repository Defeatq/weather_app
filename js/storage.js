import { UI_ELEMENTS, createFavouriteElement, renderNow, renderDetails, createWeatherProperty } from './view.js';
import { getUrlByCity, getCityData } from './requests.js';

export const favouriteCities = [];

export const STORAGE_ACTIONS = {
  saveFavouriteCities: function(cityList) {
    localStorage.setItem('favouriteCities', JSON.stringify(cityList));
  },
  getFavouriteCities: function() {
    return JSON.parse(localStorage.getItem('favouriteCities'))
  },
  setCurrentCity: function(cityName) {
    localStorage.setItem('currentCity', cityName);
  },
  getCurrentCity: function() {
    return localStorage.getItem('currentCity')
  },
  loadStorage: function() {
    console.log(STORAGE_ACTIONS.getCurrentCity())
    UI_ELEMENTS.LOADER.style.display = 'block';
    // if (STORAGE_ACTIONS.getCurrentCity() === null) {
    //   UI_ELEMENTS.LOADER.style.display = 'none';
    //   return
    // }

    getCityData(getUrlByCity(STORAGE_ACTIONS.getCurrentCity()))
      .then(cityData => {
        this.getFavouriteCities().forEach(city => {
          favouriteCities.push(city);
          UI_ELEMENTS.HISTORY.insertAdjacentHTML('beforeend', createFavouriteElement(city));
        });
        
        renderNow(cityData.name, Math.round(cityData.main.temp), cityData.weather[0].icon);
        renderDetails(cityData.name, Math.round(cityData.main.temp), Math.round(cityData.main['feels_like']), cityData.weather[0].main, cityData.sys.sunrise, cityData.sys.sunset);
        UI_ELEMENTS.LOADER.style.display = 'none';
      })
  }
}