hci-bindings for [bleno](https://github.com/noble/bleno) that support Out-Of-Band (OOB) key exchange pairing.

```js
const Bindings = require('@cdmnky/hci-bindings');
const Bleno = require('@cdmnky/bleno');

let bindings = new Bindings({smp: { oob: true, oobKey: Buffer(16)}});

let bleno = new Bleno(bindings);

// use bleno normally
```