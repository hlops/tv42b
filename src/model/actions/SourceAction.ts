"use strict";

import {Action} from "../action";
import {Source} from "../source";

export class SourceAction extends Action {

  constructor(id: string, text: string, private _source: Source) {
    super(id, text);
  }

  get source(): Source {
    return this._source;
  }
}
