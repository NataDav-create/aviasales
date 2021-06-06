'use strict';

const formSearch = document.querySelector('.form-search'),
  inputCitiesFrom = document.querySelector('.input__cities-from'),
  dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
  inputCitiesTo = document.querySelector('.input__cities-to'),
  dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
  inputDateDepart = document.querySelector('.input__date-depart');

const city = ['Moscow', 'Chelyabinsk', 'Minsk', 'Volgograd', 'Kaliningrad', 'Odessa', 'Samara', 'Magnitogorsk', 'Sochi', 'Krasnodar'];

const showCity = (input, list) => {
  list.textContent = '';
  if (input.value !== '') {
    const filterCity = city.filter((item) => {
      const fixedItem = item.toLowerCase();
      return fixedItem.includes(input.value.toLowerCase())
    });
    filterCity.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'dropdown__city';
      li.textContent = item;
      list.append(li);
    });
  };
};

inputCitiesFrom.addEventListener('input', () => {
  showCity(inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesFrom.addEventListener('click', (e) => {
  const target = e.target;
  if (target.tagName.toLowerCase() === 'li') {
    inputCitiesFrom.value = target.textContent;
    dropdownCitiesFrom.textContent = '';
  }
});