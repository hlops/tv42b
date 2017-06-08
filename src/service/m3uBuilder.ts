'use strict';

import * as _ from "lodash";
import * as ChannelItemsService from "../dao/channelItemsService";
import * as ChannelsService from "../dao/channelsService";
import {Channel} from "../model/channel";
import {ChannelItem} from "../model/channelItem";
import Dictionary = _.Dictionary;
import Q = require("q");
import fs = require('fs');
import readline = require('readline');

class EXTINFItem {

  constructor(private name: string, private _url: string, group: string, shift: number, private _options: Dictionary<string>) {
    _options['tvg-shift'] = '' + shift;
    _options['group-title'] = group;
  }

  get group(): string {
    return this._options['group-title'];
  }

  toString() {
    const arr: string[] = ["#EXTINF:-1 "];
    arr.push.apply(arr, _.map(this._options, (value, key) => key + '="' + value + '" '));
    arr.push(', ', this.name);
    arr.push('\n', this._url, '\n');
    return arr.join('')
  }
}

function mapChannel(channels: Dictionary<Channel>, channelItems: Dictionary<ChannelItem>): EXTINFItem[] {
  const result = _(channels).map(function (channel) {
    const channelItem: ChannelItem = channelItems[channel.name];
    if (channelItem && !channelItem.disabled) {
      return new EXTINFItem(channelItem.m3u.name, channel.url, channelItem.m3u.group, channelItem.shift, channel.options);
    }
  });
  return _.compact(result.orderBy('group').value());
}

export function build(): Q.Promise<any> {
  return Q.all([ChannelsService.getAll(), ChannelItemsService.getAll()])
    .spread(function (channels, channelItems) {
      return mapChannel(channels, channelItems).toString()
    });
}
