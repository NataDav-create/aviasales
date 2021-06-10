'use strict';

const formSearch = document.querySelector('.form-search'),
  inputCitiesFrom = document.querySelector('.input__cities-from'),
  dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
  inputCitiesTo = document.querySelector('.input__cities-to'),
  dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
  inputDateDepart = document.querySelector('.input__date-depart');

const citiesApi = 'dataBase/cities.json',
  proxy = 'https://cors-anywhere.herokuapp.com/corsdemo',
  API_KEY = 'c47ed47d764d64e829f97849d356c300',
  calendar = 'http://min-prices.aviasales.ru/calendar_preload';

let city = [];

const getData = (url, callback) => {
  const request = new XMLHttpRequest();
  request.open('GEt', url);
  request.addEventListener('readystatechange', () => {
    if (request.readyState !== 4) return;
    if (request.status === 200) {
      callback(request.response)
    } else {
      console.error(request.status)
    }
  })
  request.send();
};



const showCity = (input, list) => {
  list.textContent = '';
  if (input.value !== '') {
    const filterCity = city.filter((item) => {
      const fixedItem = item.name.toLowerCase();
      return fixedItem.includes(input.value.toLowerCase())
    });
    filterCity.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'dropdown__city';
      li.textContent = item.name;
      list.append(li);
    });
  };
};

const selectCity = (e, input, list) => {
  const target = e.target;
  if (target.tagName.toLowerCase() === 'li') {
    input.value = target.textContent;
    list.textContent = '';
  }
};

const renderCheapDay = (cheapTicket) => {
  console.log(cheapTicket)
}

const renderCheapYear = (cheapTickets) => {
  console.log(cheapTickets)
};

const renderCheap = (data, date) => {
  const cheapTicketYear = JSON.parse(data).best_prices;
  const cheapTicketDay = cheapTicketYear.filter((item) => {
    return item.depart_date === date;
  });
  renderCheapDay(cheapTicketDay);
  renderCheapYear(cheapTicketYear)
}

inputCitiesFrom.addEventListener('input', () => {
  showCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
  showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener('click', (e) => {
  selectCity(e, inputCitiesFrom, dropdownCitiesFrom)
});

dropdownCitiesTo.addEventListener('click', e => {
  selectCity(e, inputCitiesTo, dropdownCitiesTo)
});

formSearch.addEventListener('submit', (e) => {
  e.preventDefault();

  const cityFrom = city.find((item) => inputCitiesFrom.value === item.name);
  const cityTo = city.find((item) => inputCitiesTo.value === item.name);

  const formData = {
    from: cityFrom.code,
    to: cityTo.code,
    when: inputDateDepart.value,
  }
  const requestData = '?depart_date=' + formData.when +
    '&origin=' + formData.from +
    '&destination=' + formData.to +
    '&one_way=true';

  getData(calendar + requestData, (response) => {
    renderCheap(response, formData.when);
  })
});

getData(citiesApi, (data) => {
  city = JSON.parse(data).filter(item => item.name)
});

// getData(calendar + '?depart_date=2021-06-29&origin=SVX&destination=KGD&one_way=true&token=' + API_KEY, (data) => {
//   const cheapTicket = JSON.parse(data).best_prices.filter(item => item.depart_date === '2021-06-29');
//   console.log(cheapTicket)
// })