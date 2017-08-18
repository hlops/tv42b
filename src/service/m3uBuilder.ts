'use strict';

import * as _ from 'lodash';
import { ChannelItem } from '../model/channelItem';
import { Channel } from '../model/channel';
import { Group } from '../model/group';
import Dictionary = _.Dictionary;

class EXTINFItem {
	_group: Group;

	constructor(
		private _name: string,
		private _url: string,
		groupOrName: Group | string,
		shift: number,
		private _options: Dictionary<string>
	) {
		if (typeof groupOrName === 'string') {
			this._group = new Group(groupOrName);
		} else {
			this._group = groupOrName;
		}
		_options['tvg-shift'] = '' + shift;
		_options['group-title'] = this._group.displayName;
	}

	get name(): string {
		return this._name;
	}

	get group(): Group {
		return this._group;
	}

	toString(lastGroup) {
		const arr: string[] = ['#EXTINF:-1 '];
		arr.push.apply(
			arr,
			_.map(this._options, (value, key) => {
				if (key === 'group-title' && lastGroup === value) {
					return '';
				}
				return key + '="' + value + '" ';
			})
		);
		arr.push(', ', this.name);
		arr.push('\n', this._url, '\n');
		return arr.join('');
	}
}

function buildChannels(
	channels: Dictionary<Channel>,
	channelItems: Dictionary<ChannelItem>,
	groups: Dictionary<Group>
): EXTINFItem[] {
	const result: EXTINFItem[] = _.compact(
		_.map(channels, function(channel) {
			const channelItem: ChannelItem = channelItems[channel.name];
			if (channelItem && !channelItem.disabled) {
				let group = groups[channelItem.m3u.group];
				return new EXTINFItem(
					channelItem.m3u.name,
					channel.url,
					group || channelItem.m3u.group,
					channelItem.shift,
					channel.options
				);
			}
		})
	);

	return result.sort(function(a: EXTINFItem, b: EXTINFItem) {
		if (a.group.order || b.group.order) {
			return b.group.order - a.group.order;
		}
		if (a.group.displayName !== b.group.displayName) {
			return a.group.displayName.localeCompare(b.group.displayName);
		}
		return a.name.localeCompare(b.name);
	});
}

/*
export function build(): Q.Promise<any> {
  return Q.all([ChannelsService.getAll(), ChannelItemsService.getAll(), GroupsService.getAll()])
    .spread(function (channels, channelItems, groups) {
      let lastGroup: string;
      return _.map(buildChannels(channels, channelItems, groups), function (item) {
        const result = item.toString(lastGroup);
        lastGroup = item.group.name;
        return result;
      }).toString();
    });
}
*/
