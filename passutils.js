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

function validateInput(value, name) {
  if (typeof value !== "number") {
    throw new TypeError(`${name} must be a number`);
  }
  if (value <= 0) {
    throw new RangeError(`${name} must be greater than 0`);
  }
}

function generatePassword(length, options = {}) {
  validateInput(length, "Password length");
  const {
    uppercase: useUpper = true,
    lowercase: useLower = true,
    numbers: useNumbers = true,
    symbols: useSymbols = true,
    similar: useSimilar = true,
    exclude = "",
  } = options;

  let possibleCharacters = "";
  if (useLower) possibleCharacters += lowercase;
  if (useUpper) possibleCharacters += uppercase;
  if (useNumbers) possibleCharacters += numbers;
  if (useSymbols) possibleCharacters += symbols;

  if (exclude) {
    const excludeRegex = new RegExp(`[${exclude.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}]`, "g");
    possibleCharacters = possibleCharacters.replace(excludeRegex, "");
  }

  if (!useSimilar) {
    possibleCharacters = possibleCharacters.replace(similar, "");
  }

  if (!possibleCharacters) {
    throw new RangeError("Character pool is empty. Enable at least one character type.");
  }

  let password = "";
  const bytes = randomBytes(length);

  for (let i = 0; i < length; i++) {
    password += possibleCharacters[bytes[i] % possibleCharacters.length];
  }
  return password;
}

function generateMultiplePasswords(amount, length, options = {}) {
  validateInput(length, "Password length");
  validateInput(amount, "Amount of passwords");
  const passwordArray = [];
  for (let i = 0; i < amount; i++) {
    passwordArray.push(generatePassword(length, options));
  }
  return passwordArray;
}

module.exports = { generatePassword, generateMultiplePasswords };
