export const fetchCountries = searchKey => {
  return fetch(
    `https://restcountries.com/v3.1/name/${searchKey}?fields=name,capital,population,languages,flags`
  ).then(r => {
    if (r.status === 200) {
      return r.json();
    }

    if (r.status === 404) {
      return Promise.reject('not found');
    }
  });
};
