import { TIMEOUT_SECOND } from "./config";

export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SECOND)]);
    const { data, message } = await res.json();
    if (!res.ok) throw new Error(`(${res.status}) ${message}`);
    return data;
  } catch (error) {
    throw error;
  }
}