export const setToken = (key, value) => {
  const item = {
    value,
    expiration: new Date().getTime() + 1 * 60 * 60 * 1000,
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
