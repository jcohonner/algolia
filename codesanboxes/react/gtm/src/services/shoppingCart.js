const STORAGE_KEY = "shoppingCart";
const PURCHASE_KEY = "lastPurchase";

const readStorage = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore write errors in demo mode
  }
};

export const getCart = () => readStorage(STORAGE_KEY);

export const addToCart = (movie) => {
  if (!movie?.objectID) return;
  const list = getCart();
  const exists = list.some((item) => item.objectID === movie.objectID);
  if (exists) return;
  writeStorage(STORAGE_KEY, [...list, movie]);
};

export const clearCart = () => writeStorage(STORAGE_KEY, []);

export const savePurchase = (movies) => {
  writeStorage(PURCHASE_KEY, movies);
};

export const purchaseAll = (movies) => {
  savePurchase(getCart());
  clearCart();
};

export const getPurchase = () => readStorage(PURCHASE_KEY);
