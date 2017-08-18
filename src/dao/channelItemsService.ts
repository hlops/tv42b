'use strict';

import * as _ from 'lodash';
import identityService from './identityService';
import {ChannelItem} from '../model/channelItem';
import {IChannel} from '../model/channel';
import {Source} from '../model/source';
import DaoService from "./inner/daoService";
import Dictionary = _.Dictionary;

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

class ChannelItemsService extends DaoService<Dictionary<ChannelItem>> {
  constructor() {
    super('channelItems', {});
  }

  public create(name: string, group: string, shift: number): void {
    const item = new ChannelItem(identityService.next(), new DummyChannel(name, group, shift));
    item.changed = true;
    this.add(item);
  }

  public add(item: ChannelItem) {
    this.value[item.name] = item;
    this.save();
  }

  public find(sourceOrId: Source | string): Dictionary<ChannelItem> {
    let sourceId;
    if (typeof sourceOrId === 'string') {
      sourceId = sourceOrId;
    } else {
      sourceId = sourceOrId.id;
    }
    return _.transform(
      this.value,
      function (result: Dictionary<ChannelItem>, value: ChannelItem, key: string) {
        if (!value.m3u.sourceId || value.m3u.sourceId === sourceId) {
          result[key] = value;
        }
      },
      {}
    );
  }
}

/*
export function processSource(sourceOrId: Source | string): Q.Promise<any> {
	const groupNames: { [key: string]: boolean } = {};
	let channels: Dictionary<Channel>;
	let items: Dictionary<ChannelItem>;

	return ChannelsService.findChannels(sourceOrId)
		.then(_channels => (channels = _channels))
		.then(() => findItems(sourceOrId))
		.then(_items => (items = _items))
		.then(function() {
			return _.compact(
				_.map(channels, function(channel) {
					groupNames[channel.group] = true;
					if (!items.hasOwnProperty(channel.name) || !items[channel.name].changed) {
						return new ChannelItem(IdentityService.next(), channel);
					}
				})
			);
		})
		.then(function(items: ChannelItem[]) {
			const transform = _.transform(
				items,
				function(result: Dictionary<ChannelItem>, item: ChannelItem) {
					result[item.name] = item;
				},
				{}
			);
			Dao.set(ENTITY_NAME, transform);
			return transform;
		})
		.then(result => {
			GroupService.createGroups(_.keys(groupNames)).then(() => result);
		});
}
*/

export default new ChannelItemsService();
