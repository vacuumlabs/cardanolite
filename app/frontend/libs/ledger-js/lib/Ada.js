"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "utils", {
  enumerable: true,
  get: function get() {
    return _utils["default"];
  }
});
Object.defineProperty(exports, "cardano", {
  enumerable: true,
  get: function get() {
    return _cardano["default"];
  }
});
exports["default"] = exports.getErrorDescription = exports.ErrorCodes = exports.AddressTypeNibbles = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _hwTransport = require("@ledgerhq/hw-transport");

var _utils = _interopRequireWildcard(require("./utils"));

var _cardano = _interopRequireDefault(require("./cardano"));

var _ErrorMsgs;

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var CLA = 0xd7;
var INS = {
  GET_VERSION: 0x00,
  GET_SERIAL: 0x01,
  GET_EXT_PUBLIC_KEY: 0x10,
  DERIVE_ADDRESS: 0x11,
  SIGN_TX: 0x21,
  RUN_TESTS: 0xf0
};
var AddressTypeNibbles = {
  BASE: 0,
  POINTER: 4,
  ENTERPRISE: 6,
  BYRON: 8,
  REWARD: 14
};
exports.AddressTypeNibbles = AddressTypeNibbles;
var MetadataCodes = {
  SIGN_TX_METADATA_NO: 1,
  SIGN_TX_METADATA_YES: 2
};
var TxOutputTypeCodes = {
  SIGN_TX_OUTPUT_TYPE_ADDRESS: 1,
  SIGN_TX_OUTPUT_TYPE_ADDRESS_PARAMS: 2
};
var ErrorCodes = {
  ERR_STILL_IN_CALL: 0x6e04,
  // internal
  ERR_INVALID_DATA: 0x6e07,
  ERR_INVALID_BIP_PATH: 0x6e08,
  ERR_REJECTED_BY_USER: 0x6e09,
  ERR_REJECTED_BY_POLICY: 0x6e10,
  ERR_DEVICE_LOCKED: 0x6e11,
  ERR_UNSUPPORTED_ADDRESS_TYPE: 0x6e12,
  // Not thrown by ledger-app-cardano itself but other apps
  ERR_CLA_NOT_SUPPORTED: 0x6e00
};
exports.ErrorCodes = ErrorCodes;
var GH_ERRORS_LINK = "https://github.com/cardano-foundation/ledger-app-cardano/blob/master/src/errors.h";
var ErrorMsgs = (_ErrorMsgs = {}, (0, _defineProperty2["default"])(_ErrorMsgs, ErrorCodes.ERR_INVALID_DATA, "Invalid data supplied to Ledger"), (0, _defineProperty2["default"])(_ErrorMsgs, ErrorCodes.ERR_INVALID_BIP_PATH, "Invalid derivation path supplied to Ledger"), (0, _defineProperty2["default"])(_ErrorMsgs, ErrorCodes.ERR_REJECTED_BY_USER, "Action rejected by user"), (0, _defineProperty2["default"])(_ErrorMsgs, ErrorCodes.ERR_REJECTED_BY_POLICY, "Action rejected by Ledger's security policy"), (0, _defineProperty2["default"])(_ErrorMsgs, ErrorCodes.ERR_DEVICE_LOCKED, "Device is locked"), (0, _defineProperty2["default"])(_ErrorMsgs, ErrorCodes.ERR_CLA_NOT_SUPPORTED, "Wrong Ledger app"), (0, _defineProperty2["default"])(_ErrorMsgs, ErrorCodes.ERR_UNSUPPORTED_ADDRESS_TYPE, "Unsupported address type"), _ErrorMsgs);

var getErrorDescription = function getErrorDescription(statusCode) {
  var statusCodeHex = "0x".concat(statusCode.toString(16));
  var defaultMsg = "General error ".concat(statusCodeHex, ". Please consult ").concat(GH_ERRORS_LINK);
  return ErrorMsgs[statusCode] || defaultMsg;
}; // It can happen that we try to send a message to the device
// when the device thinks it is still in a middle of previous ADPU stream.
// This happens mostly if host does abort communication for some reason
// leaving ledger mid-call.
// In this case Ledger will respond by ERR_STILL_IN_CALL *and* resetting its state to
// default. We can therefore transparently retry the request.
// Note though that only the *first* request in an multi-APDU exchange should be retried.


exports.getErrorDescription = getErrorDescription;

var wrapRetryStillInCall = function wrapRetryStillInCall(fn) {
  return /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return fn.apply(void 0, _args);

          case 3:
            return _context.abrupt("return", _context.sent);

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](0);

            if (!(_context.t0 && _context.t0.statusCode && _context.t0.statusCode === ErrorCodes.ERR_STILL_IN_CALL)) {
              _context.next = 12;
              break;
            }

            _context.next = 11;
            return fn.apply(void 0, _args);

          case 11:
            return _context.abrupt("return", _context.sent);

          case 12:
            throw _context.t0;

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 6]]);
  }));
};

