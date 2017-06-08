"use strict";

export class Action {
  private _started: Date;
  private _finished: Date;
  private _error: any;
  private _messages: string[];

  constructor(private _id: string, private _text: string) {
    this._started = new Date();
    this._messages = [];
  }

  get id(): string {
    return this._id;
  }

  get text(): string {
    return this._text;
  }

  get finished(): Date {
    return this._finished;
  }

  get error(): any {
    return this._error || false;
  }

  get started(): Date {
    return this._started;
  }

  get messages(): string[] {
    return this._messages;
  }

  public done(error?: string) {
    this._error = error || '';
    this._finished = new Date();
  }

  public log(message: string) {
    this._messages.push(message);
  }
}
