import * as Rx from 'rxjs';
import Q = require('q');

class Event {
  name: string;
  data: any;
}

const events: Rx.Subject<Event> = new Rx.Subject();

class Initialization {
  private _queue: Rx.Subject<number>;
  private _readyPromise: Q.Promise<void>;

  constructor() {
    this._queue = new Rx.Subject();
    this._readyPromise = Q.Promise<void>(resolve => {
      this._queue.scan((acc, curr) => acc + curr).subscribe(val => {
        if (val === 0) {
          resolve(undefined);
        }
      });
    });
  }

  public add(promise: Q.Promise<any>): void {
    this._queue.next(1);
    promise
      .finally(() => {
        this._queue.next(-1);
      })
      .done();
  }

  get queue(): Rx.Subject<any> {
    return this._queue;
  }

  isReady(): Q.Promise<void> {
    return this._readyPromise;
  }
}

const initialization = new Initialization();

export {initialization, events, Event};
