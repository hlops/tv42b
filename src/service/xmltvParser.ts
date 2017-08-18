'use strict';

import * as _ from 'lodash';
import * as moment from "moment";
import * as stream from 'stream';
import {Readable} from 'stream';
import Q = require('q');
import sax = require('sax');
import zlib = require('zlib');

interface Attributes {
  [name: string]: string;
}

interface Node {
  name: string;
  attributes: Attributes;
  children: Node[];
  isSelfClosing: boolean;
}

export class Programme {
  channel: string;
  start: Date;
  duration: number;
  title: string;
  category?: string;
  desc?: string;

  constructor(channel: string, start: Date, stop: Date, title: string, category?: string, desc?: string) {
    this.channel = channel;
    this.start = start;
    this.duration = stop.getTime() - start.getTime();
    this.title = title;
    this.category = category;
    this.desc = desc;
  }
}

class XmlTvParser extends stream.Writable {
  private _currentNode: Node;
  private _parentNodes: Node[] = [];
  private _xmlParser: any;

  constructor() {
    super();

    const channels = {};

    this._xmlParser = sax.createStream(true, {
      trim: true,
      position: false
    });

    this.on('finish', () => {
      this._xmlParser.end();
    });

    this._xmlParser.on('end', () => {
      this.emit('end');
    });

    this._xmlParser.on('error', error => {
      this.emit('end', error);
    });

    this._xmlParser.on('opentag', (node: Node) => {
      this._currentNode = node;
      if (!_.get(_.last(this._parentNodes), 'isSelfClosing')) {
        this._parentNodes.push(node);
      }
    });

    this._xmlParser.on('closetag', tagName => {
      if (tagName === 'programme') {
        let node = this._parentNodes[this._parentNodes.length - 1];
        this.emit('programme', new Programme(
          channels[node.attributes.channel],
          XmlTvParser.parseDate(node.attributes.start),
          XmlTvParser.parseDate(node.attributes.stop),
          node.attributes.title,
          node.attributes.category,
          node.attributes.desc
        ));
      }
      this._parentNodes.pop();
    });

    this._xmlParser.on('text', text => {
      const nodeName = this._currentNode.name;
      if (nodeName === 'display-name') {
        let channel = this._parentNodes[this._parentNodes.length - 2];
        if (channel && channel.name === 'channel') {
          channels[channel.attributes.id] = text;
        }
      }
      if (['title', 'category', 'desc'].indexOf(nodeName) >= 0) {
        let programme = this._parentNodes[this._parentNodes.length - 2];
        if (programme && programme.name === 'programme') {
          programme.attributes[nodeName] = text;
        }
      }
    });
  }

  static parseDate(date): Date {
    const parsed = moment(date, 'YYYYMMDDHHmmss Z', true);
    return parsed.toDate();
  };

  _write(chunk: any, encoding: string, callback: Function): void {
    this._xmlParser.write(chunk, encoding);
    callback();
  }
}

export function parseGzip(input: Readable): Q.Promise<void> {
  return parse(input.pipe(zlib.createGunzip()));
}

export function parse(input: Readable): Q.Promise<void> {
  const parser = new XmlTvParser();
  input.pipe(parser);

  return Q.Promise<void>((resolve, reject, notify) => {
    parser.on('programme', function (programme: Programme) {
      notify(programme);
    });

    parser.on('end', function () {
      resolve(undefined);
    });

    parser.on('error', function (error) {
      reject(error);
    });
  });
}
