'use strict';

const BlenoHCI = require('bleno/lib/hci-socket/hci');

class HCI extends BlenoHCI {
  constructor(options = {}) {
    super();
  }
}

module.exports = HCI;