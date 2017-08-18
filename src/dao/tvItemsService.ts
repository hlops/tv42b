'use strict';

import * as _ from "lodash";
import {TvItem} from "../model/tvItem";
import DaoService from "./inner/daoService";
import Dictionary = _.Dictionary;

class TvItemsService extends DaoService<Dictionary<TvItem>> {
  constructor() {
    super('tvItems', {});
  }
}

export default new TvItemsService();
