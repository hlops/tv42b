'use strict';

import {Channel} from "../model/channel";
import Dao from "./inner/dao";
import * as _ from "lodash";
import {SourceAction} from "../model/actions/SourceAction";
import {Source} from "../model/source";
import Dictionary = _.Dictionary;

class Singleton {
  static dao: Dao<Channel> = new Dao<Channel>('channels');
}

export function getAll(): Q.Promise<Dictionary<Channel>> {
  return Singleton.dao.getEntity();
}

export function findChannels(sourceOrId: Source|string): Q.Promise<Dictionary<Channel>> {
  let sourceId;
  if (typeof sourceOrId === "string") {
    sourceId = sourceOrId;
  } else {
    sourceId = sourceOrId.id;
  }
  return getAll().then(function (channels: Dictionary<Channel>) {
    return _.transform(channels, function (result: Dictionary<Channel>, value: Channel, key: string) {
      if (value.sourceId === sourceId) {
        result[key] = value;
      }
    }, {});
  });
}

export function update(action: SourceAction, channel: Channel): Q.Promise<Dictionary<Channel>> {
  return findChannels(action.source).then(function (channels) {
    if (!channels.hasOwnProperty(channel.key)) {
      action.log(`added channel ${channel.name}`);
    }
    channels[channel.key] = channel;
    return Singleton.dao.insert(channels);
  });
}

export function finishUpdate(action: SourceAction): Q.Promise<Dictionary<Channel>> {
  return getAll().then(function (channels) {
    _.each(channels, function (channel: Channel) {
      if (channel.sourceId === action.source.id && channel.actionId !== action.id) {
        action.log('deleted channel ${channel.name}');
        delete channels[channel.key]
      }
    });
    return Singleton.dao.setEntity(channels);
  });
}

export function clear(): Q.Promise<Dictionary<Channel>> {
  return Singleton.dao.setEntity({});
}

