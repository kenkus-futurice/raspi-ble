var noble = require('noble');

noble.on('stateChange', function(state) {
  if (state === 'poweredOn')
    noble.startScanning([], true);
  else
    noble.stopScanning();
});

noble.on('discover', function(peripheral) {
  if (peripheral.uuid === 'd52371cd5245') {
    noble.stopScanning();
    var advertisement = peripheral.advertisement;
    console.log('uuid: ', peripheral.uuid, 'local name: ', advertisement.localName, 'rssi: ', peripheral.rssi);
    noble.startScanning([], true);
  }
});
