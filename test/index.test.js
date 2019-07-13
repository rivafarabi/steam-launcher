var assert = require('assert');
var steamLauncher = require('../index');

describe('Test Extension', function() {
	describe('Actions', function() {
		it('Check header', function() {
			const header = steamLauncher.selections[0].header;
			assert.equal(header, 'Steam Launcher');
		});
	});
});
