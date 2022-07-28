export default fetchCountries = searchKey =>
  fetch(
    `https://restcountries.com/v3.1/name/${searchKey}?fields=name,capital,population,languages,flags`
  );
