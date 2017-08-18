'use strict';

import * as EventQueue from './events/EventQueue';
import * as _ from 'lodash';
import actionsService from '../dao/actionsService';
import channelItemsService from '../dao/channelItemsService';
import channelsService from '../dao/channelsService';
import groupsService from '../dao/groupsService';
import identityService from '../dao/identityService';
import sourcesService from '../dao/sourcesService';
import { SourceType } from '../model/source';
import Q = require('q');
import fs = require('fs');

export function loadDefaultValues(): Q.Promise<void> {
	return EventQueue.initialization.isReady().then(() => {
		if (identityService.isEmpty()) {
			purgeAll();
			return loadAll();
		}
	});
}

export function loadSources(
	path: string = `${__dirname}/../assets/initialValues/sources.json`
): Q.Promise<void> {
	return Q.Promise<void>(function(resolve) {
		fs.readFile(path, function(err, data) {
			let values = JSON.parse(data.toString('UTF-8'));
			_.each(values, function(value) {
				sourcesService.create(value.name, value.url, SourceType[<string>value.type]);
			});
			resolve(undefined);
		});
	});
}

export function loadChannelItems(
	path: string = `${__dirname}/../assets/initialValues/channelItems.json`
): Q.Promise<void> {
	return Q.Promise<any>(function(resolve) {
		fs.readFile(path, function(err, data) {
			let values: any[] = JSON.parse(data.toString('UTF-8'));
			Q.all(
				_.map(values, value => channelItemsService.create(value.name, value.group, value.shift))
			)
				.then(resolve)
				.done();
		});
	});
}

function loadAll(): Q.Promise<any> {
	return Q.all([loadSources()]);
}

export function purgeAll(): void {
	actionsService.clear();
	channelItemsService.clear();
	channelsService.clear();
	groupsService.clear();
	sourcesService.clear();
}
