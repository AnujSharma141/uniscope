const expect = require('chai').expect,
    Scope = require('../../');

describe('scope module reset', function () {
    var scope;

    beforeEach(function () {
        global.expect = expect;

        scope = Scope.create({
            ignore: ['expect']
        });
    });
    afterEach(function () {
        delete global.expect;
        scope = null;
    });

    it('should reset imports', function (done) {
        scope.import({
            var1: 'var1',
            var2: 'var2'
        });

        scope.exec(`
            expect(var1).to.equal('var1');
            expect(var2).to.equal('var2');
        `, function (err) {
            if (err) { return done(err); }

            scope.reset();

            scope.exec(`
                expect(this.var1).to.be.undefined;
                expect(this.var2).to.be.undefined;
            `, done);
        });
    });

    it('should reset locals along with imports', function (done) {
        scope.import({
            var1: 'var1',
            var2: 'var2'
        });

        // we create some globals here
        scope.exec(`
            expect(var1).to.equal('var1');
            expect(var2).to.equal('var2');

            expect(this.userGlobal).to.be.undefined;
            userGlobal = true;
        `, function (err) {
            if (err) { return done(err); }

            scope.reset(true, true);

            // we do not test globals to exist as this is tested elsewhere
            scope.exec(`
                expect(this.var1).to.be.undefined;
                expect(this.var2).to.be.undefined;

                expect(this.userGlobal).to.be.undefined;
            `, done);
        });
    });
});
