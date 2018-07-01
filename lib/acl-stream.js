'use strict';

const BlenoACLStream = require('bleno/lib/hci-socket/acl-stream');
const SMP = require('./smp');

class ACLStream extends BlenoACLStream {
  constructor(options = {}) {
    super(options.hci, options.handle, options.smp.localAddressType, options.smp.localAddress, options.smp.remoteAddressType, options.smp.remoteAddress);

    this._smp = new SMP({aclStream: this, ...options.smp});
  }
}

module.exports = ACLStream;
