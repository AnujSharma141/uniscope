const expect = require('chai').expect,
    Scope = require('../../');

// upgrading mocha 6->8 leaked this global variable in browser context
// since these global property names are set as our anonymous function's arguments,
// and having an identifier with `-` crashes the .exec so, just delete it!
// possible fix: https://github.com/postmanlabs/uniscope/pull/408
delete global['__core-js_shared__'];

describe('scope module exec', function () {
    var scope;

    beforeEach(function () {
        scope = Scope.create();
        scope.set('expect', expect);
    });
    afterEach(function () {
        scope = null;
    });

    it('should be able to execute a simple script', function (done) {
        scope.exec(`var a = 1 + 2;`, done); // eslint-disable-line quotes
    });

    it('should throw error when callback is missing', function () {
        expect(function () {
            scope.exec.bind(scope)('var a = 1 + 2;');
        }).to.throw('missing callback function');
    });

    it('should throw error when code is missing', function (done) {
        scope.exec(null, function (err) {
            expect(err).to.be.an('error');
            expect(err.message).to.equal('expecting the scope\'s code to be a string');
            done();
        });
    });

    it('should be able to execute asynchronous script', function (done) {
        scope.set('setTimeout', global.setTimeout);
        scope.exec(`
            setTimeout(__exitscope, 100);
        `, true, function (err) {
            scope.unset('setTimeout');
            done(err);
        });
    });
});
