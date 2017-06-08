"use strict";

import {Source, SourceType} from "../../src/model/source";

describe('Source constructor', () => {

  describe('parameter', () => {
    const source = new Source('id_1', 'name_1', 'http://localhost:3000/data', SourceType.m3u);

    it('id is properly set', () => expect(source.id).toBe('id_1'));

    it('name is properly set', () => expect(source.name).toBe('name_1'));

    it('url is properly set', () => expect(source.url).toBe('http://localhost:3000/data'));

    it('source type is properly set', () => expect(source.type).toBe(SourceType.m3u));
  });
});