var wrapConvertError = function wrapConvertError(fn) {
  return /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var _len,
        args,
        _key,
        _args2 = arguments;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            for (_len = _args2.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = _args2[_key];
            }

            console.log(JSON.stringify(args));
            _context2.next = 5;
            return fn.apply(void 0, args);

          case 5:
            return _context2.abrupt("return", _context2.sent);

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](0);

            if (_context2.t0 && _context2.t0.statusCode) {
              // keep HwTransport.TransportStatusError
              // just override the message
              _context2.t0.message = "Ledger device: ".concat(getErrorDescription(_context2.t0.statusCode));
            }

            throw _context2.t0;

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 8]]);
  }));
};
/**
 * Cardano ADA API
 *
 * @example
 * import Ada from "@ledgerhq/hw-app-ada";
 * const ada = new Ada(transport);
 */


var Ada = /*#__PURE__*/function () {
  function Ada(transport) {
    var scrambleKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "ADA";
    (0, _classCallCheck2["default"])(this, Ada);
    this.transport = transport;
    this.methods = ["getVersion", "getSerial", "getExtendedPublicKey", "signTransaction", "deriveAddress", "showAddress"];
    this.transport.decorateAppAPIMethods(this, this.methods, scrambleKey);
    this.send = wrapConvertError(this.transport.send);
  }

  (0, _createClass2["default"])(Ada, [{
    key: "_getVersion",
    value: function () {
      var _getVersion2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        var _this = this;

        var _send, P1_UNUSED, P2_UNUSED, response, _response, major, minor, patch, flags_value, FLAG_IS_DEBUG, flags;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _send = function _send(p1, p2, data) {
                  return _this.send(CLA, INS.GET_VERSION, p1, p2, data).then(_utils["default"].stripRetcodeFromResponse);
                };

                P1_UNUSED = 0x00;
                P2_UNUSED = 0x00; // await setTimeout(() => console.log('ahoj'), 3000)

                _context3.next = 5;
                return wrapRetryStillInCall(_send)(P1_UNUSED, P2_UNUSED, _utils["default"].hex_to_buf(""));

              case 5:
                response = _context3.sent;

                _utils.Assert.assert(response.length == 4);

                _response = (0, _slicedToArray2["default"])(response, 4), major = _response[0], minor = _response[1], patch = _response[2], flags_value = _response[3];
                FLAG_IS_DEBUG = 1; //const FLAG_IS_HEADLESS = 2;

                flags = {
                  isDebug: (flags_value & FLAG_IS_DEBUG) == FLAG_IS_DEBUG
                };
                return _context3.abrupt("return", {
                  major: major,
                  minor: minor,
                  patch: patch,
                  flags: flags
                });

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function _getVersion() {
        return _getVersion2.apply(this, arguments);
      }

      return _getVersion;
    }()
    /**
     * Returns an object containing the app version.
     *
     * @returns {Promise<GetVersionResponse>} Result object containing the application version number.
     *
     * @example
     * const { major, minor, patch, flags } = await ada.getVersion();
     * console.log(`App version ${major}.${minor}.${patch}`);
     *
     */

  }, {
    key: "getVersion",
    value: function () {
      var _getVersion3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", this._getVersion());

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getVersion() {
        return _getVersion3.apply(this, arguments);
      }

      return getVersion;
    }()
  }, {
    key: "_isGetSerialSupported",
    value: function _isGetSerialSupported(version) {
      var major = parseInt(version.major);
      var minor = parseInt(version.minor);
      var patch = parseInt(version.patch);
      if (isNaN(major) || isNaN(minor) || isNaN(patch)) return false;

      if (major > 1) {
        return true;
      } else if (major == 1) {
        return minor >= 2;
      } else {
        return false;
      }
    }
    /**
     * Returns an object containing the device serial number.
     *
     * @returns {Promise<GetSerialResponse>} Result object containing the device serial number.
     *
     * @example
     * const { serial } = await ada.getSerial();
     * console.log(`Serial number ${serial}`);
     *
     */

  }, {
    key: "getSerial",
    value: function () {
      var _getSerial = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
        var _this2 = this;

        var version, _send, P1_UNUSED, P2_UNUSED, response, serial;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this._getVersion();

              case 2:
                version = _context5.sent;

                if (this._isGetSerialSupported(version)) {
                  _context5.next = 5;
                  break;
                }

                throw new Error("getSerial not supported by device firmware");

              case 5:
                _send = function _send(p1, p2, data) {
                  return _this2.send(CLA, INS.GET_SERIAL, p1, p2, data).then(_utils["default"].stripRetcodeFromResponse);
                };

                P1_UNUSED = 0x00;
                P2_UNUSED = 0x00;
                _context5.next = 10;
                return wrapRetryStillInCall(_send)(P1_UNUSED, P2_UNUSED, _utils["default"].hex_to_buf(""));

              case 10:
                response = _context5.sent;

                _utils.Assert.assert(response.length == 7);

                serial = _utils["default"].buf_to_hex(response);
                return _context5.abrupt("return", {
                  serial: serial
                });

              case 14:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getSerial() {
        return _getSerial.apply(this, arguments);
      }

      return getSerial;
    }()
    /**
     * Runs unit tests on the device (DEVEL app build only)
     *
     * @returns {Promise<void>}
     */

  }, {
    key: "runTests",
    value: function () {
      var _runTests = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return wrapRetryStillInCall(this.send)(CLA, INS.RUN_TESTS, 0x00, 0x00);

              case 2:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function runTests() {
        return _runTests.apply(this, arguments);
      }

      return runTests;
    }()
    /**
     * @description Get a public key from the specified BIP 32 path.
     *
     * @param {BIP32Path} indexes The path indexes. Path must begin with `44'/1815'/n'`, and may be up to 10 indexes long.
     * @return {Promise<GetExtendedPublicKeyResponse>} The public key with chaincode for the given path.
     *
     * @example
     * const { publicKey, chainCode } = await ada.getExtendedPublicKey([ HARDENED + 44, HARDENED + 1815, HARDENED + 1 ]);
     * console.log(publicKey);
     *
     */

  }, {
    key: "getExtendedPublicKey",
    value: function () {
      var _getExtendedPublicKey = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(path) {
        var _this3 = this;

        var _send, P1_UNUSED, P2_UNUSED, data, response, _utils$chunkBy, _utils$chunkBy2, publicKey, chainCode, rest;

        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _utils.Precondition.checkIsValidPath(path);

                _send = function _send(p1, p2, data) {
                  return _this3.send(CLA, INS.GET_EXT_PUBLIC_KEY, p1, p2, data).then(_utils["default"].stripRetcodeFromResponse);
                };

                P1_UNUSED = 0x00;
                P2_UNUSED = 0x00;
                data = _utils["default"].path_to_buf(path);
                _context7.next = 7;
                return wrapRetryStillInCall(_send)(P1_UNUSED, P2_UNUSED, data);

              case 7:
                response = _context7.sent;
                _utils$chunkBy = _utils["default"].chunkBy(response, [32, 32]), _utils$chunkBy2 = (0, _slicedToArray2["default"])(_utils$chunkBy, 3), publicKey = _utils$chunkBy2[0], chainCode = _utils$chunkBy2[1], rest = _utils$chunkBy2[2];

                _utils.Assert.assert(rest.length == 0);

                return _context7.abrupt("return", {
                  publicKeyHex: publicKey.toString("hex"),
                  chainCodeHex: chainCode.toString("hex")
                });

              case 11:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function getExtendedPublicKey(_x) {
        return _getExtendedPublicKey.apply(this, arguments);
      }

      return getExtendedPublicKey;
    }()
    /**
     * @description Gets an address from the specified BIP 32 path.
     *
     * @param {BIP32Path} indexes The path indexes. Path must begin with `44'/1815'/i'/(0 or 1)/j`, and may be up to 10 indexes long.
     * @return {Promise<DeriveAddressResponse>} The address for the given path.
     *
     * @throws 5001 - The path provided does not have the first 3 indexes hardened or 4th index is not 0 or 1
     * @throws 5002 - The path provided is less than 5 indexes
     * @throws 5003 - Some of the indexes is not a number
     *
     * TODO update error codes
     *
     * @example
     * const { address } = await ada.deriveAddress(
     *   0b1000, // byron address
     *   764824073,
     *   [ HARDENED | 44, HARDENED | 1815, HARDENED | 1, 0, 5 ],
     *   null
     *   null
     *   null
     * );
     *
     * @example
     * const { address } = await ada.deriveAddress(
     *   0b0000, // base address
     *   0x00,
     *   [ HARDENED | 1852, HARDENED | 1815, HARDENED | 0, 0, 5 ],
     *   [ HARDENED | 1852, HARDENED | 1815, HARDENED | 0, 2, 0 ]
     *   null
     *   null
     * );
     *
     */

  }, {
    key: "deriveAddress",
    value: function () {
      var _deriveAddress = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(addressTypeNibble, networkIdOrProtocolMagic, spendingPath) {
        var _this4 = this;

        var stakingPath,
            stakingKeyHashHex,
            stakingBlockchainPointer,
            _send,
            P1_RETURN,
            P2_UNUSED,
            data,
            response,
            _args8 = arguments;

        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                stakingPath = _args8.length > 3 && _args8[3] !== undefined ? _args8[3] : null;
                stakingKeyHashHex = _args8.length > 4 && _args8[4] !== undefined ? _args8[4] : null;
                stakingBlockchainPointer = _args8.length > 5 && _args8[5] !== undefined ? _args8[5] : null;

                _send = function _send(p1, p2, data) {
                  return _this4.send(CLA, INS.DERIVE_ADDRESS, p1, p2, data).then(_utils["default"].stripRetcodeFromResponse);
                };

                P1_RETURN = 0x01;
                P2_UNUSED = 0x00;
                data = _cardano["default"].serializeAddressInfo(addressTypeNibble, networkIdOrProtocolMagic, spendingPath, stakingPath, stakingKeyHashHex, stakingBlockchainPointer);
                _context8.next = 9;
                return _send(P1_RETURN, P2_UNUSED, data);

              case 9:
                response = _context8.sent;
                return _context8.abrupt("return", {
                  addressHex: response.toString('hex')
                });

              case 11:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function deriveAddress(_x2, _x3, _x4) {
        return _deriveAddress.apply(this, arguments);
      }

      return deriveAddress;
    }()
  }, {
    key: "showAddress",
    value: function () {
      var _showAddress = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(addressTypeNibble, networkIdOrProtocolMagic, spendingPath) {
        var _this5 = this;

        var stakingPath,
            stakingKeyHashHex,
            stakingBlockchainPointer,
            _send,
            P1_DISPLAY,
            P2_UNUSED,
            data,
            response,
            _args9 = arguments;

        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                stakingPath = _args9.length > 3 && _args9[3] !== undefined ? _args9[3] : null;
                stakingKeyHashHex = _args9.length > 4 && _args9[4] !== undefined ? _args9[4] : null;
                stakingBlockchainPointer = _args9.length > 5 && _args9[5] !== undefined ? _args9[5] : null;

                _send = function _send(p1, p2, data) {
                  return _this5.send(CLA, INS.DERIVE_ADDRESS, p1, p2, data).then(_utils["default"].stripRetcodeFromResponse);
                };

                P1_DISPLAY = 0x02;
                P2_UNUSED = 0x00;
                data = _cardano["default"].serializeAddressInfo(addressTypeNibble, networkIdOrProtocolMagic, spendingPath, stakingPath, stakingKeyHashHex, stakingBlockchainPointer);
                _context9.next = 9;
                return _send(P1_DISPLAY, P2_UNUSED, data);

              case 9:
                response = _context9.sent;

                _utils.Assert.assert(response.length == 0);

              case 11:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function showAddress(_x5, _x6, _x7) {
        return _showAddress.apply(this, arguments);
      }

      return showAddress;
    }()
  }, {
    key: "signTransaction",
    value: function () {
      var _signTransaction = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22(networkId, protocolMagic, inputs, outputs, feeStr, ttlStr, certificates, withdrawals, metadataHashHex) {
        var _this6 = this;

        var P1_STAGE_INIT, P1_STAGE_INPUTS, P1_STAGE_OUTPUTS, P1_STAGE_FEE, P1_STAGE_TTL, P1_STAGE_CERTIFICATES, P1_STAGE_WITHDRAWALS, P1_STAGE_METADATA, P1_STAGE_CONFIRM, P1_STAGE_WITNESSES, P2_UNUSED, delay, _send, signTx_init, signTx_addInput, signTx_addAddressOutput, signTx_addChangeOutput, signTx_addCertificate, signTx_addWithdrawal, signTx_setFee, signTx_setTtl, signTx_setMetadata, signTx_awaitConfirm, signTx_getWitness, witnessPathsSet, witnessPaths, _i, _arr, path, pathKey, _iterator, _step, input, _iterator2, _step2, output, _iterator3, _step3, certificate, _iterator4, _step4, withdrawal, _yield$signTx_awaitCo, txHashHex, witnesses, _i2, _witnessPaths, _path, witness;

        return _regenerator["default"].wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                delay = function _delay(ms) {
                  return new Promise(function (resolve) {
                    return setTimeout(resolve, ms);
                  });
                };

                //console.log("sign");
                P1_STAGE_INIT = 0x01;
                P1_STAGE_INPUTS = 0x02;
                P1_STAGE_OUTPUTS = 0x03;
                P1_STAGE_FEE = 0x04;
                P1_STAGE_TTL = 0x05;
                P1_STAGE_CERTIFICATES = 0x06;
                P1_STAGE_WITHDRAWALS = 0x07;
                P1_STAGE_METADATA = 0x08;
                P1_STAGE_CONFIRM = 0x09;
                P1_STAGE_WITNESSES = 0x0a;
                P2_UNUSED = 0x00;

                _send = /*#__PURE__*/function () {
                  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(p1, p2, data) {
                    return _regenerator["default"].wrap(function _callee10$(_context10) {
                      while (1) {
                        switch (_context10.prev = _context10.next) {
                          case 0:
                            return _context10.abrupt("return", delay(10000).then(function () {
                              return _this6.send(CLA, INS.SIGN_TX, p1, p2, data).then(_utils["default"].stripRetcodeFromResponse);
                            }));

                          case 1:
                          case "end":
                            return _context10.stop();
                        }
                      }
                    }, _callee10);
                  }));

                  return function _send(_x17, _x18, _x19) {
                    return _ref3.apply(this, arguments);
                  };
                }();

                signTx_init = /*#__PURE__*/function () {
                  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(networkId, protocolMagic, numInputs, numOutputs, numCertificates, numWithdrawals, numWitnesses, includeMetadata) {
                    var data, response;
                    return _regenerator["default"].wrap(function _callee11$(_context11) {
                      while (1) {
                        switch (_context11.prev = _context11.next) {
                          case 0:
                            data = Buffer.concat([_utils["default"].uint8_to_buf(networkId), _utils["default"].uint32_to_buf(protocolMagic), _utils["default"].uint8_to_buf(includeMetadata ? MetadataCodes.SIGN_TX_METADATA_YES : MetadataCodes.SIGN_TX_METADATA_NO), _utils["default"].uint32_to_buf(numInputs), _utils["default"].uint32_to_buf(numOutputs), _utils["default"].uint32_to_buf(numCertificates), _utils["default"].uint32_to_buf(numWithdrawals), _utils["default"].uint32_to_buf(numWitnesses)]);
                            _context11.next = 3;
                            return wrapRetryStillInCall(_send)(P1_STAGE_INIT, P2_UNUSED, data);

                          case 3:
                            response = _context11.sent;

                            _utils.Assert.assert(response.length == 0);

                          case 5:
                          case "end":
                            return _context11.stop();
                        }
                      }
                    }, _callee11);
                  }));

                  return function signTx_init(_x20, _x21, _x22, _x23, _x24, _x25, _x26, _x27) {
                    return _ref4.apply(this, arguments);
                  };
                }();

                signTx_addInput = /*#__PURE__*/function () {
                  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(input) {
                    var data, response;
                    return _regenerator["default"].wrap(function _callee12$(_context12) {
                      while (1) {
                        switch (_context12.prev = _context12.next) {
                          case 0:
                            data = Buffer.concat([_utils["default"].hex_to_buf(input.txHashHex), _utils["default"].uint32_to_buf(input.outputIndex)]);
                            console.log('input', JSON.stringify(input));
                            _context12.next = 4;
                            return _send(P1_STAGE_INPUTS, P2_UNUSED, data);

                          case 4:
                            response = _context12.sent;

                            _utils.Assert.assert(response.length == 0);

                          case 6:
                          case "end":
                            return _context12.stop();
                        }
                      }
                    }, _callee12);
                  }));

                  return function signTx_addInput(_x28) {
                    return _ref5.apply(this, arguments);
                  };
                }();

                signTx_addAddressOutput = /*#__PURE__*/function () {
                  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(addressHex, amountStr) {
                    var data, response;
                    return _regenerator["default"].wrap(function _callee13$(_context13) {
                      while (1) {
                        switch (_context13.prev = _context13.next) {
                          case 0:
                            data = Buffer.concat([_utils["default"].amount_to_buf(amountStr), _utils["default"].uint8_to_buf(TxOutputTypeCodes.SIGN_TX_OUTPUT_TYPE_ADDRESS), _utils["default"].hex_to_buf(addressHex)]);
                            console.log('output', JSON.stringify({
                              addressHex: addressHex,
                              amountStr: amountStr
                            }));
                            _context13.next = 4;
                            return _send(P1_STAGE_OUTPUTS, P2_UNUSED, data);

                          case 4:
                            response = _context13.sent;

                            _utils.Assert.assert(response.length == 0);

                          case 6:
                          case "end":
                            return _context13.stop();
                        }
                      }
                    }, _callee13);
                  }));

                  return function signTx_addAddressOutput(_x29, _x30) {
                    return _ref6.apply(this, arguments);
                  };
                }();

                signTx_addChangeOutput = /*#__PURE__*/function () {
                  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(addressTypeNibble, spendingPath, amountStr) {
                    var stakingPath,
                        stakingKeyHashHex,
                        stakingBlockchainPointer,
                        data,
                        response,
                        _args14 = arguments;
                    return _regenerator["default"].wrap(function _callee14$(_context14) {
                      while (1) {
                        switch (_context14.prev = _context14.next) {
                          case 0:
                            stakingPath = _args14.length > 3 && _args14[3] !== undefined ? _args14[3] : null;
                            stakingKeyHashHex = _args14.length > 4 && _args14[4] !== undefined ? _args14[4] : null;
                            stakingBlockchainPointer = _args14.length > 5 && _args14[5] !== undefined ? _args14[5] : null;
                            data = Buffer.concat([_utils["default"].amount_to_buf(amountStr), _utils["default"].uint8_to_buf(TxOutputTypeCodes.SIGN_TX_OUTPUT_TYPE_ADDRESS_PARAMS), _cardano["default"].serializeAddressInfo(addressTypeNibble, addressTypeNibble == AddressTypeNibbles.BYRON ? protocolMagic : networkId, spendingPath, stakingPath, stakingKeyHashHex, stakingBlockchainPointer)]);
                            console.log('change_output', JSON.stringify({
                              addressTypeNibble: addressTypeNibble,
                              spendingPath: spendingPath,
                              amountStr: amountStr,
                              stakingPath: stakingPath,
                              stakingKeyHashHex: stakingKeyHashHex,
                              stakingBlockchainPointer: stakingBlockchainPointer
                            }));
                            _context14.next = 7;
                            return _send(P1_STAGE_OUTPUTS, P2_UNUSED, data);

                          case 7:
                            response = _context14.sent;

                            _utils.Assert.assert(response.length == 0);

                          case 9:
                          case "end":
                            return _context14.stop();
                        }
                      }
                    }, _callee14);
                  }));

                  return function signTx_addChangeOutput(_x31, _x32, _x33) {
                    return _ref7.apply(this, arguments);
                  };
                }();

                signTx_addCertificate = /*#__PURE__*/function () {
                  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(type, path, poolKeyHashHex) {
                    var dataFields, data, response;
                    return _regenerator["default"].wrap(function _callee15$(_context15) {
                      while (1) {
                        switch (_context15.prev = _context15.next) {
                          case 0:
                            dataFields = [_utils["default"].uint8_to_buf(type), _utils["default"].path_to_buf(path)];

                            if (poolKeyHashHex != null) {
                              dataFields.push(_utils["default"].hex_to_buf(poolKeyHashHex));
                            }

                            console.log('certificate', JSON.stringify({
                              type: type,
                              path: path,
                              poolKeyHashHex: poolKeyHashHex
                            }));
                            data = Buffer.concat(dataFields);
                            _context15.next = 6;
                            return _send(P1_STAGE_CERTIFICATES, P2_UNUSED, data);

                          case 6:
                            response = _context15.sent;

                            _utils.Assert.assert(response.length == 0);

                          case 8:
                          case "end":
                            return _context15.stop();
                        }
                      }
                    }, _callee15);
                  }));

                  return function signTx_addCertificate(_x34, _x35, _x36) {
                    return _ref8.apply(this, arguments);
                  };
                }();

                signTx_addWithdrawal = /*#__PURE__*/function () {
                  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(path, amountStr) {
                    var data, response;
                    return _regenerator["default"].wrap(function _callee16$(_context16) {
                      while (1) {
                        switch (_context16.prev = _context16.next) {
                          case 0:
                            data = Buffer.concat([_utils["default"].amount_to_buf(amountStr), _utils["default"].path_to_buf(path)]);
                            console.log('withdrawal', JSON.stringify({
                              path: path,
                              amountStr: amountStr
                            }));
                            _context16.next = 4;
                            return _send(P1_STAGE_WITHDRAWALS, P2_UNUSED, data);

                          case 4:
                            response = _context16.sent;

                            _utils.Assert.assert(response.length == 0);

                          case 6:
                          case "end":
                            return _context16.stop();
                        }
                      }
                    }, _callee16);
                  }));

                  return function signTx_addWithdrawal(_x37, _x38) {
                    return _ref9.apply(this, arguments);
                  };
                }();

                signTx_setFee = /*#__PURE__*/function () {
                  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(feeStr) {
                    var data, response;
                    return _regenerator["default"].wrap(function _callee17$(_context17) {
                      while (1) {
                        switch (_context17.prev = _context17.next) {
                          case 0:
                            data = Buffer.concat([_utils["default"].amount_to_buf(feeStr)]);
                            console.log('fee', JSON.stringify({
                              feeStr: feeStr
                            }));
                            _context17.next = 4;
                            return _send(P1_STAGE_FEE, P2_UNUSED, data);

                          case 4:
                            response = _context17.sent;

                            _utils.Assert.assert(response.length == 0);

                          case 6:
                          case "end":
                            return _context17.stop();
                        }
                      }
                    }, _callee17);
                  }));

                  return function signTx_setFee(_x39) {
                    return _ref10.apply(this, arguments);
                  };
                }();

                signTx_setTtl = /*#__PURE__*/function () {
                  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(ttlStr) {
                    var data, response;
                    return _regenerator["default"].wrap(function _callee18$(_context18) {
                      while (1) {
                        switch (_context18.prev = _context18.next) {
                          case 0:
                            data = Buffer.concat([_utils["default"].amount_to_buf(ttlStr)]);
                            console.log('tll', JSON.stringify({
                              ttlStr: ttlStr
                            }));
                            _context18.next = 4;
                            return _send(P1_STAGE_TTL, P2_UNUSED, data);

                          case 4:
                            response = _context18.sent;

                            _utils.Assert.assert(response.length == 0);

                          case 6:
                          case "end":
                            return _context18.stop();
                        }
                      }
                    }, _callee18);
                  }));

                  return function signTx_setTtl(_x40) {
                    return _ref11.apply(this, arguments);
                  };
                }();

                signTx_setMetadata = /*#__PURE__*/function () {
                  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19(metadataHashHex) {
                    var data, response;
                    return _regenerator["default"].wrap(function _callee19$(_context19) {
                      while (1) {
                        switch (_context19.prev = _context19.next) {
                          case 0:
                            data = _utils["default"].hex_to_buf(metadataHashHex);
                            _context19.next = 3;
                            return _send(P1_STAGE_METADATA, P2_UNUSED, data);

                          case 3:
                            response = _context19.sent;

                            _utils.Assert.assert(response.length == 0);

                          case 5:
                          case "end":
                            return _context19.stop();
                        }
                      }
                    }, _callee19);
                  }));

                  return function signTx_setMetadata(_x41) {
                    return _ref12.apply(this, arguments);
                  };
                }();

                signTx_awaitConfirm = /*#__PURE__*/function () {
                  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20() {
                    var response;
                    return _regenerator["default"].wrap(function _callee20$(_context20) {
                      while (1) {
                        switch (_context20.prev = _context20.next) {
                          case 0:
                            _context20.next = 2;
                            return _send(P1_STAGE_CONFIRM, P2_UNUSED, _utils["default"].hex_to_buf(""));

                          case 2:
                            response = _context20.sent;
                            return _context20.abrupt("return", {
                              txHashHex: response.toString("hex")
                            });

                          case 4:
                          case "end":
                            return _context20.stop();
                        }
                      }
                    }, _callee20);
                  }));

                  return function signTx_awaitConfirm() {
                    return _ref13.apply(this, arguments);
                  };
                }();

                signTx_getWitness = /*#__PURE__*/function () {
                  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21(path) {
                    var data, response;
                    return _regenerator["default"].wrap(function _callee21$(_context21) {
                      while (1) {
                        switch (_context21.prev = _context21.next) {
                          case 0:
                            data = Buffer.concat([_utils["default"].path_to_buf(path)]);
                            _context21.next = 3;
                            return _send(P1_STAGE_WITNESSES, P2_UNUSED, data);

                          case 3:
                            response = _context21.sent;
                            return _context21.abrupt("return", {
                              path: path,
                              witnessSignatureHex: _utils["default"].buf_to_hex(response)
                            });

                          case 5:
                          case "end":
                            return _context21.stop();
                        }
                      }
                    }, _callee21);
                  }));

                  return function signTx_getWitness(_x42) {
                    return _ref14.apply(this, arguments);
                  };
                }(); // init
                //console.log("init");
                // for unique witness paths


                witnessPathsSet = new Set();
                witnessPaths = [];

                for (_i = 0, _arr = [].concat((0, _toConsumableArray2["default"])(inputs), (0, _toConsumableArray2["default"])(certificates), (0, _toConsumableArray2["default"])(withdrawals)); _i < _arr.length; _i++) {
                  path = _arr[_i].path;
                  pathKey = JSON.stringify(path);

                  if (!witnessPathsSet.has(pathKey)) {
                    witnessPathsSet.add(pathKey);
                    witnessPaths.push(path);
                  }
                }

                _context22.next = 29;
                return signTx_init(networkId, protocolMagic, inputs.length, outputs.length, certificates.length, withdrawals.length, witnessPaths.length, metadataHashHex != null);

              case 29:
                // inputs
                //console.log("inputs");
                _iterator = _createForOfIteratorHelper(inputs);
                _context22.prev = 30;

                _iterator.s();

              case 32:
                if ((_step = _iterator.n()).done) {
                  _context22.next = 38;
                  break;
                }

                input = _step.value;
                _context22.next = 36;
                return signTx_addInput(input);

              case 36:
                _context22.next = 32;
                break;

              case 38:
                _context22.next = 43;
                break;

              case 40:
                _context22.prev = 40;
                _context22.t0 = _context22["catch"](30);

                _iterator.e(_context22.t0);

              case 43:
                _context22.prev = 43;

                _iterator.f();

                return _context22.finish(43);

              case 46:
                // outputs
                //console.log("outputs");
                _iterator2 = _createForOfIteratorHelper(outputs);
                _context22.prev = 47;

                _iterator2.s();

              case 49:
                if ((_step2 = _iterator2.n()).done) {
                  _context22.next = 64;
                  break;
                }

                output = _step2.value;

                if (!output.addressHex) {
                  _context22.next = 56;
                  break;
                }

                _context22.next = 54;
                return signTx_addAddressOutput(output.addressHex, output.amountStr);

              case 54:
                _context22.next = 62;
                break;

              case 56:
                if (!output.spendingPath) {
                  _context22.next = 61;
                  break;
                }

                _context22.next = 59;
                return signTx_addChangeOutput(output.addressTypeNibble, output.spendingPath, output.amountStr, output.stakingPath, output.stakingKeyHashHex, output.stakingBlockchainPointer);

              case 59:
                _context22.next = 62;
                break;

              case 61:
                throw new Error("TODO");

              case 62:
                _context22.next = 49;
                break;

              case 64:
                _context22.next = 69;
                break;

              case 66:
                _context22.prev = 66;
                _context22.t1 = _context22["catch"](47);

                _iterator2.e(_context22.t1);

              case 69:
                _context22.prev = 69;

                _iterator2.f();

                return _context22.finish(69);

              case 72:
                _context22.next = 74;
                return signTx_setFee(feeStr);

              case 74:
                _context22.next = 76;
                return signTx_setTtl(ttlStr);

              case 76:
                if (!(certificates.length > 0)) {
                  _context22.next = 94;
                  break;
                }

                _iterator3 = _createForOfIteratorHelper(certificates);
                _context22.prev = 78;

                _iterator3.s();

              case 80:
                if ((_step3 = _iterator3.n()).done) {
                  _context22.next = 86;
                  break;
                }

                certificate = _step3.value;
                _context22.next = 84;
                return signTx_addCertificate(certificate.type, certificate.path, certificate.poolKeyHashHex);

              case 84:
                _context22.next = 80;
                break;

              case 86:
                _context22.next = 91;
                break;

              case 88:
                _context22.prev = 88;
                _context22.t2 = _context22["catch"](78);

                _iterator3.e(_context22.t2);

              case 91:
                _context22.prev = 91;

                _iterator3.f();

                return _context22.finish(91);

              case 94:
                if (!(withdrawals.length > 0)) {
                  _context22.next = 112;
                  break;
                }

                _iterator4 = _createForOfIteratorHelper(withdrawals);
                _context22.prev = 96;

                _iterator4.s();

              case 98:
                if ((_step4 = _iterator4.n()).done) {
                  _context22.next = 104;
                  break;
                }

                withdrawal = _step4.value;
                _context22.next = 102;
                return signTx_addWithdrawal(withdrawal.path, withdrawal.amountStr);

              case 102:
                _context22.next = 98;
                break;

              case 104:
                _context22.next = 109;
                break;

              case 106:
                _context22.prev = 106;
                _context22.t3 = _context22["catch"](96);

                _iterator4.e(_context22.t3);

              case 109:
                _context22.prev = 109;

                _iterator4.f();

                return _context22.finish(109);

              case 112:
                if (!(metadataHashHex != null)) {
                  _context22.next = 115;
                  break;
                }

                _context22.next = 115;
                return signTx_setMetadata(metadataHashHex);

              case 115:
                _context22.next = 117;
                return signTx_awaitConfirm();

              case 117:
                _yield$signTx_awaitCo = _context22.sent;
                txHashHex = _yield$signTx_awaitCo.txHashHex;
                //console.log("witnesses");
                witnesses = [];
                _i2 = 0, _witnessPaths = witnessPaths;

              case 121:
                if (!(_i2 < _witnessPaths.length)) {
                  _context22.next = 130;
                  break;
                }

                _path = _witnessPaths[_i2];
                _context22.next = 125;
                return signTx_getWitness(_path);

              case 125:
                witness = _context22.sent;
                witnesses.push(witness);

              case 127:
                _i2++;
                _context22.next = 121;
                break;

              case 130:
                return _context22.abrupt("return", {
                  txHashHex: txHashHex,
                  witnesses: witnesses
                });

              case 131:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22, null, [[30, 40, 43, 46], [47, 66, 69, 72], [78, 88, 91, 94], [96, 106, 109, 112]]);
      }));

      function signTransaction(_x8, _x9, _x10, _x11, _x12, _x13, _x14, _x15, _x16) {
        return _signTransaction.apply(this, arguments);
      }

      return signTransaction;
    }()
  }]);
  return Ada;
}(); // reexport


exports["default"] = Ada;
//# sourceMappingURL=Ada.js.map