"use strict";

import * as NodePersist from "node-persist";

const promise = NodePersist.init();

export default class Persist {

  public static get(name): Q.Promise<any> {
    return promise.then(() => NodePersist.getItem(name))
  }

  public static set(name, value): Q.Promise<any> {
    return promise
      .then(() => NodePersist.setItem(name, value))
      .then(() => NodePersist.getItem(name));
  }
}
