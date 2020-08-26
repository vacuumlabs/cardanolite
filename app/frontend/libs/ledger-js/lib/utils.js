"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uint32_to_buf = uint32_to_buf;
exports.buf_to_uint32 = buf_to_uint32;
exports.uint8_to_buf = uint8_to_buf;
exports.hex_to_buf = hex_to_buf;
exports.buf_to_hex = buf_to_hex;
exports.path_to_buf = path_to_buf;
exports.chunkBy = chunkBy;
exports.stripRetcodeFromResponse = stripRetcodeFromResponse;
exports.buf_to_amount = buf_to_amount;
exports.amount_to_buf = amount_to_buf;
exports.base58_encode = base58_encode;
exports.base58_decode = base58_decode;
exports.bech32_encodeAddress = bech32_encodeAddress;
exports.bech32_decodeAddress = bech32_decodeAddress;
exports.safe_parseInt = safe_parseInt;
exports["default"] = exports.Assert = exports.Precondition = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _baseX = _interopRequireDefault(require("base-x"));

var _bech = _interopRequireDefault(require("bech32"));

var _Ada = require("./Ada");

var _hex_to_buf$buf_to_he;

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var bs58 = (0, _baseX["default"])(BASE58_ALPHABET);
var BECH32_ALPHABET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l"; // We use bs10 as an easy way to parse/encode amount strings

var bs10 = (0, _baseX["default"])("0123456789"); // Max supply in lovelace

var MAX_LOVELACE_SUPPLY_STR = ["45", "000", "000", "000", "000000"].join("");
var TESTNET_NETWORK_ID = 0x00;
var Precondition = {
  // Generic check
  check: function check(cond) {
    if (!cond) throw new Error("Precondition failed");
  },
  // Basic types
  checkIsString: function checkIsString(data) {
    Precondition.check(typeof data === "string");
  },
  checkIsInteger: function checkIsInteger(data) {
    Precondition.check(Number.isInteger(data));
  },
  checkIsArray: function checkIsArray(data) {
    Precondition.check(Array.isArray(data));
  },
  checkIsBuffer: function checkIsBuffer(data) {
    Precondition.check(Buffer.isBuffer(data));
  },
  // Extended checks
  checkIsUint32: function checkIsUint32(data) {
    Precondition.checkIsInteger(data);
    Precondition.check(data >= 0);
    Precondition.check(data <= 4294967295);
  },
  checkIsUint8: function checkIsUint8(data) {
    Precondition.checkIsInteger(data);
    Precondition.check(data >= 0);
    Precondition.check(data <= 255);
  },
  checkIsHexString: function checkIsHexString(data) {
    Precondition.checkIsString(data);
    Precondition.check(data.length % 2 == 0);
    Precondition.check(/^[0-9a-fA-F]*$/.test(data));
  },
  checkIsValidPath: function checkIsValidPath(path) {
    Precondition.checkIsArray(path);

    var _iterator = _createForOfIteratorHelper(path),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var x = _step.value;
        Precondition.checkIsUint32(x);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  },
  checkIsValidAmount: function checkIsValidAmount(amount) {
    Precondition.checkIsString(amount);
    Precondition.check(/^[0-9]*$/.test(amount)); // Length checks

    Precondition.check(amount.length > 0);
    Precondition.check(amount.length <= MAX_LOVELACE_SUPPLY_STR.length); // Leading zeros

    if (amount.length > 1) {
      Precondition.check(amount[0] != "0");
    } // less than max supply


    if (amount.length == MAX_LOVELACE_SUPPLY_STR.length) {
      // Note: this is string comparison!
      Precondition.check(amount <= MAX_LOVELACE_SUPPLY_STR);
    }
  },
  checkIsValidBase58: function checkIsValidBase58(data) {
    Precondition.checkIsString(data);

    var _iterator2 = _createForOfIteratorHelper(data),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var c = _step2.value;
        Precondition.check(BASE58_ALPHABET.includes(c));
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  },
  checkIsValidBech32Address: function checkIsValidBech32Address(data) {
    Precondition.checkIsString(data);
    Precondition.check(data.split("1").length == 2);

    var _iterator3 = _createForOfIteratorHelper(data.split("1")[1]),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var c = _step3.value;
        Precondition.check(BECH32_ALPHABET.includes(c));
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  }
};
exports.Precondition = Precondition;
var Assert = {
  assert: function assert(cond) {
    if (!cond) throw new Error("Assertion failed");
  }
};
exports.Assert = Assert;

function uint32_to_buf(value) {
  Precondition.checkIsUint32(value);
  var data = Buffer.alloc(4);
  data.writeUInt32BE(value, 0);
  return data;
}

function buf_to_uint32(data) {
  Precondition.check(data.length == 4);
  return data.readUIntBE(0, 4);
}

function uint8_to_buf(value) {
  Precondition.checkIsUint8(value);
  var data = Buffer.alloc(1);
  data.writeUInt8(value, 0);
  return data;
}

function hex_to_buf(data) {
  Precondition.checkIsHexString(data);
  return Buffer.from(data, "hex");
}

