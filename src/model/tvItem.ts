"use strict";

export class TvItem {
  private _title: string;
  private _desc: string;
  private _date: number;
  private _duration: number;
  private _channel: number;

  constructor(title: string, desc: string, date: number, duration: number, channel: number) {
    this._title = title;
    this._desc = desc;
    this._date = date;
    this._duration = duration;
    this._channel = channel;
  }

  get title(): string {
    return this._title;
  }

  get desc(): string {
    return this._desc;
  }

  get date(): number {
    return this._date;
  }

  get duration(): number {
    return this._duration;
  }

  get channel(): number {
    return this._channel;
  }
}
