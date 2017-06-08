'use strict';

import * as ChannelsService from "../dao/channelsService";
import * as _ from "lodash";
import {Channel} from "../model/channel";
import Dictionary = _.Dictionary;

export function setRoutes(router) {
  function processError(res: any, promise: Q.Promise<any>) {
    promise.catch(function (e) {
      console.log(e);
      res.status(500).json({
        error: e
      });
    });
  }

  router.get('/', function (req, res) {
    processError(
      res,
      ChannelsService.getAll().then(function (channels: Dictionary<Channel>) {
        res.json(
          _.map(channels, function (channel: Channel) {
            return channel;
          })
        );
      })
    );
  });
  return router;
}
