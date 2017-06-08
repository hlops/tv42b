'use strict';

import Q = require("q");

type func = (promise: Q.Promise<any>) => any

class Singleton {
  private static locks = {};

  public static getLock(id): Q.Promise<any> {
    if (!this.locks.hasOwnProperty(id)) {
      this.locks[id] = Q();
    }
    return this.locks[id];
  }

  public static setLock(id, operation: func): Q.Promise<any> {
    const lock = this.getLock(id);
    return this.locks[id] = lock.then(() => operation(lock));
  }
}

export function getLock(id: string): Q.Promise<any> {
  return Singleton.getLock(id);
}

export function setLock(id: string, operation: func): Q.Promise<any> {
  return Singleton.setLock(id, operation);
}
