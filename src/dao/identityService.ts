'use strict';

import DaoService from "./inner/daoService";

class IdentityService extends DaoService<number> {
  constructor() {
    super('identity', 0);
  }

  public next(): string {
    this.value++;
    return this.value.toString(36);
  }
}

export default new IdentityService();
