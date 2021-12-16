import { UI_ELEMENTS } from "./view.js";

const URLS = {
  WEATHER_URL: {
    SERVER_URL: 'https://api.openweathermap.org/data/2.5/weather',
    API_KEY: 'f660a2fb1e4bad108d6160b7f58c555f&units=metric',
  },
}

UI_ELEMENTS.TABS_LINKS.forEach(tab => {
  tab.addEventListener('click', () => {
    const isTabSelected = tab.classList.contains('selected');
    const tabName = tab.dataset.about;
    const tabContent = document.querySelector(`.${tabName}`);

    if (!isTabSelected) {
      clearTab(UI_ELEMENTS.TABS_LINKS);
      hideContent(UI_ELEMENTS.TABS_CONTENT);
      tab.classList.add('selected');
      tabContent.classList.remove('hide');
    };
  });
});

function clearTab(tabs) {
  tabs.forEach(tab => {
    tab.classList.remove('selected');
  });
};

function hideContent(tabsInner) {
  tabsInner.forEach(tabContent => {
    tabContent.classList.add('hide')
  });
};

function getCityData(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(urlBody => urlBody.json())
      .then(urlContent => {
        checkErrorCode(urlContent.cod) ? resolve(urlContent) : reject(urlContent);
      });
  });
};

function getUrlByCity(cityName) {
  const url = `${URLS.WEATHER_URL.SERVER_URL}?q=${cityName}&appid=${URLS.WEATHER_URL.API_KEY}`;
  return url
}

function checkErrorCode(code) {
  return code === 200
}

UI_ELEMENTS.SEARCH_FORM.addEventListener('submit', event => {
  event.preventDefault();

  const inputValue = event.target.firstElementChild.value;
  const cityUrl = getUrlByCity(inputValue);
  const cityData = getCityData(cityUrl);

  cityData.then((data => {
    const temperature = Math.round(data.main.temp);
    const cityName = data.name;
    const weatherIconId = data.weather[0].icon;

    UI_ELEMENTS.TABS.NOW.TEMPERATURE.textContent = temperature + '°';
    UI_ELEMENTS.TABS.NOW.WEATHER_ICON.style.backgroundImage = `url(http://openweathermap.org/img/wn/${weatherIconId}@2x.png)`;
    UI_ELEMENTS.TABS.NOW.CITY_NAME.textContent = cityName;
  }), (errorData) => {
    UI_ELEMENTS.TABS.NOW.TEMPERATURE.textContent = '0°';
    UI_ELEMENTS.TABS.NOW.WEATHER_ICON.style.backgroundImage = `url(../icon/icons8-cloud-961.svg)`
    UI_ELEMENTS.TABS.NOW.CITY_NAME.textContent = errorData.message;
  });
});