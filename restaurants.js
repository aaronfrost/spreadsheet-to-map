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
  spreadsheetId: '1ffupbJRRjcV7L_ilOMAv4wETAWQQ8OdhKC5OvsDjHvU',
  worksheetName: 'Sheet1',

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

    var myrows = _.map(rows, function(r){ return new Row(r)});

    fs.writeFile('public/restaurants.json', JSON.stringify(myrows), function(e, res){

    });

  });

});

function Row(data){
  if(this == global) return new Row(data);

  this.type = data['1'];
  this.name = data['2'];
  this.address = data['7'];
  this.pricey = data['6'];
  this.lat = data['8'];
  this.lng = data['9'];

}