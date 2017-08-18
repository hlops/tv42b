'use strict';

import * as _ from 'lodash';
import sourcesService from '../dao/sourcesService';
import { Source } from '../model/source';

export function setRoutes(router) {
	function processError(res: any, promise: Q.Promise<any>) {
		promise.catch(function(e) {
			console.log(e);
			res.status(500).json({
				error: e
			});
		});
	}

	/**
   * Get all sources
   */
	router.get('/', function(req, res) {
		processError(res, res.json(_.map(sourcesService.value, source => source)));
	});

	/**
   * Get all sources
   */
	router.get('/source', function(req, res) {
		processError(res, res.json(sourcesService.value[req.query.id]));
	});

	/**
   * Add new source
   */
	router.post('/', function(req, res) {
		let [id, name, url, type] = req.query;
		sourcesService.add(new Source(id, name, url, type));
		processError(res, res.sendStatus(201));
	});

	/**
   * Edit source
   */
	router.put('/', function(req, res) {
		let [id, name, url, type] = req.query;
		sourcesService.update(new Source(id, name, url, type));
		processError(res, res.sendStatus(200));
	});

	/**
   * Delete source
   */
	router.put('/', function(req, res) {
		sourcesService.removeSource(req.query.id);
		processError(res, res.sendStatus(200));
	});

	return router;
}
