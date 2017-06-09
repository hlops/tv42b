"use strict";

import {IChannel} from "./channel";

class M3U {
  private _name: string;
  private _sourceId: string;
  private _group: string;

  constructor(channel: IChannel) {
    this._name = channel.name;
    this._sourceId = channel.sourceId;
    this._group = channel.group;
  }


  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get sourceId(): string {
    return this._sourceId;
  }

  set sourceId(value: string) {
    this._sourceId = value;
  }

  get group(): string {
    return this._group;
  }

  set group(value: string) {
    this._group = value;
  }
}

class TV {
  private _name: string;

  constructor(channel: IChannel) {
    this._name = channel.name;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }
}

export class ChannelItem {
  private _name: string;
  private _shift: number;
  private _m3u: M3U;
  private _tv: TV;
  private _disabled: boolean = false;
  private _changed: boolean = false;

  constructor(private _id: string, channel: IChannel) {
    this._name = channel.name;
    this._m3u = new M3U(channel);
    this._tv = new TV(channel);
    this._shift = channel.shift;
  }

  get id(): string {
    return this._id;
  }

  get m3u(): M3U {
    return this._m3u;
  }

  get tv(): TV {
    return this._tv;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
  }

  get changed(): boolean {
    return this._changed;
  }

  set changed(value: boolean) {
    this._changed = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._changed = !this._changed && this._name !== value;
    this._name = value;
  }

  get shift(): number {
    return this._shift;
  }

  set shift(value: number) {
    this._changed = !this._changed && this._shift !== value;
    this._shift = value;
  }
}
