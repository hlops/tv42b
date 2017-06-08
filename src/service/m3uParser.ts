'use strict';

import * as _ from "lodash";
import {Channel} from "../model/channel";
import {SourceAction} from "../model/actions/SourceAction";
import Dictionary = _.Dictionary;
import Q = require("q");
import fs = require('fs');
import readline = require('readline');

class EXTINFItem {
  url: string;
  group: string;
  name: string;
  options: Dictionary<string>;
}

export function parse(action: SourceAction, input: any): Q.Promise<void> {
  const rl = readline.createInterface({
    input: input,
  });

  let item: EXTINFItem = new EXTINFItem();
  let group: string;

  return Q.Promise<void>(function (resolve, reject, notify) {

    function parseEXTM3U(line: string) {
      _.transform(line.split(' '), function (result, value) {
        let attr = value.split('=');
        if (attr.length === 2) {
          result[attr[0]] = attr[1];
        }
      });
    }

    function parseEXTINF(line: string) {
      let lines = line.split(',');
      if (lines.length < 2) {
        throw 'no comma in ' + line;
      }
      item.name = lines[1];
      line = lines[0];

      item.options = _.transform(line.split(' '),
        function (result: Dictionary<string>, value: string) {
          let attr = value.split('=');
          if (attr.length === 2) {
            if (attr[0] === 'group-title') {
              group = attr[1];
            } else {
              result[attr[0]] = attr[1];
            }
          }
        }, {});
    }

    rl.on('line', (line: string) => {
      if (line.startsWith("#EXTM3U")) {
        parseEXTM3U(line);
      }

      if (line.startsWith("#EXTINF")) {
        parseEXTINF(line);
      } else {
        if (line && item.name) {
          item.url = line;
          item.group = group;
          notify(new Channel(action, item.url, item.name, item.group, item.options));
        }
        item = new EXTINFItem();
      }
    });

    rl.on('close', function () {
      resolve(undefined);
    });
  });
}
