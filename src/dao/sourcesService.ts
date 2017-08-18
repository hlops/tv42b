'use strict';

import IdentityService from '../dao/identityService';
import {Source, SourceType} from '../model/source';
import DaoService from './inner/daoService';
import Dictionary = _.Dictionary;

class SourcesService extends DaoService<Dictionary<Source>> {
  constructor() {
    super('sources', {});
  }

  public create(name: string, url: string, type: SourceType): Source {
    const source = new Source(IdentityService.next(), name, url, type);
    this.add(source);
    return source;
  }

  public add(source: Source) {
    if (this.value.hasOwnProperty(source.id)) {
      throw 'Source already exists: ' + source.id;
    }
    this.value[source.id] = source;
    this.save();
  }

  public update(source: Source) {
    if (!this.value.hasOwnProperty(source.id)) {
      throw 'Source not found: ' + source.id;
    }
    this.value[source.id] = source;
    this.save();
  }

  public removeSource(source: Source | string) {
    if (typeof source === 'string') {
      delete this.value[source];
    } else {
      delete this.value[source.id];
    }
    this.save();
  }

  public getSource(sourceOrId: Source | string): Source {
    if (typeof sourceOrId === 'string') {
      return this.value[sourceOrId]
    } else {
      return sourceOrId;
    }
  }

  public execute(sourceOrId: Source | string) {
    let source = this.getSource(sourceOrId);
  }
}

/*export function processSource(sourceOrId: Source | string): Q.Promise<Source> {
  let sourceId;
  if (typeof sourceOrId === 'string') {
    sourceId = sourceOrId;
  } else {
    sourceId = sourceOrId.id;
  }

  let source, action;
  return get(sourceId)
    .then(function (_source) {
      source = _source;
      return ActionsService.createSourceAction('process source', source);
    })
    .then(function (_action) {
      action = _action;
      let url: string = source.url;
      if (url.startsWith('/')) {
        url = 'http://localhost:3000' + url;
      }
      return fetch(url);
    })
    .then(function (res) {
      return m3uParser.parse(action, res.body);
    })
    .progress((channel: Channel) => ChannelsService.update(action, channel))
    .catch(e => {
      if (action) {
        return ActionsService.finish(action, e);
      } else {
        throw e;
      }
    })
    .finally(() => {
      ActionsService.finish(action);
      return ChannelsService.finishUpdate(action);
    })
    .then(() => source);
}
*/

export default new SourcesService();
