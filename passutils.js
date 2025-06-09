// Possible characters

const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = '!@#$%^&*()+_-=}{[]|:;"/?.><,`~';
const similar = /[ilLI|`oO0]/g;

/**
 * Generates cryptographically secure random numbers.
 * @param {number} size - Number of random values to generate.
 * @returns {Uint32Array} An array of cryptographically secure random numbers.
 */
function randomBytes(size) {
  const arr = new Uint32Array(size);
  crypto.getRandomValues(arr);
  return arr;
}
/**
 * Randomly shuffles the characters in a string using the Fisher-Yates algorithm.
 * @param {string} str - The string to shuffle.
 * @returns {string} The shuffled string.
 * @throws {TypeError} If the input is not a string.
 */
function shuffle(str) {
  if (typeof str !== "string") {
    throw new TypeError("Shuffle function only accept string as an argument");
  }
  const arr = str.split("");
  const strLen = str.length;
  for (let i = strLen - 1; i > 0; i--) {
    const rnd = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[rnd]] = [arr[rnd], arr[i]];
  }
  return arr.join("");
}
/**
 * Generates a random string of a given length using a specified character pool.
 * @param {string} charPool - String of available characters to use.
 * @param {number} length - Desired length of the generated string.
 * @returns {string} Randomly generated string.
 */
function getRandomString(charPool, length) {
  const bytes = randomBytes(length);
  let str = "";
  for (let i = 0; i < length; i++) {
    str += charPool[bytes[i] % charPool.length];
  }
  return str;
}
/**
 * Validates that a given input is a number and meets a minimum value.
 * @param {number} value - The value to validate.
 * @param {number} minValue - Minimum allowed value.
 * @param {string} name - Name of the input for error messages.
 * @throws {TypeError|RangeError} If validation fails.
 */
function validateInput(value, minValue, name) {
  if (typeof value !== "number") {
    throw new TypeError(`${name} must be a number`);
  }
  if (value < minValue) {
    throw new RangeError(`${name} must be equal at least ${minValue}`);
  }
}
/**
 * Generates a random password based on provided options and character requirements.
 *
 * @param {number} length - Total length of the generated password. Must be at least the sum of all minimum character type requirements.
 * @param {object} [options={}] - Configuration object to customize the character types used in the password.
 * @param {boolean} [options.uppercase=true] - Include uppercase letters (A–Z) in the password.
 * @param {boolean} [options.lowercase=true] - Include lowercase letters (a–z) in the password.
 * @param {boolean} [options.numbers=true] - Include numeric digits (0–9) in the password.
 * @param {boolean} [options.symbols=true] - Include special characters (e.g., @, #, $, %, etc.) in the password.
 * @param {boolean} [options.similar=true] - Allow visually similar characters like `l`, `I`, `1`, `O`, and `0`. Set to `false` to exclude them.
 * @param {string} [options.exclude=""] - String of characters to explicitly exclude from the character pool.
 * @param {object} [requirements={}] - Enforces a minimum number of characters from specific categories.
 * @param {number} [requirements.minUpper=0] - Minimum number of uppercase letters required in the password.
 * @param {number} [requirements.minLower=0] - Minimum number of lowercase letters required in the password.
 * @param {number} [requirements.minNumbers=0] - Minimum number of numeric characters required in the password.
 * @param {number} [requirements.minSymbols=0] - Minimum number of special characters required in the password.
 * @returns {string} A randomly generated password that meets the specified configuration and requirements.
 * @throws {TypeError} If input types are invalid.
 * @throws {RangeError} If values are below allowed thresholds.
 * @throws {Error} If password requirements cannot be fulfilled.
 */
function generatePassword(length, options = {}, requirements = {}) {
  validateInput(length, 1, "Password length");
  const {
    uppercase: useUpper = true,
    lowercase: useLower = true,
    numbers: useNumbers = true,
    symbols: useSymbols = true,
    similar: useSimilar = true,
    exclude = "",
  } = options;

  const {
    minUpper: requiredUppercase = 0,
    minLower: requiredLowercase = 0,
    minNumbers: requiredNumbers = 0,
    minSymbols: requiredSymbols = 0,
  } = requirements;

  validateInput(requiredUppercase, 0, "Required uppercase characters");
  validateInput(requiredLowercase, 0, "Required lowercase characters");
  validateInput(requiredNumbers, 0, "Required number characters");
  validateInput(requiredSymbols, 0, "Required symbol characters");

  const requiredPasswordLength = requiredUppercase + requiredLowercase + requiredNumbers + requiredSymbols;
  if (requiredPasswordLength > length) {
    throw new Error(
      `Your password length is too short to meet your requirements. Change password length to at least ${requiredPasswordLength}`
    );
  }

  if (
    (!useUpper && requiredUppercase) ||
    (!useLower && requiredLowercase) ||
    (!useNumbers && requiredNumbers) ||
    (!useSymbols && requiredSymbols)
  ) {
    throw new Error("Your password options do not meet the requirements.");
  }

  let possibleCharacters = { lowercase: "", uppercase: "", numbers: "", symbols: "" };
  if (useLower) possibleCharacters.lowercase += lowercase;
  if (useUpper) possibleCharacters.uppercase += uppercase;
  if (useNumbers) possibleCharacters.numbers += numbers;
  if (useSymbols) possibleCharacters.symbols += symbols;

  if (exclude) {
    const excludeRegex = new RegExp(`[${exclude.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}]`, "g");
    for (const key in possibleCharacters) {
      possibleCharacters[key] = possibleCharacters[key].replace(excludeRegex, "");
    }
  }

  if (!useSimilar) {
    for (const key in possibleCharacters) {
      possibleCharacters[key] = possibleCharacters[key].replace(similar, "");
    }
  }
  const charSet =
    possibleCharacters.lowercase +
    possibleCharacters.uppercase +
    possibleCharacters.numbers +
    possibleCharacters.symbols;

  if (!charSet) {
    throw new RangeError("Character pool is empty. Enable at least one character type.");
  }
  if (
    (requiredLowercase > 0 && possibleCharacters.lowercase.length === 0) ||
    (requiredUppercase > 0 && possibleCharacters.uppercase.length === 0) ||
    (requiredNumbers > 0 && possibleCharacters.numbers.length === 0) ||
    (requiredSymbols > 0 && possibleCharacters.symbols.length === 0)
  ) {
    throw new Error(
      "You excluded characters that are required to generate a password with the specified requirements."
    );
  }
  let password = "";

  password += requirements.minLower ? getRandomString(possibleCharacters.lowercase, requiredLowercase) : "";
  password += requirements.minUpper ? getRandomString(possibleCharacters.uppercase, requiredUppercase) : "";
  password += requirements.minNumbers ? getRandomString(possibleCharacters.numbers, requiredNumbers) : "";
  password += requirements.minSymbols ? getRandomString(possibleCharacters.symbols, requiredSymbols) : "";

  password += getRandomString(charSet, length - requiredPasswordLength);
  return shuffle(password);
}
/**
 * Generates an array of random passwords based on provided options and character requirements.
 *
 * @param {number} amount - Total amount of passwords that will be generated.
 * @param {number} length - Total length of the generated password. Must be at least the sum of all minimum character type requirements.
 * @param {object} [options={}] - Configuration object to customize the character types used in the password.
 * @param {boolean} [options.uppercase=true] - Include uppercase letters (A–Z) in the password.
 * @param {boolean} [options.lowercase=true] - Include lowercase letters (a–z) in the password.
 * @param {boolean} [options.numbers=true] - Include numeric digits (0–9) in the password.
 * @param {boolean} [options.symbols=true] - Include special characters (e.g., @, #, $, %, etc.) in the password.
 * @param {boolean} [options.similar=true] - Allow visually similar characters like `l`, `I`, `1`, `O`, and `0`. Set to `false` to exclude them.
 * @param {string} [options.exclude=""] - String of characters to explicitly exclude from the character pool.
 * @param {object} [requirements={}] - Enforces a minimum number of characters from specific categories.
 * @param {number} [requirements.minUpper=0] - Minimum number of uppercase letters required in the password.
 * @param {number} [requirements.minLower=0] - Minimum number of lowercase letters required in the password.
 * @param {number} [requirements.minNumbers=0] - Minimum number of numeric characters required in the password.
 * @param {number} [requirements.minSymbols=0] - Minimum number of special characters required in the password.
 * @returns {string[]} A randomly generated array of passwords that meets the specified configuration and requirements.
 * @throws {TypeError} If input types are invalid.
 * @throws {RangeError} If values are below allowed thresholds.
 * @throws {Error} If password requirements cannot be fulfilled.
 */
function generateMultiplePasswords(amount, length, options = {}, requirements = {}) {
  validateInput(length, 1, "Password length");
  validateInput(amount, 1, "Amount of passwords");
  const passwordArray = [];
  for (let i = 0; i < amount; i++) {
    passwordArray.push(generatePassword(length, options, requirements));
  }
  return passwordArray;
}
module.exports = { generatePassword, generateMultiplePasswords };
