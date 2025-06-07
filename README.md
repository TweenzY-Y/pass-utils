# 🔐 pass-utils

> Secure, customizable password generator for Node.js — supports complexity rules, exclusions, and bulk generation.

[![npm version](https://img.shields.io/npm/v/pass-utils.svg)](https://www.npmjs.com/package/pass-utils)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Features

- ✅ Fully customizable password composition
- ✅ Specify minimum requirements (uppercase, lowercase, numbers, symbols)
- ✅ Exclude similar or specific characters
- ✅ Generate one or multiple passwords
- ✅ Uses `crypto.getRandomValues()` for secure randomness
- ✅ Zero dependencies

---

## Installation

```bash
npm install pass-utils
```
## Usage
```js
const { generatePassword } = require("pass-utils");

const password = generatePassword(16, {
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  similar: false,
  exclude: "aeiou",
}, {
  minUpper: 2,
  minLower: 4,
  minNumbers: 2,
  minSymbols: 2,
});

console.log(password); // Output: "Kf#7gR!cP2xMbL9q"
```

## Generating multiple passwords
```js
const { generateMultiplePasswords } = require("pass-utils");

const passwords = generateMultiplePasswords(5, 12, {
  symbols: false,
  similar: true,
}, {
  minUpper: 1,
  minLower: 3,
  minNumbers: 2,
});

console.log(passwords);
/*
Output:
[
  'gZ0rWx8BkpAf',
  'uzhB3yDA0wkd',
  'MkwbpZ08uhxy',
  '2WyuDfR6vhga',
  '3bHJw96zFqmt'
]
*/
```

## API

`generatePassword(length, options?, requirements?)`
| Parameter | Type | Description |
| :---         |     :---:      |          ---: |
| `length`   | `number`     | Length of the generated password    |
| `options`     | `object`       | Optional settings for character types and exclusions (default: all enabled)      |
| `requirements`     | `object`       | Optional requirements for minimum characters per type      |

**Options object**
| Parameter | Type | Default | Description|
| :---         |     :---:      |          :---: | ---: |
| `uppercase` | `boolean` | `true`  | Include uppercase letters                                  |
| `lowercase` | `boolean` | `true`  | Include lowercase letters                                  |
| `numbers`   | `boolean` | `true`  | Include numbers                                            |
| `symbols`   | `boolean` | `true`  | Include special characters                                 |
| `similar`   | `boolean` | `true`  | Allow similar-looking characters (like `O`, `0`, `l`, `1`) |
| `exclude`   | `string`  | `""`    | Custom string of characters to exclude                     |

**Requirements object**
| Key          | Type     | Default | Description                            |
| ------------ | -------- | ------- | -------------------------------------- |
| `minUpper`   | `number` | `0`     | Minimum number of uppercase characters |
| `minLower`   | `number` | `0`     | Minimum number of lowercase characters |
| `minNumbers` | `number` | `0`     | Minimum number of numeric characters   |
| `minSymbols` | `number` | `0`     | Minimum number of special characters   |

