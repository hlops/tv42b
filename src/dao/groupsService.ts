'use strict';

import * as _ from "lodash";
import Dao from "./inner/dao";
import {Group} from "../model/group";
import Dictionary = _.Dictionary;

class Singleton {
  static dao: Dao<Group> = new Dao<Group>('groups');
}

export function clear(): Q.Promise<Dictionary<Group>> {
  return Singleton.dao.setEntity({});
}

export function getAll(): Q.Promise<Dictionary<Group>> {
  return Singleton.dao.getEntity();
}

export function add(group: Group): Q.Promise<Group> {
  return getAll().then(function (groups) {
    groups[group.name] = group;
    return Singleton.dao.setEntity(groups)
      .then(() => group);
  });
}

export function createGroups(names: string[]) {
  return getAll()
    .then((groups) => _.each(names, (name) => {
      if (!groups.hasOwnProperty(name)) {
        groups[name] = new Group(name, 0);
      }
      return Singleton.dao.setEntity(groups)
    }));
}
