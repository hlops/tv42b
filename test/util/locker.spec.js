'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var LockerService = require("../../src/service/lockerService");
var Q = require("q");
describe('Locker', function () {
    it('consistently execute operation for common lock', function (done) {
        var buffer = [];
        for (var i = 0; i < 3; i++)
            LockerService.setLock('lock', function (promise) {
                return promise
                    .then(function () { return buffer.push('a'); })
                    .then(function () { return Q.delay(20); })
                    .then(function () { return buffer.push('b'); });
            }).done();
        LockerService.getLock('lock')
            .then(function () {
            expect(buffer.join('')).toBe('ababab');
        }).finally(done);
    });
    it('simultaneously execute operation for different locks', function (done) {
        var buffer = [];
        for (var i = 0; i < 3; i++) {
            LockerService.setLock('lock' + i, function () {
                buffer.push('a');
                return Q.delay(20).then(function () { return buffer.push('b'); });
            }).done();
        }
        Q.all([
            LockerService.getLock('lock0'),
            LockerService.getLock('lock1'),
            LockerService.getLock('lock2'),
        ]).then(function () {
            expect(buffer.join('')).toBe('aaabbb');
        }).finally(done);
    });
});
