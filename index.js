/*
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
*/

import http from 'http';
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';
import { KalmanModel, KalmanObservation } from './kalman';

const query = encodeURIComponent('SELECT * FROM raspi');

var x_0 = $V([-10]);
var P_0 = $M([[1]]);
var F_k=$M([[1]]);
var Q_k=$M([[0]]);
var KM = new KalmanModel(x_0,P_0,F_k,Q_k);

var z_k = $V([1]);
var H_k = $M([[1]]);
var R_k = $M([[4]]);
var KO = new KalmanObservation(z_k,H_k,R_k);

for (var i=0;i<200;i++){
  z_k = $V([0.5+Math.random()]);
  KO.z_k=z_k;
  KM.update(KO);
  console.log(JSON.stringify(KM.x_k.elements));
}

process.exit();

axios.get(`http://localhost:8086/query?db=esp&q=${query}`, {
    responseType: 'json',
})
.then((res) => {
    const serie = _.get(res, 'data.results[0].series[0]');
    const { columns, values } = serie;
    const timeColumn = _.indexOf(columns, 'time');
    const data = _.map(values, (value) => {
        value[timeColumn] = moment(value[timeColumn]);
        return _.zipObject(columns, value);
    });

})
.catch((err) => {
    console.error(err);
});
