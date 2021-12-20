import { URLS } from "./urls.js";

export function getCityData(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(urlBody => urlBody.json())
      .then(urlContent => {
        checkErrorCode(urlContent.cod) ? resolve(urlContent) : reject(urlContent)
      });
  });
};

export function getUrlByCity(cityName) {
  const url = `${URLS.WEATHER_URL.SERVER_URL}?q=${cityName}&appid=${URLS.WEATHER_URL.API_KEY}`;
  return url
}

export function checkErrorCode(code) {
  return code === 200
}