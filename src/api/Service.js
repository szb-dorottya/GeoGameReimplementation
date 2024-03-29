import Config from 'react-native-config';

/**
 * @param {string} region
 * @returns {Promise<SuccessResponseType<CountryDTO[]>|ErrorResponseType>}
 */
export const fetchCountriesOfRegion = async region => {
  try {
    const countries = await fetch(
      `${Config.COUNTRY_BASE_URL}/continent/${region}`,
    );
    const resp = await countries.json();

    if (resp.message !== undefined) {
      return {success: false, message: resp.message};
    }

    return {success: true, data: resp};
  } catch (error) {
    return {success: false, message: error.toString()};
  }
};

/**
 * @param {string} code
 * @returns {Promise<SuccessResponseType<CountryDTO>|ErrorResponseType>}
 */
export const fetchCountryDetailsByCode = async code => {
  try {
    const details = await fetch(`${Config.COUNTRY_BASE_URL}/alpha/${code}`);
    const resp = await details.json();

    if (resp.message !== undefined) {
      return {success: false, message: resp.message};
    }

    return {success: true, data: resp};
  } catch (error) {
    return {success: false, message: error.toString()};
  }
};

/**
 * @param {Array<string>} borders
 * @returns {Promise<SuccessResponseType<CountryDTO[]>|ErrorResponseType>}
 */
export const fetchCountryBorders = async borders => {
  try {
    /**
     * @type {CountryDTO[]}
     */
    const bordersDetails = [];

    if (borders === undefined) {
      return {success: true, data: bordersDetails};
    }

    for (const item of borders) {
      const details = await fetchCountryDetailsByCode(item);

      if (details.success === true) {
        bordersDetails.push(details.data);
      } else {
        return {success: false, message: details.message};
      }
    }

    return {success: true, data: bordersDetails};
  } catch (error) {
    return {success: false, message: error.toString()};
  }
};

/**
 * @returns {Promise<SuccessResponseType<CountryDTO[]>|ErrorResponseType>}
 */
export const fetchAllRegionsCountries = async () => {
  try {
    const resp = await fetch(`${Config.COUNTRY_BASE_URL}/all`);
    const countries = await resp.json();

    if (countries.message === undefined) {
      return {success: true, data: countries};
    }

    return {success: false, message: countries.message};
  } catch (error) {
    return {success: false, message: error.toString()};
  }
};

/**
 * @param {string} currency
 * @returns {Promise<SuccessResponseType<ExchangeDTO>|ErrorResponseType>}
 */
export const fetchCurrencyData = async currency => {
  const resp = await fetch(
    `${Config.EXCHANGE_BASE_URL}/latest?access_key=${Config.API_KEY}&format=1&symbols=${currency}`,
  );
  const currencyData = await resp.json();

  if (currencyData.status !== undefined) {
    return {success: false, message: currencyData.message};
  }

  return {success: true, data: currencyData};
};
