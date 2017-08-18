'use strict';
import tvItemsService from "../../src/dao/tvItemsService";
import sourcesService from "../../src/dao/sourcesService";

describe('Source service', () => {
  beforeEach(function () {
    sourcesService.clear();
    tvItemsService.clear();
  });
});
