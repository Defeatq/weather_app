import { UI_ELEMENTS, createFavouriteElement, renderNow } from './view.js';
import { getUrlByCity, getCityData } from './async_actions.js';

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
    getCityData(getUrlByCity(STORAGE_ACTIONS.getCurrentCity()))
      .then(cityData => {
        this.getFavouriteCities().forEach(city => {
          favouriteCities.push(city);
          UI_ELEMENTS.HISTORY.insertAdjacentHTML('beforeend', createFavouriteElement(city));
        });
        
        renderNow(cityData.name, Math.round(cityData.main.temp), cityData.weather[0].icon);
      })
  }
}