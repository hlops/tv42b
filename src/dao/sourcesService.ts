'use strict';

import * as ActionsService from "./actionsService";
import * as ChannelsService from "./channelsService";
import * as IdentityService from "../dao/identityService";
import * as m3uParser from "../service/m3uParser";
import Dao from "./inner/dao";
import {Channel} from "../model/channel";
import {Source, SourceType} from "../model/source";
import Dictionary = _.Dictionary;
import fetch = require('node-fetch');

class Singleton {
  static dao: Dao<Source> = new Dao<Source>('sources');
}

export function getSources(): Q.Promise<Dictionary<Source>> {
  return Singleton.dao.getEntity();
}

export function create(name: string, url: string, type: SourceType): Q.Promise<Source> {
  return IdentityService.next()
    .then((id) => add(new Source(id, name, url, type)));
}

export function get(id: string): Q.Promise<Source> {
  return getSources().then((sources) => sources[id]);
}

export function add(source: Source): Q.Promise<Source> {
  return getSources().then(function (sources) {
    if (sources.hasOwnProperty(source.id)) {
      throw 'Source already exists: ' + source.id;
    }
    sources[source.id] = source;
    return Singleton.dao.setEntity(sources)
      .then(() => source);
  });
}

export function update(source: Source): Q.Promise<Source> {
  return getSources().then(function (sources) {
    if (!sources.hasOwnProperty(source.id)) {
      throw 'Source not found: ' + source.id;
    }
    sources[source.id] = source;
    return Singleton.dao.setEntity(sources)
      .then(() => source);
  });
}

export function removeSource(source: Source|string): Q.Promise<Dictionary<Source>> {
  return getSources().then(function (sources) {
    if (typeof source === "string") {
      delete sources[source];
    } else {
      delete sources[source.id];
    }
    return Singleton.dao.setEntity(sources);
  });
}

export function processSource(sourceOrId: Source|string): Q.Promise<Source> {
  let sourceId;
  if (typeof sourceOrId === "string") {
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
      return m3uParser.parse(action, res.body)
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

export function clear(): Q.Promise<Dictionary<Source>> {
  return Singleton.dao.setEntity({});
}
