import { UI_ELEMENTS, createFavouriteElement, renderNow, renderDetails, renderForecast } from './view.js';
import { getUrlByCity, getCityData, getForecastByCity } from './requests.js';

export const favouriteCitiesStorage = new Storage();

function Storage() {
  this.cities = new Set();

  this.deleteCity = function(cityName) {
    this.cities.delete(cityName);
    LOCAL_STORAGE_ACTIONS.saveFavouriteCities(this.cities);
  }
  
  this.addCity = function(cityName) {
    this.cities.add(cityName);
    LOCAL_STORAGE_ACTIONS.saveFavouriteCities(this.cities);
    UI_ELEMENTS.FAVOURITE_LIST.insertAdjacentHTML('beforeend', createFavouriteElement(cityName));
  }

  this.hasCity = function(cityName) {
    return this.cities.has(cityName)
  }
}

export const LOCAL_STORAGE_ACTIONS = {
  saveFavouriteCities: function(cityList) {
    localStorage.setItem('favouriteCities', JSON.stringify([...cityList]));
  },
  getFavouriteCities: function() {
    return new Set(JSON.parse(localStorage.getItem('favouriteCities')))
  },
  setCurrentCity: function(cityName) {
    localStorage.setItem('currentCity', cityName);
  },
  getCurrentCity: function() {
    return localStorage.getItem('currentCity')
  },
  loadStorage: function() {
    UI_ELEMENTS.LOADER.style.display = 'block';
    const isPrevCityInit = this.getCurrentCity() !== null;
    const isFavouriteInit = this.getFavouriteCities() !== null;

    if (!isPrevCityInit ||
        !isFavouriteInit) {
      this.saveFavouriteCities(favouriteCitiesStorage.cities);
      UI_ELEMENTS.LOADER.style.display = 'none';
      return
    }

    getCityData(getUrlByCity(this.getCurrentCity()))
      .then(cityData => {
        this.getFavouriteCities().forEach(city => {
          favouriteCitiesStorage.addCity(city)
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