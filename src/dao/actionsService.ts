'use strict';

import DaoService from './inner/daoService';
import {Action} from '../model/action';
import Dictionary = _.Dictionary;

class ActionsService extends DaoService<Dictionary<Action>> {
  constructor() {
    super('actions', {});
  }

  public add(action: Action): void {
    if (this.value.hasOwnProperty(action.id)) {
      throw 'Action already exists: ' + action.id;
    }
    this.value[action.id] = action;
    this.save();
  }
}

/*
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
    Dao.set(ENTITY_NAME, actions);
    return action;
  });
}

export function createSourceAction(text: string, source: Source): Q.Promise<Action> {
  return add(new SourceAction(IdentityService.next(), text, source));
}

*/

export default new ActionsService();
