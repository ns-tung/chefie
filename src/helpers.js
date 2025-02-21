import { TIMEOUT_SECOND } from "./config";

export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const replaceUrlToHttps = function (url) {
  if (url.startsWith('http://')) return 'https' + url.substring(4);
  return url;
}

export const createIngredientError = function (message, index = undefined) {
  const error = new Error(message);
  index && (error.index = index);
  return error;
}

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

export const triggerHover = function (element, s) {
  element.classList.add('hover');
  setTimeout(() => element.classList.remove('hover'), s * 1000);
}

// export const getJSON = async function (url) {
//   try {
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SECOND)]);
//     const { data, message } = await res.json();
//     if (!res.ok) throw new Error(`(${res.status}) ${message}`);
//     return data;
//   } catch (error) {
//     throw error;
//   }
// }

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchData = uploadData ? fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(uploadData)
    }) : fetch(url);
    const res = await Promise.race([fetchData, timeout(TIMEOUT_SECOND)]);
    const { data, message } = await res.json();
    if (!res.ok) throw new Error(`(${res.status}) ${message}`);
    return data;
  } catch (error) {
    throw error;
  }
}

export const calculateDecimal = function (input) {
  try {
    if (input.includes(' ')) {
      let [integerPart, fractionPart] = input.split(' ');
      integerPart = parseFloat(integerPart);
      if (fractionPart.includes('/')) {
        let [numerator, denominator] = fractionPart.split('/');
        numerator = parseFloat(numerator);
        denominator = parseFloat(denominator);
        if (denominator > 0) {
          const result = +(numerator / denominator).toFixed(4) + integerPart;
          return +result;
        }
        throw new Error('Invalid fraction (denominator must be greater than 0)');
      } else { throw new Error('Wrong input format! Please use the correct format.'); }
    }

    if (input.includes('/')) {
      let [numerator, denominator] = input.split('/');
      numerator = parseFloat(numerator);
      denominator = parseFloat(denominator);

      if (denominator > 0) {
        const result = (numerator / denominator).toFixed(4);
        return +result;
      }
      throw new Error('Invalid fraction (denominator must be greater than 0)');
    }

    return +input;

  } catch (error) {
    throw error;
  }
}