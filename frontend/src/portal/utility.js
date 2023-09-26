import jwtDecode from "jwt-decode";

export const setToken = (key, value) => {
  const decode = jwtDecode(value);
  const item = {
    value,
    expiration: new Date(decode.exp),
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getToken = (key) => {
  const item = JSON.parse(localStorage.getItem(key));
  if (!item || new Date().getTime() > item.expiration) {
    localStorage.removeItem(key);
    return null;
  }
  return item && item.value;
};
