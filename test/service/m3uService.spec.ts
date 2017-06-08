'use strict';

import * as m3uParser from "../../src/service/m3uParser";
import {Channel} from "../../src/model/channel";
import {Source, SourceType} from "../../src/model/source";
import {SourceAction} from "../../src/model/actions/SourceAction";
import Q = require("q");
import fs = require('fs');

describe('m3u', () => {
  it('parse() reads playlist1.m3u', (done) => {
    let counter = 0;
    let source: Source = new Source('1002', 'name', 'http://localhost:3000/test-data', SourceType.xlmtv);
    let action: SourceAction = new SourceAction('1001', 'test action', source);
    m3uParser.parse(action, fs.createReadStream('src/assets/test/playlist1.m3u'))
      .progress(function (channel: Channel) {
        expect(channel.url).toBeDefined();
        expect(channel.name).toBeDefined();
        expect(channel.group).toBeDefined();
        expect(channel.options).toBeDefined();

        switch (counter++) {
          case 0: {
            expect(channel.url).toBe('http://192.168.1.1:4000/udp/239.1.15.1:1234');
            expect(channel.name).toBe('Первый');
            expect(channel.group).toBe('Эфир');
            break;
          }
          case 1: {
            expect(channel.url).toBe('http://192.168.1.1:4000/udp/239.1.15.2:1234');
            expect(channel.name).toBe('Россия 1');
            expect(channel.group).toBe('Эфир');
            break;
          }
          case 116: {
            expect(channel.url).toBe('http://192.168.1.1:4000/udp/239.1.10.21:1234');
            expect(channel.name).toBe('Myzen HD');
            expect(channel.group).toBe('HD');
            break;
          }
        }
      })
      .then(function () {
        expect(counter).toBe(117);
      })
      .finally(done)
      .done();
  });
});
