import { favouriteCities } from "./storage.js";
import { URLS } from "./urls.js";
import { convertUnixTime } from "./time_converter.js";

const WEATHER_PROPERTIES = {
  TEMPERATURE: 'Temperature',
  FEELS_LIKE: 'Feels like',
  WEATHER: 'Weather',
  SUNRISE: 'Sunrise',
  SUNSET: 'Sunset',
}

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
    DETAILS: {
      CITY_NAME: document.querySelector('.details__header'),
      WEATHER_PROPERTIES: document.querySelectorAll('.details__parameter'),
    },
  },
  HISTORY: document.querySelector('.history__list'),
}

export function renderNow(cityName, temperature, weatherIconId = `url(icon/icons8-cloud-961.svg)`) {
  setStateFavourite(cityName)
  UI_ELEMENTS.TABS.NOW.TEMPERATURE.textContent = temperature + '°';
  UI_ELEMENTS.TABS.NOW.WEATHER_ICON.style.backgroundImage = `url(${URLS.ICON_URL}${weatherIconId}@4x.png)`;
  UI_ELEMENTS.TABS.NOW.CITY_NAME.textContent = cityName;
}

export function setStateFavourite(cityName) {
  const isCityInFavList = favouriteCities.includes(cityName)

  isCityInFavList ? UI_ELEMENTS.TABS.NOW.FAVOURITE_BUTTON.checked = true : UI_ELEMENTS.TABS.NOW.FAVOURITE_BUTTON.checked = false;
}

export function createFavouriteElement(cityName) {
  return `<div class="history__element font-style">
            <div class="history__text">
              ${cityName}
            </div>
            <button class="history__close"></button>
          </div>`
}

export function createWeatherProperty(propertyValue) {
  return `<span class="details__parameter-value">
            ${propertyValue}
          </span>`
}

export function renderDetails(cityName, temp, feel, weather, sunrise, sunset) {
  UI_ELEMENTS.TABS.DETAILS.CITY_NAME.textContent = cityName;

  UI_ELEMENTS.TABS.DETAILS.WEATHER_PROPERTIES.forEach(property => {
    const propertyName = Array.from(property.childNodes)
      .filter(propertyText => propertyText.nodeType === 3)
      .map(propertyName => propertyName.textContent.trim())
      .join('');

    property.textContent = propertyName;

    switch (propertyName.slice(0, -1)) {
      case WEATHER_PROPERTIES.TEMPERATURE:
        property.insertAdjacentHTML('beforeend', createWeatherProperty(temp + '°'))
        return
      case WEATHER_PROPERTIES.FEELS_LIKE:
        property.insertAdjacentHTML('beforeend', createWeatherProperty(feel + '°'))
        return
      case WEATHER_PROPERTIES.WEATHER:
        property.insertAdjacentHTML('beforeend', createWeatherProperty(weather))
        return
      case WEATHER_PROPERTIES.SUNRISE:
        property.insertAdjacentHTML('beforeend', createWeatherProperty(convertUnixTime(sunrise)))
        return
      case WEATHER_PROPERTIES.SUNSET:
        property.insertAdjacentHTML('beforeend', createWeatherProperty(convertUnixTime(sunset)))
        return
    }
  })
}