export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateRequired = (fields) => {
  return Object.entries(fields).every(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      throw new Error(`${key} is required`);
    }
    return true;
  });
};