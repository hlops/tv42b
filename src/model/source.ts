"use strict";

export class Source {
  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get url(): string {
    return this._url;
  }

  set url(value: string) {
    this._url = value;
  }

  get type(): SourceType {
    return this._type;
  }

  set type(value: SourceType) {
    this._type = value;
  }

  constructor(private _id: string,
              private _name: string,
              private _url: string,
              private _type: SourceType) {
  }

}

export enum SourceType {
  m3u, xlmtv
}
