'use strict';

import * as IdentityService from "./identityService";
import Dao from "./inner/dao";
import {Action} from "../model/action";
import {Source} from "../model/source";
import {SourceAction} from "../model/actions/SourceAction";
import Q = require("q");
import Dictionary = _.Dictionary;

class Singleton {
  static dao: Dao<Action> = new Dao<Action>('actions');
}

export function getAll(): Q.Promise<Dictionary<Action>> {
  return Singleton.dao.getEntity();
}

export function add(action: Action): Q.Promise<Action> {
  return getAll().then(function (actions) {
    if (actions.hasOwnProperty(action.id)) {
      throw 'Action already exists: ' + action.id;
    }
    actions[action.id] = action;
    return Singleton.dao.setEntity(actions)
      .then(() => action);
  });
}

export function finish(action: Action, error?: string): Q.Promise<Action> {
  return getAll().then(function (actions) {
    if (action.finished) {
      return action;
    }
    if (!actions.hasOwnProperty(action.id)) {
      throw 'Action not found: ' + action.id;
    }
    action.done(error);
    actions[action.id] = action;
    return Singleton.dao.setEntity(actions).then(() => action);
  });
}

export function createSourceAction(text: string, source: Source): Q.Promise<Action> {
  return IdentityService.next()
    .then(function (id: string) {
      return add(new SourceAction(id, text, source));
    });
}

export function clear(): Q.Promise<Dictionary<Action>> {
  return Singleton.dao.setEntity({});
}
