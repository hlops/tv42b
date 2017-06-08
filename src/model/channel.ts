"use strict";
import Dictionary = _.Dictionary;
import {SourceAction} from "./actions/SourceAction";

const HTTP_PROXY = 'http://192.168.1.1:4000/udp/';

export interface IChannel {
  name: string;
  sourceId: string;
  group: string;
  shift: number;
}

export class Channel implements IChannel {
  private _actionId: string;
  private _sourceId: string;
  private _shift: number;

  constructor(action: SourceAction,
              private _url: string,
              private _name: string,
              private _group: string,
              private _options: Dictionary<string>) {
    this._url = Channel.httpProxy(_url.trim());
    this._name = _name.trim();
    this._group = Channel.trimQuotes(_group);
    this._actionId = action.id;
    this._sourceId = action.source.id;
    this._shift = Number.parseInt(_options['tvg-shift']);
  }

  get actionId(): string {
    return this._actionId;
  }

  get sourceId(): string {
    return this._sourceId;
  }

  get url(): string {
    return this._url;
  }

  set url(value: string) {
    this._url = value;
  }

  get key(): string {
    return Channel.buildKey(this._url);
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get group(): string {
    return this._group;
  }

  set group(value: string) {
    this._group = value;
  }

  get shift(): number {
    return isNaN(this._shift) ? 0 : this._shift;
  }

  get options(): Dictionary<string> {
    return this._options;
  }

  set options(value: Dictionary<string>) {
    this._options = value;
  }

  static httpProxy(url: string) {
    if (url.startsWith('udp://')) {
      url = HTTP_PROXY + url.substring(7);
    }
    return url.toLocaleLowerCase();
  }

  static trimQuotes(text: string): string {
    return text.replace(/(^[\''"\s]+)|([\'"\t]$)/g, '');
  }

  static buildKey(value: string): string {
    let s = value.replace(HTTP_PROXY, '');
    return s.replace(/(^http[:/]*)|[\///]+/g, '');
  }


}
