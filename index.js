var browserify = require('browserify');
var through2 = require('through2');

module.exports = function createBrowserifyFilter (opts) {
	opts = opts || {};
	opts.browserify = opts.browserify || {};

	return function browserifyFilter (item) {
		var _content = [];
		return through2(function (chunk, enc, done) {
			_content.push(chunk);
			done();
		}, function (done) {
			// Create browserify bundle
			var b = browserify([{
				source: Buffer.concat(_content).toString('utf8'),
				entry: false,
				file: item.path,
				id: item.path
			}], opts.browserify);

			// Collect the output from the bundle
			b.bundle().pipe(through2(function (chunk, enc, done2) {
				this.push(chunk);
				done2();
			}.bind(this), function () {
				done();
			}));
		});
	};
};
