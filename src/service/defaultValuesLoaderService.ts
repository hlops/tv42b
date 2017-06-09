'use strict';

import * as ActionsService from "../dao/channelsService";
import * as ChannelsService from "../dao/channelsService";
import * as ChannelItemsService from "../dao/channelItemsService";
import * as GroupsService from "../dao/groupsService";
import * as IdentityService from "../dao/identityService";
import * as SourcesService from "../dao/sourcesService";
import * as _ from "lodash";
import {SourceType} from "../model/source";
import Q = require("q");
import fetch = require('node-fetch')
import fs = require('fs');

export function loadDefaultValues(): Q.Promise<[any]> {
  return IdentityService.isEmpty().then(
    function (isEmpty: boolean): any {
      if (isEmpty) {
        purgeAll().then(loadAll);
      }
    });
}

export function loadSources(path: string = `${__dirname}/../assets/initialValues/sources.json`): Q.Promise<void> {
  return Q.Promise<void>(function (resolve) {
    fs.readFile(path, function (err, data) {
      let values = JSON.parse(data.toString("UTF-8"));
      _.each(values, function (value) {
        SourcesService.create(value.name, value.url, SourceType[<string>value.type])
          .then(source => SourcesService.processSource(source))
          .then(source => ChannelItemsService.processSource(source))
          .done();
      });
      resolve(undefined);
    });
  });
}

export function loadChannelItems(path: string = `${__dirname}/../assets/initialValues/channelItems.json`): Q.Promise<void> {
  return Q.Promise<any>(function (resolve) {
    fs.readFile(path, function (err, data) {
      let values: any[] = JSON.parse(data.toString("UTF-8"));
      Q.all(_.map(values, value => ChannelItemsService.create(value.name, value.group, value.shift)))
        .then(resolve)
        .done();
    });
  });
}

function loadAll(): Q.Promise<any> {
  return Q.all([
    loadSources()
  ]);
}

export function purgeAll() {
  return Q.all([
    ActionsService.clear(),
    ChannelItemsService.clear(),
    ChannelsService.clear(),
    GroupsService.clear(),
    IdentityService.clear(),
    SourcesService.clear()
  ]);
}
