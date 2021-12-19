import { UI_ELEMENTS } from "./view.js";

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