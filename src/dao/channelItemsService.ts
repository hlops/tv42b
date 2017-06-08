'use strict';

import * as ChannelsService from "./channelsService";
import * as IdentityService from "../dao/identityService";
import * as Q from "q";
import * as _ from "lodash";
import Dao from "./inner/dao";
import {ChannelItem} from "../model/channelItem";
import {Channel, IChannel} from "../model/channel";
import {Source} from "../model/source";
import Dictionary = _.Dictionary;

class Singleton {
  static dao: Dao<ChannelItem> = new Dao<ChannelItem>('channelItems');
}

class DummyChannel implements IChannel {
  constructor(private _name: string, private _group: string, private _shift: number) {
  }

  get name(): string {
    return this._name;
  }

  get sourceId(): string {
    return '';
  }

  get group(): string {
    return this._group;
  }

  get shift(): number {
    return this._shift;
  }
}

export function create(name: string, group: string, shift: number): Q.Promise<ChannelItem> {
  return IdentityService.next()
    .then((id) => {
      const item = new ChannelItem(id, new DummyChannel(name, group, shift));
      item.changed = true;
      return this.add(item);
    });
}

export function add(item: ChannelItem): Q.Promise<ChannelItem> {
  return getAll().then(function (items) {
    items[item.name] = item;
    return Singleton.dao.setEntity(items)
      .then(() => item);
  });
}

export function getAll(): Q.Promise<Dictionary<ChannelItem>> {
  return Singleton.dao.getEntity();
}

export function findItems(sourceOrId: Source|string): Q.Promise<Dictionary<ChannelItem>> {
  let sourceId;
  if (typeof sourceOrId === "string") {
    sourceId = sourceOrId;
  } else {
    sourceId = sourceOrId.id;
  }
  return getAll().then(function (items: Dictionary<ChannelItem>) {
    return _.transform(items, function (result: Dictionary<ChannelItem>, value: ChannelItem, key: string) {
      if (!value.m3u.sourceId || value.m3u.sourceId === sourceId) {
        result[key] = value;
      }
    }, {});
  });
}

export function processSource(sourceOrId: Source|string): Q.Promise<any> {
  let channels: Dictionary<Channel>;
  let items: Dictionary<ChannelItem>;

  return ChannelsService.findChannels(sourceOrId)
    .then(_channels => channels = _channels)
    .then(() => findItems(sourceOrId))
    .then(_items => items = _items)
    .then(function () {
      const promises: Q.Promise<ChannelItem>[] = _.compact(_.map(channels, function (channel) {
        if (!items.hasOwnProperty(channel.name) || !items[channel.name].changed) {
          return IdentityService.next().then((id) => new ChannelItem(id, channel));
        }
      }));
      return Q.all(promises);
    }).then(function (items: ChannelItem[]) {
      const transform = _.transform(items, function (result: Dictionary<ChannelItem>, item: ChannelItem) {
        result[item.name] = item;
      }, {});
      return Singleton.dao.insert(transform);
    });
}

export function clear(): Q.Promise<Dictionary<ChannelItem>> {
  return Singleton.dao.setEntity({});
}
