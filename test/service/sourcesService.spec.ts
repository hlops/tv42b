'use strict';

import * as _ from 'lodash';
import {Dictionary} from 'lodash';
import sourcesService from '../../src/dao/sourcesService';
import {Source, SourceType} from '../../src/model/source';

describe('Source service', () => {
  const originalSource = new Source('12345', 'name', 'file://localhost:3000/data', SourceType.m3u);

  beforeEach(function () {
    sourcesService.clear();
  });

  describe('create()', () => {
    it('returns new Source instance', function () {
      const source: Source = sourcesService.create(
        'name',
        'http://localhost:3000/data',
        SourceType.xlmtv
      );
      expect(source).toBeDefined();
      expect(isNaN(parseInt(source.id, 36))).toBe(false);
      expect(source.name).toBe('name');
      expect(source.url).toBe('http://localhost:3000/data');
      expect(source.type).toBe(SourceType.xlmtv);
    });
  });

  describe('getSources()', () => {
    it('returns empty object', function () {
      const sources: Dictionary<Source> = sourcesService.value;
      expect(_.isEmpty(sources)).toBe(true);
    });
  });

  describe('add()', () => {
    it('add new source', function () {
      sourcesService.add(originalSource);
      const source = sourcesService.value[originalSource.id];
      expect(source).toBe(originalSource);
    });

    it('throw error on adding existing source', function () {
      sourcesService.add(originalSource);
      try {
        sourcesService.add(originalSource);
        fail('No exception was thrown');
      } catch (error) {
        expect(error).toBe('Source already exists: ' + originalSource.id);
      }
    });
  });

  describe('update()', () => {
    it('save existing source', function () {
      sourcesService.add(originalSource);
      const source = sourcesService.value[originalSource.id];
      expect(source).toBe(originalSource);
    });

    it('throw error on edit nonexistent source', function () {
      try {
        sourcesService.update(originalSource);
        fail('No exception was thrown');
      } catch (error) {
        expect(error).toBe('Source not found: ' + originalSource.id);
      }
    });
  });

  /*
    describe('processSource()', () => {
      it('integration test 1', function (done) {
        const originalSources = [
          new Source('1001', 'name1', '/assets/test/playlist2.m3u', SourceType.m3u),
          new Source('1002', 'name2', '/assets/test/playlist3.m3u', SourceType.m3u)
        ];
        Q.all(_.map(originalSources, source => SourcesService.add(source)))
          .then(() =>
            DefaultValuesLoaderService.loadChannelItems(
              `${__dirname}/../../../test/service/channelItems.json`
            )
          )
          .then(() => ChannelItemsService.getAll())
          .then(items => {
            expect(_.keys(items).length).toBe(1);
            const item = items['Первый'];
            expect(item).toBeDefined();
            expect(item.m3u.name).toBe('Первый');
            expect(item.m3u.group).toBe('Эфир');
            expect(item.changed).toBe(true);
          })
          .then(() => SourcesService.getSources())
          .then(function (sources: _.Dictionary<Source>) {
            expect(_.keys(sources).length).toBe(2);
            return Q.all(
              _.map(sources, source =>
                SourcesService.processSource(source).then(source =>
                  ChannelItemsService.processSource(source)
                )
              )
            );
          })
          .then(function () {
            return Q.all(
              _.map(originalSources, source =>
                SourcesService.processSource(source.id).then(source =>
                  ChannelItemsService.processSource(source.id)
                )
              )
            );
          })
          .then(() => ActionsService.getAll())
          .then(function (actions: _.Dictionary<Action>) {
            expect(_.keys(actions).length).toBe(4);
          })
          .then(() => ChannelsService.getAll())
          .then(function (channels: _.Dictionary<Channel>) {
            expect(_.keys(channels).length).toBe(4);
          })
          .then(() => ChannelItemsService.getAll())
          .then(function (channelItems: _.Dictionary<ChannelItem>) {
            expect(_.keys(channelItems).length).toBe(4);
            return M3UBuilder.build();
          })
          .then(function (data) {
            console.log();
            console.log(data);
          })
          .finally(done)
          .done();
      });
    });
  */
});
