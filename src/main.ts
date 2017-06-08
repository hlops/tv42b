'use strict';

import Server from "./server";
import * as DefaultValuesLoaderService from "./service/defaultValuesLoaderService";

class Main {
  constructor() {
    DefaultValuesLoaderService.loadDefaultValues()
      .then(function () {
        new Server();
      }).done();
  }
}

export default new Main();
