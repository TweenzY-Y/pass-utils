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

function generatePassword(length, options = {}) {
  if (typeof length !== "number") {
    throw new TypeError("Password length must be a positive number");
  }
  if (length <= 0) {
    throw new RangeError("Password length must be greater than 0");
  }
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

  for (let index = 0; index < length; index++) {
    password += possibleCharacters[bytes[index] % possibleCharacters.length];
  }
  return password;
}
