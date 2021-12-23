import { URLS } from "./urls.js";

export function getCityData(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(urlBody => urlBody.json())
      .then(urlContent => {
        checkErrorCode(urlContent.cod) ? resolve(urlContent) : reject(urlContent)
      })
      .catch(error => {
        alert(error.message)
      });
  });
};

export function getUrlByCity(cityName) {
  const url = `${URLS.WEATHER_URL.SERVER_URL}?q=${cityName}&appid=${URLS.WEATHER_URL.API_KEY}`;
  return url
}

export function getForecastByCity(cityName) {
  const url = `${URLS.FORECAST_URL.SERVER_URL}?q=${cityName}&appid=${URLS.FORECAST_URL.API_KEY}`;
  return url
}

export function checkErrorCode(code) {
  switch(code) {
    case 200:
      return true
    case 404:
      return false
    default:
      return new Error('Unrecognized error')
  }
}