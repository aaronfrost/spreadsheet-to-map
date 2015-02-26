/**
 *
 * This code was skeletoned in from http://www.nczonline.net/blog/2014/03/04/accessing-google-spreadsheets-from-node-js/
 *
 */

var Spreadsheet = require('edit-google-spreadsheet');
var _ = require('lodash');
var fs = require('fs');
var env = require('./env');

Spreadsheet.load({
  debug: true,
  spreadsheetId: '1JtEboCtObZbD4df5Wdl2kDFSMhmO2kBGT51Z2JEVyS4',
  worksheetId: 'out6gx0',

  oauth : {
    email: env.serviceAccount,
    keyFile: './key-file.pem'
  }

}, function sheetReady(err, spreadsheet) {

  if (err) {
    throw err;
  }

  spreadsheet.receive(function(err, rows, info) {
    if (err) {
      throw err;
    }

    console.log('rows', rows);
    var allRows = _.chain(rows)
      .map(function(d){
        return d;
      })
      .map(function(d){
        return new Row(d);
      })
      .filter(function(d){
        return d.fullName != 'Enter your full name';
      })
      .filter(function(d){
        return d.lat != undefined && d.long != undefined;
      })
      .filter(function(d){
        return !(d.lat == 0 || d.long == 0);
      })
      .value();

    //var publicEvents = _.filter(allRows, function(r){
    //  return !r.private;
    //});
    var publicEvents = allRows;
    console.log('rows', allRows.length, publicEvents.length);
    fs.writeFile('public/events.json', JSON.stringify(publicEvents), function(e, res){
      if(e) console.error(e);
      console.log('RES', res);
    });
  });

});

function Row(data){
  if(this == global) return new Row(data);

  this.time = data[1];
  this.fullName = data[2];
  this.email = data[3];
  this.ticketLink = data[4] || "";
  if(!data[4].match(/^http/)){
    this.private = true;
  }
  this.locationName = data[5];
  this.lat = data[6] || 0;
  this.long = data[7] || 0;
  this.live = data[8];

}