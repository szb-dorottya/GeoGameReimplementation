import {Platform} from 'react-native';

/**
 * @param {string[]} arr
 * @returns {string[]}
 */
export const shuffle = arr => {
  var i, j, temp;
  for (i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  return arr;
};

/**
 * @param {number} seconds
 * @returns {string}
 */
export const getDurationString = seconds => {
  var minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  minutes = minutes % 60;

  const indexOfDot = seconds.toString().indexOf('.');
  const twoDecimalsIndex = 3;

  var stringSec =
    seconds.toString().substr(0, indexOfDot).length === 2
      ? `${seconds.toString().substr(0, indexOfDot + twoDecimalsIndex)}`
      : `0${seconds.toString().substr(0, indexOfDot + twoDecimalsIndex)}`;
  var minutesString =
    minutes.toString().length === 2 ? `${minutes}` : `0${minutes}`;

  return `${minutesString}:${stringSec}`;
};

/**
 * @param {number} number
 * @returns {string}
 */
export const formatNumber = number => {
  return Platform.OS === 'ios'
    ? Intl.NumberFormat().format(number).toString()
    : formatNumberForAndroid(number);
};

/**
 * @param {number} number
 * @returns {string}
 */
const formatNumberForAndroid = number => {
  var resultNumberAsString = '';

  if (number.toString().length <= 3) {
    return number.toString();
  }

  while (parseInt((number / 1000).toString(), 10) !== 0) {
    const rest = number % 1000;
    number = parseInt((number / 1000).toString(), 10);
    if (number.toString().length > 3) {
      resultNumberAsString = `.${rest}${resultNumberAsString}`;
    } else {
      resultNumberAsString = `${number}.${rest}${resultNumberAsString}`;
      break;
    }
  }

  return resultNumberAsString;
};
