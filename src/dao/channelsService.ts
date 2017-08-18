'use strict';

import * as _ from 'lodash';
import DaoService from './inner/daoService';
import {Channel} from '../model/channel';
import {SourceAction} from '../model/actions/SourceAction';
import {Source} from '../model/source';
import Dictionary = _.Dictionary;

class ChannelsService extends DaoService<Dictionary<Channel>> {
  constructor() {
    super('channels', {});
  }

  public getChannels(sourceOrId: Source | string): Dictionary<Channel> {
    let sourceId;
    if (typeof sourceOrId === 'string') {
      sourceId = sourceOrId;
    } else {
      sourceId = sourceOrId.id;
    }
    return _.transform(
      this.value,
      function (result: Dictionary<Channel>, value: Channel, key: string) {
        if (value.sourceId === sourceId) {
          result[key] = value;
        }
      },
      {}
    );
  }

  public update(action: SourceAction, channel: Channel): void {
    if (!this.value.hasOwnProperty(channel.key)) {
      action.log(`added channel ${channel.name}`);
    }
    this.value[channel.key] = channel;
    this.save();
  }
}

/*
export function finishUpdate(action: SourceAction): Q.Promise<Dictionary<Channel>> {
  return getAll().then(function (channels) {
    _.each(channels, function (channel: Channel) {
      if (channel.sourceId === action.source.id && channel.actionId !== action.id) {
        action.log('deleted channel ${channel.name}');
        delete channels[channel.key];
      }
    });
    Dao.set(ENTITY_NAME, channels);
    return channels;
  });
}
*/
export default new ChannelsService();