function buf_to_hex(data) {
  return data.toString("hex");
} // no buf_to_uint8


function path_to_buf(path) {
  Precondition.checkIsValidPath(path);
  var data = Buffer.alloc(1 + 4 * path.length);
  data.writeUInt8(path.length, 0);

  for (var i = 0; i < path.length; i++) {
    data.writeUInt32BE(path[i], 1 + i * 4);
  }

  return data;
}

var sum = function sum(arr) {
  return arr.reduce(function (x, y) {
    return x + y;
  }, 0);
};

function chunkBy(data, chunkLengths) {
  Precondition.checkIsBuffer(data);
  Precondition.checkIsArray(chunkLengths);

  var _iterator4 = _createForOfIteratorHelper(chunkLengths),
      _step4;

  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var len = _step4.value;
      Precondition.checkIsInteger(len);
      Precondition.check(len > 0);
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }

  Precondition.check(data.length <= sum(chunkLengths));
  var offset = 0;
  var result = [];
  var restLength = data.length - sum(chunkLengths);

  for (var _i = 0, _arr = [].concat((0, _toConsumableArray2["default"])(chunkLengths), [restLength]); _i < _arr.length; _i++) {
    var c = _arr[_i];
    result.push(data.slice(offset, offset + c));
    offset += c;
  }

  return result;
}

function stripRetcodeFromResponse(response) {
  Precondition.checkIsBuffer(response);
  Precondition.check(response.length >= 2);
  var L = response.length - 2;
  var retcode = response.slice(L, L + 2);
  if (retcode.toString("hex") != "9000") throw new Error("Invalid retcode ".concat(retcode.toString("hex")));
  return response.slice(0, L);
}

function buf_to_amount(data) {
  Precondition.checkIsBuffer(data);
  Precondition.check(data.length == 8);
  var encoded = bs10.encode(data); // Strip leading zeros

  return encoded.replace(/^0*(.)/, "$1");
}

function amount_to_buf(amount) {
  Precondition.checkIsValidAmount(amount);
  var data = bs10.decode(amount); // Amount should fit uin64_t

  Assert.assert(data.length <= 8);
  var padding = Buffer.alloc(8 - data.length);
  return Buffer.concat([padding, data]);
}

function base58_encode(data) {
  Precondition.checkIsBuffer(data);
  return bs58.encode(data);
}

function base58_decode(data) {
  Precondition.checkIsValidBase58(data);
  return bs58.decode(data);
}

function bech32_encodeAddress(data) {
  Precondition.checkIsBuffer(data);
  var networkId = data[0] & 15;

  var data5bit = _bech["default"].toWords(data);

  var MAX_HUMAN_ADDRESS_LENGTH = 150; // see cardano.h in https://github.com/vacuumlabs/ledger-app-cardano-shelley

  return _bech["default"].encode(getShelleyAddressPrefix(data), data5bit, MAX_HUMAN_ADDRESS_LENGTH);
} // based on https://github.com/cardano-foundation/CIPs/pull/6/files


function getShelleyAddressPrefix(data) {
  var result = "";
  var addressType = (data[0] & 240) >> 4;

  switch (addressType) {
    case _Ada.AddressTypeNibbles.REWARD:
      result = "stake";
      break;

    default:
      result = "addr";
  }

  var networkId = data[0] & 15;

  if (networkId === TESTNET_NETWORK_ID) {
    result += "_test";
  }

  return result;
}

function bech32_decodeAddress(data) {
  Precondition.checkIsValidBech32Address(data);

  var _bech32$decode = _bech["default"].decode(data, 1000),
      words = _bech32$decode.words;

  return Buffer.from(_bech["default"].fromWords(words));
}

function safe_parseInt(str) {
  Precondition.checkIsString(str);
  var i = parseInt(str); // Check that we parsed everything

  Precondition.check("" + i == str); // Could be invalid

  Precondition.check(!isNaN(i)); // Could still be float

  Precondition.checkIsInteger(i);
  return i;
}

var _default = (_hex_to_buf$buf_to_he = {
  hex_to_buf: hex_to_buf,
  buf_to_hex: buf_to_hex,
  uint32_to_buf: uint32_to_buf,
  buf_to_uint32: buf_to_uint32,
  // no pair for now
  uint8_to_buf: uint8_to_buf,
  // no pair for now
  path_to_buf: path_to_buf,
  safe_parseInt: safe_parseInt,
  amount_to_buf: amount_to_buf,
  buf_to_amount: buf_to_amount,
  base58_encode: base58_encode,
  base58_decode: base58_decode,
  bech32_encodeAddress: bech32_encodeAddress,
  bech32_decodeAddress: bech32_decodeAddress
}, (0, _defineProperty2["default"])(_hex_to_buf$buf_to_he, "safe_parseInt", safe_parseInt), (0, _defineProperty2["default"])(_hex_to_buf$buf_to_he, "chunkBy", chunkBy), (0, _defineProperty2["default"])(_hex_to_buf$buf_to_he, "stripRetcodeFromResponse", stripRetcodeFromResponse), _hex_to_buf$buf_to_he);

exports["default"] = _default;
//# sourceMappingURL=utils.js.map