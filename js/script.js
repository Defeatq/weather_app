import { UI_ELEMENTS } from "./view.js";
import { locationStorage } from "./storage.js";

const URLS = {
  WEATHER_URL: {
    SERVER_URL: 'https://api.openweathermap.org/data/2.5/weather',
    API_KEY: 'f660a2fb1e4bad108d6160b7f58c555f&units=metric',
  },
  PICTURE_URL: {
    SERVER_URL: 'http://openweathermap.org/img/wn/',
    SIZE: '@4x.png',
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
        checkErrorCode(urlContent.cod) ? resolve(urlContent) : reject(urlContent)
      });
  });
};

function fillNowDisplay(cityName, temperature, weatherIconId = `url(icon/icons8-cloud-961.svg)`) {
  UI_ELEMENTS.TABS.NOW.TEMPERATURE.textContent = temperature + '°';
  UI_ELEMENTS.TABS.NOW.WEATHER_ICON.style.backgroundImage = `url(${URLS.PICTURE_URL.SERVER_URL}${weatherIconId}${URLS.PICTURE_URL.SIZE})`;
  UI_ELEMENTS.TABS.NOW.CITY_NAME.textContent = cityName;
  changeFavouriteButton(cityName)
}

function getUrlByCity(cityName) {
  const url = `${URLS.WEATHER_URL.SERVER_URL}?q=${cityName}&appid=${URLS.WEATHER_URL.API_KEY}`;
  return url
}

function checkErrorCode(code) {
  return code === 200
}

function isPlaceClicked(elem, className) {
  return elem.target.classList.contains(className)
}

function clearCityList(toRemove, list) {
  list.forEach((city) => {
    const currentCityName = city.textContent.trim();

    if (currentCityName === toRemove) {
      city.parentElement.remove();
      return
    }
  })
}

function changeFavouriteButton(cityName) {
  if (cityName in locationStorage) {
    UI_ELEMENTS.TABS.NOW.FAVOURITE_BUTTON.checked = true;
    return
  }

  UI_ELEMENTS.TABS.NOW.FAVOURITE_BUTTON.checked = false;
  return
}

function removeFromFavourites(elem) {
  const storageCityItem = elem.target.parentElement;
  const cityName = storageCityItem.firstElementChild.textContent.trim();

  delete locationStorage[cityName];
  changeFavouriteButton(cityName);
  storageCityItem.remove();
}

UI_ELEMENTS.SEARCH_FORM.addEventListener('submit', event => {
  event.preventDefault();

  const inputValue = event.target.firstElementChild.value;
  const cityUrl = getUrlByCity(inputValue);
  const cityData = getCityData(cityUrl);

  cityData.then((data => {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const weatherIconId = data.weather[0].icon;
    
    fillNowDisplay(cityName, temperature, weatherIconId);
  }))
  .catch(errorData => {
    alert(errorData.message)
    fillNowDisplay(errorData.message, '0')
  });

  event.target.firstElementChild.value = '';
});

document.body.addEventListener('click', (checkElem) => {
  const isDeleteButton = isPlaceClicked(checkElem, 'history__close')
  const isFavouriteButton = isPlaceClicked(checkElem, 'now__favourite');
  const isSavedCity = isPlaceClicked(checkElem, 'history__text');

  if (isDeleteButton) {
    const cityName = checkElem.target.parentElement.firstElementChild.textContent.trim();
    removeFromFavourites(checkElem);
    changeFavouriteButton(cityName);
  }

  if (isFavouriteButton) {
    const isLiked = checkElem.target.checked;
    const cityName = checkElem.target.parentElement.firstElementChild.textContent.trim();

    if (isLiked) {
      getCityData(getUrlByCity(cityName))
        .then(data => locationStorage[cityName] = data);

      UI_ELEMENTS.HISTORY.insertAdjacentHTML('beforeend', `
        <div class="history__element font-style">
          <div class="history__text">
            ${cityName}
          </div>
          <button class="history__close"></button>
        </div>`);
    } else {
      const historyList = document.querySelectorAll('.history__text');
      delete locationStorage[cityName];
      clearCityList(cityName, historyList)
    }
  }

  if (isSavedCity) {
    const cityName = checkElem.target.textContent.trim();
    const cityData = locationStorage[cityName]

    fillNowDisplay(cityData.name, Math.round(cityData.main.temp), cityData.weather[0].icon);
  }
});