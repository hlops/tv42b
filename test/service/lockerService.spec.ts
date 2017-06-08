'use strict';

import * as LockerService from "../../src/service/lockerService";
import Q = require("q");

describe('Locker', () => {
  it('consistently execute operation for common lock', function (done) {
    let buffer: string[] = [];

    for (let i = 0; i < 3; i++) LockerService.setLock('lock', function (promise) {
      return promise
        .then(() => buffer.push('a'))
        .then(() => Q.delay(20))
        .then(() => buffer.push('b'))
    }).done();

    LockerService.getLock('lock')
      .then(() => {
        expect(buffer.join('')).toBe('ababab');
      })
      .finally(done)
      .done();
  });

  it('simultaneously execute operation for different locks', function (done) {
    let buffer: string[] = [];

    for (let i = 0; i < 3; i++) {
      LockerService.setLock('lock' + i, function () {
        buffer.push('a');
        return Q.delay(20).then(() => buffer.push('b'));
      }).done();
    }

    Q.all([
      LockerService.getLock('lock0'),
      LockerService.getLock('lock1'),
      LockerService.getLock('lock2'),
    ])
      .then(() => {
        expect(buffer.join('')).toBe('aaabbb');
      })
      .finally(done)
      .done();
  });
});
