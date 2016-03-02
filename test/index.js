/* global describe, it, beforeEach */
var assert = require('assert');
var browserify = require('../');
var rufio = require('rufio');
var Site = rufio.Site;
var Type = rufio.Type;
var Item = rufio.Item;

describe('rufio-filter-browserify', function () {
	var site;
	var type;
	var item;
	beforeEach(function () {
		site = new Site({
			baseDir: __dirname
		});
		type = new Type('post', {
			site: site,
			directory: 'fixtures'
		});
		site.addType(type);
		item = new Item({
			site: site,
			type: type,
			filename: 'index.js'
		});
		type.addItem(item);
	});

	it('should browserify up files', function (done) {
		var f = browserify();
		item.addFilter(f);

		item.load().on('end', function () {
			assert(item.content);
			assert(item.content.indexOf('module.exports = \'foo\';') !== -1);
			assert.doesNotThrow(function () {
				eval(item.content); // eslint-disable-line
			});
			done();
		});
	});
});
