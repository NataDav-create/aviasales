'use strict';

const formSearch = document.querySelector('.form-search'),
  inputCitiesFrom = document.querySelector('.input__cities-from'),
  dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
  inputCitiesTo = document.querySelector('.input__cities-to'),
  dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
  inputDateDepart = document.querySelector('.input__date-depart'),
  cheapestTicket = document.getElementById('cheapest-ticket'),
  otherCheapTickets = document.getElementById('other-cheap-tickets');

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
      return fixedItem.startsWith(input.value.toLowerCase())
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

const getNameCity = (code) => {
  const objCity = city.find((item) => item.code === code);
  return objCity.name;
};

const getDate = (date) => {
  return new Date(date).toLocaleString('ru', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getChanges = (num) => {
  if (num) {
    return num === 1 ? 'With one stop' : 'with two stops';
  } else {
    return 'Without changing flights'
  }
};

const createCard = (data) => {
  const ticket = document.createElement('article');
  ticket.classList.add('ticket');

  let deep = '';
  if (data) {
    deep = `
    <h3 class="agent">${data.gate}</h3>
    <div class="ticket__wrapper">
      <div class="left-side">
        <a href="https://www.aviasales.ru" class="button button__buy">Buy for ${data.value}rub</a>
      </div>
      <div class="right-side">
          <div class="block-left">
             <div class="city__from">Departure from
               <span class="city__name">${getNameCity(data.origin)}</span>
             </div>
            <div class="date">${getDate(data.depart_date)}</div>
          </div>

          <div class="block-right">
           <div class="changes">${getChanges(data.number_of_changes)}</div>
           <div class="city__to">Arrival city:
             <span class="city__name">${getNameCity(data.destination)}</span>
            </div>
          </div>
      </div>
    </div>
    `;
  } else {
    deep = '<h3>Unfortunately there are no tickets</h3>'
  }

  ticket.insertAdjacentHTML('afterbegin', deep);
  return ticket;
};

const renderCheapDay = (cheapTicket) => {
  cheapestTicket.style.display = 'block';
  cheapestTicket.innerHTML = `<h2>The cheapest ticket for this date</h2>`;

  const ticket = createCard(cheapTicket[0]);
  cheapestTicket.append(ticket)
};

const renderCheapYear = (cheapTickets) => {
  otherCheapTickets.style.display = 'block';
  otherCheapTickets.innerHTML = `<h2>The cheapest ticket for another dates</h2>`;
  cheapTickets.sort((a, b) => a.value - b.value);
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
    from: cityFrom,
    to: cityTo,
    when: inputDateDepart.value,
  }
  if (formData.from && formData.to) {
    const requestData = '?depart_date=' + formData.when +
      '&origin=' + formData.from.code +
      '&destination=' + formData.to.code +
      '&one_way=true';

    getData(calendar + requestData, (response) => {
      renderCheap(response, formData.when);
    });
  } else {
    console.log('enter the correct city name')
  }

});

getData(citiesApi, (data) => {
  city = JSON.parse(data).filter(item => item.name);
  city.sort((a, b) => a.name > b.name);
  console.log(city)
});

// getData(calendar + '?depart_date=2021-06-29&origin=SVX&destination=KGD&one_way=true&token=' + API_KEY, (data) => {
//   const cheapTicket = JSON.parse(data).best_prices.filter(item => item.depart_date === '2021-06-29');
//   console.log(cheapTicket)
// })