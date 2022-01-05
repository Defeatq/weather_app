import { UI_ELEMENTS, createFavouriteElement, renderNow, renderDetails, renderForecast } from './view.js';
import { getUrlByCity, getCityData, getForecastByCity } from './requests.js';

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
    UI_ELEMENTS.LOADER.style.display = 'block';
    const isPrevCityExist = this.getCurrentCity() !== null;
    const isFavouriteInit = this.getFavouriteCities() !== null;

    if (!isPrevCityExist ||
        !isFavouriteInit) {
      this.saveFavouriteCities(favouriteCities);
      UI_ELEMENTS.LOADER.style.display = 'none';
      return
    }

    getCityData(getUrlByCity(this.getCurrentCity()))
      .then(cityData => {
        this.getFavouriteCities().forEach(city => {
          favouriteCities.push(city);
          UI_ELEMENTS.HISTORY.insertAdjacentHTML('beforeend', createFavouriteElement(city));
        });
        
        renderNow(cityData);
        renderDetails(cityData);
        UI_ELEMENTS.LOADER.style.display = 'none';
      })
      .then(getCityData(getForecastByCity(this.getCurrentCity()))
        .then(cityData => {
          renderForecast(cityData)
        }))
  }
}