"use strict";

export class Group {

  private _changed: boolean = false;

  constructor(private _name: string, private _order: number = 0, private _displayName?: string) {
  }

  get name(): string {
    return this._name;
  }

  get order(): number {
    return this._order;
  }

  get displayName(): string {
    return this._displayName || this.name;
  }

  get changed(): boolean {
    return this._changed;
  }

  set order(value: number) {
    this._changed = !this._changed && this.order !== value;
    this._order = value;
  }

  set displayName(value: string) {
    this._changed = !this._changed && this._displayName !== value;
    this._displayName = value;
  }
}
