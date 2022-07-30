import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

// as before:
// - 'use strict';
// - iife
// - dom ready
// - main function

const fetchCountries = searchKey =>
  fetch(
    `https://restcountries.com/v3.1/name/${searchKey}?fields=name,capital,population,languages,flags`
  );

// It's not something global, but rather specific to once function
const DEBOUNCE_DELAY = 300;

// Much better
// It's kind of a hungarian notation, not good ;)
const refs = {
  countriesListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
  countryInputEl: document.querySelector('#search-box'),
};

const getCountryName = e => e.target.value.trim().toLowerCase();

const getCountriesArr = r => {
  if (r.status === 200) {
    return r.json();
  }

  if (r.status === 404) {
    return Promise.reject('not found');
  }
  // Here should be other errors
};

// This function has to be decomposed even further
const renderSearchResultMarkup = countriesArr => {
  if (countriesArr.length > 10) {
    return Promise.reject('too many');
  }

  if (countriesArr.length > 1) {
    return {
      // As you not using TS, it's better to have CONSTs for types
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
    // Why not just innerHTML?
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
  // As you not using TS, it's better to have CONSTs for error types
  // Consider using map for error type to handler instead
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

  // In real life it would be nice to have response validation as well
  fetchCountries(searchedCountry)
    .then(getCountriesArr)
    .then(renderSearchResultMarkup)
    .then(addSearchResult)
    .catch(errorsHandler);
};

// I would think about debouncing fetch instead
refs.countryInputEl.addEventListener(
  'input',
  debounce(doSearch, DEBOUNCE_DELAY)
);

// Overall MUTCH better!
