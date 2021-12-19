import { favouriteCities } from "./storage.js";

export const UI_ELEMENTS = {
  TABS_LINKS: document.querySelectorAll('.tabs__link'),
  TABS_CONTENT: document.querySelectorAll('.tabs__content'),
  SEARCH_FORM: document.querySelector('.weather__search'),
  TABS: {
    NOW: {
      TEMPERATURE: document.querySelector('.now__temperature'),
      CITY_NAME: document.querySelector('.now__name'),
      WEATHER_ICON: document.querySelector('.now__weather-icon'),
      FAVOURITE_BUTTON: document.querySelector('.now__favourite')
    },
  },
  HISTORY: document.querySelector('.history__list'),
}

const PICTURE_URL = 'http://openweathermap.org/img/wn/';

export function renderNow(cityName, temperature, weatherIconId = `url(icon/icons8-cloud-961.svg)`) {
  setStateFavourite(cityName)
  UI_ELEMENTS.TABS.NOW.TEMPERATURE.textContent = temperature + '°';
  UI_ELEMENTS.TABS.NOW.WEATHER_ICON.style.backgroundImage = `url(${PICTURE_URL}${weatherIconId}@4x.png)`;
  UI_ELEMENTS.TABS.NOW.CITY_NAME.textContent = cityName;
}

export function setStateFavourite(cityName) {
  const isCityInFavList = favouriteCities.includes(cityName)

  isCityInFavList ? UI_ELEMENTS.TABS.NOW.FAVOURITE_BUTTON.checked = true : UI_ELEMENTS.TABS.NOW.FAVOURITE_BUTTON.checked = false;
}