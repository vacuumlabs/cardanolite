"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.str_to_path = str_to_path;
exports.serializeAddressInfo = serializeAddressInfo;
exports["default"] = void 0;

var _utils = _interopRequireWildcard(require("./utils"));

var _Ada = require("./Ada");

var HARDENED = 0x80000000;

function parseBIP32Index(str) {
  var base = 0;

  if (str.endsWith("'")) {
    str = str.slice(0, -1);
    base = HARDENED;
  }

  var i = _utils["default"].safe_parseInt(str);

  _utils.Precondition.check(i >= 0);

  _utils.Precondition.check(i < HARDENED);

  return base + i;
}

function str_to_path(data) {
  _utils.Precondition.checkIsString(data);

  _utils.Precondition.check(data.length > 0);

  return data.split("/").map(parseBIP32Index);
}

function serializeAddressInfo(addressTypeNibble, networkIdOrProtocolMagic, spendingPath) {
  var stakingPath = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var stakingKeyHashHex = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var stakingBlockchainPointer = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

  _utils.Precondition.checkIsUint8(addressTypeNibble << 4);

  var addressTypeNibbleBuf = _utils["default"].uint8_to_buf(addressTypeNibble);

  var networkIdOrProtocolMagicBuf;

  if (addressTypeNibble == _Ada.AddressTypeNibbles.BYRON) {
    _utils.Precondition.checkIsUint32(networkIdOrProtocolMagic);

    networkIdOrProtocolMagicBuf = _utils["default"].uint32_to_buf(networkIdOrProtocolMagic);
  } else {
    _utils.Precondition.checkIsUint8(networkIdOrProtocolMagic);

    networkIdOrProtocolMagicBuf = _utils["default"].uint8_to_buf(networkIdOrProtocolMagic);
  }

  _utils.Precondition.checkIsValidPath(spendingPath);

  var spendingPathBuf = _utils["default"].path_to_buf(spendingPath);

  var stakingChoices = {
    NO_STAKING: 0x11,
    STAKING_KEY_PATH: 0x22,
    STAKING_KEY_HASH: 0x33,
    BLOCKCHAIN_POINTER: 0x44
  };
  // serialize staking info
  var stakingChoice;
  var stakingInfoBuf;

  if (!stakingPath && !stakingKeyHashHex && !stakingBlockchainPointer) {
    stakingChoice = stakingChoices.NO_STAKING;
    stakingInfoBuf = Buffer.alloc(0);
  } else if (stakingPath && !stakingKeyHashHex && !stakingBlockchainPointer) {
    stakingChoice = stakingChoices.STAKING_KEY_PATH;

    _utils.Precondition.checkIsValidPath(stakingPath);

    stakingInfoBuf = _utils["default"].path_to_buf(stakingPath);
  } else if (!stakingPath && stakingKeyHashHex && !stakingBlockchainPointer) {
    var stakingKeyHash = _utils["default"].hex_to_buf(stakingKeyHashHex);

    stakingChoice = stakingChoices.STAKING_KEY_HASH;

    _utils.Precondition.check(stakingKeyHash.length == 28); // TODO some global constant for key hash length


    stakingInfoBuf = stakingKeyHash;
  } else if (!stakingPath && !stakingKeyHashHex && stakingBlockchainPointer) {
    stakingChoice = stakingChoices.BLOCKCHAIN_POINTER;
    stakingInfoBuf = Buffer.alloc(3 * 4); // 3 x uint32

    _utils.Precondition.checkIsUint32(stakingBlockchainPointer.blockIndex);

    stakingInfoBuf.writeUInt32BE(stakingBlockchainPointer.blockIndex, 0);

    _utils.Precondition.checkIsUint32(stakingBlockchainPointer.txIndex);

    stakingInfoBuf.writeUInt32BE(stakingBlockchainPointer.txIndex, 4);

    _utils.Precondition.checkIsUint32(stakingBlockchainPointer.certificateIndex);

    stakingInfoBuf.writeUInt32BE(stakingBlockchainPointer.certificateIndex, 8);
  } else {
    throw new Error("Invalid staking info");
  }

  var stakingChoiceBuf = Buffer.from([stakingChoice]);
  return Buffer.concat([addressTypeNibbleBuf, networkIdOrProtocolMagicBuf, spendingPathBuf, stakingChoiceBuf, stakingInfoBuf]);
}

var _default = {
  HARDENED: HARDENED,
  str_to_path: str_to_path,
  serializeAddressInfo: serializeAddressInfo
};
exports["default"] = _default;
//# sourceMappingURL=cardano.js.map