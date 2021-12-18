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