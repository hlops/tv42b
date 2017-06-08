'use strict';

import * as NodePersist from "node-persist";
import * as _ from "lodash";
import Dictionary = _.Dictionary;

export default class Dao<T> {

  private static init = NodePersist.init({interval: 500});

  private promise: Q.Promise<Dictionary<T>>;
  private _savePromise: Q.Promise<Dictionary<T>>;

  constructor(private entityName: string) {
    this.promise = Dao.init
      .then(() => NodePersist.getItem(this.entityName))
      .then((value) => value || {});
  }

  public getEntity(): Q.Promise<Dictionary<T>> {
    return this.promise;
  }

  public setEntity(value: Dictionary<T>) {
    this.promise = this.promise.then(() => value);
    this._savePromise = this.promise.then(() => NodePersist.setItem(this.entityName, value));
    return this.promise;
  }

  public insert(value: Dictionary<T>) {
    this.promise = this.promise.then((current: Dictionary<T>) => _.extend(current, value));
    this._savePromise = this.promise.then(() => NodePersist.setItem(this.entityName, value));
    return this.promise;
  }

  get saved(): Q.Promise<Dictionary<T>> {
    return this._savePromise;
  }
}
