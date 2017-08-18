'use strict';

import * as NodePersist from 'node-persist';
import {InitOptions} from 'node-persist';
import * as _ from 'lodash';
import * as EventQueue from '../../service/events/EventQueue';

class DaoService<T> {
  private _value: T;

  constructor(private entityName: string, private initialValue: T) {
    const options: InitOptions = {interval: 500};
    if (process.env.TVGUIDE_NODEPERSIST_NAME) {
      options.dir = '.node-persist/storage-' + process.env.TVGUIDE_NODEPERSIST_NAME;
    }
    EventQueue.initialization.add(
      NodePersist.init(options)
        .then(() => {
          NodePersist.getItem(this.entityName);
        })
        .then(v => {
          this.value = v || _.cloneDeep(initialValue);
        })
    );
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    this._value = newValue;
    this.save();
  }

  save() {
    NodePersist.setItem(this.entityName, this._value);
  }

  public isEmpty(): boolean {
    return _.eq(this.value, this.initialValue);
  }

  public clear(): void {
    this.value = _.cloneDeep(this.initialValue);
    NodePersist.removeItem(this.entityName);
  }
}

export default DaoService;
