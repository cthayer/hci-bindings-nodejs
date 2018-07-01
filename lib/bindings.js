'use strict';

const EventEmitir = require('events').EventEmitter;
const BlenoBinding = require('bleno/lib/hci-socket/bindings');

const util = require('util');
const os = require('os');

const AclStream = require('./acl-stream');
const Hci = require('./hci');
const Gap = require('bleno/lib/hci-socket/gap');
const Gatt = require('bleno/lib/hci-socket/gatt');

class Bindings extends BlenoBinding.constructor {
  constructor(options = {}) {
    super();

    this._advertising = options.advertising || false;

    this._hci = new Hci(options.hci || {});
    this._gap = new Gap(this._hci);
    this._gatt = new Gatt(this._hci);

    this._smpOptions = options.smp || false;
  }

  onLeConnComplete(status, handle, role, addressType, address, interval, latency, supervisionTimeout, masterClockAccuracy) {
    if (role !== 1) {
      // not slave, ignore
      return;
    }

    this._address = address;
    this._handle = handle;

    const aclStreamOptions = {
      hci: this._hci,
      handle,
      smp: {
        localAddressType: this._hci.addressType,
        localAddress: this._hci.address,
        remoteAddressType: addressType,
        remoteAddress: address,
        ...this._smpOptions
      }
    };

    this._aclStream = new AclStream(aclStreamOptions);
    this._gatt.setAclStream(this._aclStream);

    this.emit('accept', address);
  }
}

module.exports = Bindings;
