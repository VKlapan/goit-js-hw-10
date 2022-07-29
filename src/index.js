import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  countriesListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
  countryInputEl: document.querySelector('#search-box'),
};

const getCountryName = e => e.target.value.trim().toLowerCase();

const renderSearchResultMarkup = countriesArr => {
  if (countriesArr.length > 10) {
    return Promise.reject('too many');
  }

  if (countriesArr.length > 1) {
    return {
      type: 'list',
      markup: countriesArr
        .map(
          country =>
            `<li><span><img src=${country.flags.svg} alt=""></span>${country.name.official}</li>`
        )
        .join(''),
    };
  }
  if (countriesArr.length === 1) {
    const country = countriesArr[0];
    return {
      type: 'details',
      markup: `
    <h2><span><img src=${country.flags.svg} alt=""></span>${
        country.name.official
      }</h2>
    <p>Capital: ${country.capital}</p>
    <p>Population: ${country.population}</p>
    <p>Languages: ${Object.values(country.languages)}</p>    
    `,
    };
  }
};

const clearResult = () => {
  refs.countryInfoEl.innerHTML = '';
  refs.countriesListEl.innerHTML = '';
};

const addSearchResult = searchResultMarkup => {
  clearResult();

  if (searchResultMarkup.type === 'list') {
    refs.countriesListEl.insertAdjacentHTML(
      'beforeend',
      searchResultMarkup.markup
    );
  } else if (searchResultMarkup.type === 'details') {
    refs.countryInfoEl.insertAdjacentHTML(
      'beforeend',
      searchResultMarkup.markup
    );
  }
};

const alarmToManyCountries = () => {
  clearResult();
  Notify.info('Too many matches found. Please enter a more specific name.');
};

const alarmNotFound = () => {
  clearResult();
  Notify.failure('Oops, there is no country with that name');
};

const errorsHandler = error => {
  if (error === 'not found') {
    alarmNotFound();
    return;
  }
  if (error === 'too many') {
    alarmToManyCountries();
    return;
  }
  console.log(error);
};

const doSearch = e => {
  const searchedCountry = getCountryName(e);

  if (searchedCountry === '') {
    clearResult();
    return;
  }

  fetchCountries(searchedCountry)
    .then(renderSearchResultMarkup)
    .then(addSearchResult)
    .catch(errorsHandler);
};

refs.countryInputEl.addEventListener(
  'input',
  debounce(doSearch, DEBOUNCE_DELAY)
);
