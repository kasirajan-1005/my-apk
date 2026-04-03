export function normalizeMobileNumber(value = '') {
  return String(value).replace(/\D/g, '').slice(-10);
}

export function isValidMobileNumber(value = '') {
  return /^\d{10}$/.test(normalizeMobileNumber(value));
}
