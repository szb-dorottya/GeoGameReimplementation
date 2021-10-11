const BASE_URL = 'https://restcountries.com/v2';

/**
 * @param {string} region
 * @returns {Promise<SuccessResponseType<Country[]>|ErrorResponseType>}
 */
export const getCountriesOfRegion = async region => {
  try {
    const countries = await fetch(`${BASE_URL}/continent/${region}`);
    const resp = await countries.json();

    if (resp.status !== undefined) {
      return {success: false, message: resp.message};
    }

    return {success: true, data: resp};
  } catch (error) {
    return {success: false, message: error.toString()};
  }
};

/**
 * @param {string} code
 * @returns {Promise<SuccessResponseType<Country>|ErrorResponseType>}
 */
export const getCountryDetailsByCode = async code => {
  try {
    const details = await fetch(`${BASE_URL}/alpha/${code}`);
    const resp = await details.json();

    if (resp.status !== undefined) {
      return {success: false, message: resp.message};
    }

    return {success: true, data: resp};
  } catch (error) {
    return {success: false, message: error.toString()};
  }
};
