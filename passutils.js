// Possible characters

const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = '!@#$%^&*()+_-=}{[]|:;"/?.><,`~';
const similar = /[ilLI|`oO0]/g;

function randomBytes(size) {
  const arr = new Uint32Array(size);
  crypto.getRandomValues(arr);
  return arr;
}
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
function getRandomString(charPool, length) {
  const bytes = randomBytes(length);
  let str = "";
  for (let i = 0; i < length; i++) {
    str += charPool[bytes[i] % charPool.length];
  }
  return str;
}
function validateInput(value, minValue, name) {
  if (typeof value !== "number") {
    throw new TypeError(`${name} must be a number`);
  }
  if (value < minValue) {
    throw new RangeError(`${name} must be equal at least ${minValue}`);
  }
}

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
