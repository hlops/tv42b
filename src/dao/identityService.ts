"use strict";

import * as _ from "lodash";
import Dao from "./inner/dao";
import Dictionary = _.Dictionary;

class Singleton {
  static dao: Dao<number> = new Dao<number>('identity');
}

export function clear(): Q.Promise<Dictionary<number>> {
  return Singleton.dao.setEntity({'identity': 0});
}

export function next(): Q.Promise<string> {
  return Singleton.dao.getEntity()
    .then(function (entities) {
      let value = entities.current || 0;
      entities.current = value + 1;
      Singleton.dao.setEntity(entities);
      return value.toString(36);
    })
}

export function isEmpty(): Q.Promise<boolean> {
  //noinspection PointlessBooleanExpressionJS
  return Singleton.dao.getEntity()
    .then(function (entities) {
      return entities.current;
    })
    .then((value) => !value);
}

