'use strict';

const BlenoSMP = require('bleno/lib/hci-socket/smp');
const crypto = require('bleno/lib/hci-socket/crypto');

const SMP_CID = 0x0006;

const SMP_PAIRING_REQUEST = 0x01;
const SMP_PAIRING_RESPONSE = 0x02;
const SMP_PAIRING_CONFIRM = 0x03;
const SMP_PAIRING_RANDOM = 0x04;
const SMP_PAIRING_FAILED = 0x05;
const SMP_ENCRYPT_INFO = 0x06;
const SMP_MASTER_IDENT = 0x07;

const SMP_UNSPECIFIED = 0x08;

class SMP extends BlenoSMP {
  constructor(options = {}) {
    super(options.aclStream, options.localAddressType, options.localAddress, options.remoteAddressType, options.remoteAddress);

    this._oob = !!options.oob;
    this._oobKey = options.oobKey || '';
  }

  handlePairingRequest(data) {
    if (!this._oob) {
      super.handlePairingRequest(data);
      return;
    }

    this._preq = data;

    this._pres = new Buffer([
      SMP.SMP_PAIRING_RESPONSE, // Pairing response
      0x03, // IO capability: NoInputNoOutput
      0x01, // OOB data: Authentication data present
      0x01, // Authentication requirement: Bonding - No MITM
      0x10, // Max encryption key size
      0x01, // Initiator key distribution: EncKey
      0x01  // Responder key distribution: EncKey
    ]);

    this.write(this._pres);
  }

  handlePairingConfirm(data) {
    if (!this._oob) {
      super.handlePairingConfirm(data);
      return;
    }

    this._pcnf = data;

    this._tk = this._oobKey;
    this._r = crypto.r();

    this.write(Buffer.concat([
      new Buffer([SMP.SMP_PAIRING_CONFIRM]),
      crypto.c1(this._tk, this._r, this._pres, this._preq, this._iat, this._ia, this._rat, this._ra)
    ]));
  }
}

SMP.SMP_CID = SMP_CID;
SMP.SMP_PAIRING_REQUEST = SMP_PAIRING_REQUEST;
SMP.SMP_PAIRING_RESPONSE = SMP_PAIRING_RESPONSE;
SMP.SMP_PAIRING_CONFIRM = SMP_PAIRING_CONFIRM;
SMP.SMP_PAIRING_RANDOM = SMP_PAIRING_RANDOM;
SMP.SMP_PAIRING_FAILED = SMP_PAIRING_FAILED;
SMP.SMP_ENCRYPT_INFO = SMP_ENCRYPT_INFO;
SMP.SMP_MASTER_IDENT = SMP_MASTER_IDENT;
SMP.SMP_UNSPECIFIED = SMP_UNSPECIFIED;

module.exports = SMP;
