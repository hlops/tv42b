'use strict';

import * as IdentityService from "../../src/dao/identityService";
import Persist from "../../src/dao/inner/storage";
import Q = require("q");

describe('Identity service', () => {
  beforeEach(function (done) {
    IdentityService.clear().finally(function () {
      done();
    }).done();
  });

  it('', function (done) {
    let arr: any = [];
    for (let i = 0; i < 100; i++) {
      let current = i;
      arr.push(
        IdentityService.next().then(function (value) {
          expect(value).toBe(current.toString(36));
        })
      );
    }
    Q.all(arr).then(function () {
      // wait the changes to be written
      setTimeout(function () {
        Persist.get('identity').then(function (value) {
          expect(value.current).toBe(100);
        });
        done();
      }, 120);
    });
  });
});
