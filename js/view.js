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
  LOADER: document.querySelector('.preloader'),
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
    FORECAST: {
      CITY_NAME: document.querySelector('.forecast__header'),
      TIMETABLE: document.querySelector('.forecast__timetable'),
    },
  },
  HISTORY: document.querySelector('.history__list'),
}

export function clearCityList(toRemove, list) {
  list.forEach((city) => {
    const currentCityName = city.textContent.trim();

    if (currentCityName === toRemove) {
      city.parentElement.remove();
      return
    }
  })
}

export function renderNow(cityData) {
  const isError = cityData instanceof Error;
  if (isError) {
    UI_ELEMENTS.TABS.NOW.TEMPERATURE.textContent = '0°';
    UI_ELEMENTS.TABS.NOW.CITY_NAME.textContent = cityData.message;
    return
  }

  setFavouriteState(cityData.name)
  UI_ELEMENTS.TABS.NOW.TEMPERATURE.textContent = Math.round(cityData.main.temp) + '°';
  UI_ELEMENTS.TABS.NOW.WEATHER_ICON.style.backgroundImage = `url(${URLS.ICON_URL}${cityData.weather[0].icon}@4x.png)`;
  UI_ELEMENTS.TABS.NOW.CITY_NAME.textContent = cityData.name;
}

export function setFavouriteState(cityName) {
  UI_ELEMENTS.TABS.NOW.FAVOURITE_BUTTON.checked = favouriteCities.has(cityName);
}

export function createFavouriteElement(cityName) {
  return `<div class="history__element font-style">
            <div class="history__text">
              ${cityName}
            </div>
            <button class="history__close"></button>
          </div>`
}

function createWeatherProperty(propertyValue) {
  return `<span class="details__parameter-value">
            ${propertyValue}
          </span>`
}

function createForecastCard(date, temp, feel, weather, weatherIconId) {
  const {hours, minutes, month, day} = convertUnixTime(date)

  return `<div class="forecast__card">
            <div class="card__moment">
              <div class="card__date font-style">
                ${day} ${month}
              </div>
              <div class="card__time font-style">
                ${hours}:${minutes}
              </div>
            </div>
            <div class="card__details">
              <div class="card__properties">
                <div class="card__parameter font-style">
                  Temperature: ${temp}°
                </div>
                <div class="card__parameter font-style">
                  Feels like: ${feel}°
                </div>
              </div>
              <div class="card__weather font-style">
                ${weather}
                <div class="card__icon" style="background-image: url(${URLS.ICON_URL}${weatherIconId}@4x.png)"></div>
              </div>
            </div>
          </div>`
}

export function renderDetails(cityData) {
  const isError = cityData instanceof Error;
  if (isError) {
    UI_ELEMENTS.TABS.DETAILS.CITY_NAME.textContent = cityData.message;
    UI_ELEMENTS.TABS.DETAILS.WEATHER_PROPERTIES.forEach(property => {
      const propertyName = Array.from(property.childNodes)
        .filter(propertyText => propertyText.nodeType === 3)
        .map(propertyName => propertyName.textContent.trim())
        .join('');
  
      property.textContent = propertyName;
    })
    return
  }

  UI_ELEMENTS.TABS.DETAILS.CITY_NAME.textContent = cityData.name;

  UI_ELEMENTS.TABS.DETAILS.WEATHER_PROPERTIES.forEach(property => {
    const propertyName = Array.from(property.childNodes)
      .filter(propertyText => propertyText.nodeType === 3)
      .map(propertyName => propertyName.textContent.trim())
      .join('');

    property.textContent = propertyName;

    switch (propertyName.slice(0, -1)) {
      case WEATHER_PROPERTIES.TEMPERATURE:
        property.insertAdjacentHTML('beforeend', createWeatherProperty(Math.round(cityData.main.temp) + '°'))
        return
      case WEATHER_PROPERTIES.FEELS_LIKE:
        property.insertAdjacentHTML('beforeend', createWeatherProperty(Math.round(cityData.main['feels_like']) + '°'))
        return
      case WEATHER_PROPERTIES.WEATHER:
        property.insertAdjacentHTML('beforeend', createWeatherProperty(cityData.weather[0].main))
        return
      case WEATHER_PROPERTIES.SUNRISE:
        property.insertAdjacentHTML('beforeend', createWeatherProperty(`${convertUnixTime(cityData.sys.sunrise).hours}:${convertUnixTime(cityData.sys.sunrise).minutes}`))
        return
      case WEATHER_PROPERTIES.SUNSET:
        property.insertAdjacentHTML('beforeend', createWeatherProperty(`${convertUnixTime(cityData.sys.sunset).hours}:${convertUnixTime(cityData.sys.sunset).minutes}`))
        return
    }
  })
}

export function renderForecast(cityData) {
  const isError = cityData instanceof Error;
  if (isError) {
    UI_ELEMENTS.TABS.FORECAST.CITY_NAME.textContent = cityData.message;
    UI_ELEMENTS.TABS.FORECAST.TIMETABLE.textContent = '';
    return
  }

  UI_ELEMENTS.TABS.FORECAST.CITY_NAME.textContent = cityData.city.name;
  UI_ELEMENTS.TABS.FORECAST.TIMETABLE.textContent = '';

  cityData.list.forEach(forecast => {
    const forecastCard = createForecastCard(forecast.dt, Math.round(forecast.main.temp), Math.round(forecast.main['feels_like']), forecast.weather[0].main, forecast.weather[0].icon);
    UI_ELEMENTS.TABS.FORECAST.TIMETABLE.insertAdjacentHTML('beforeend', forecastCard);
  })
}