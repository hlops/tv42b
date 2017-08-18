'use strict';

import * as _ from 'lodash';
import actionsService from '../dao/actionsService';
import { Action } from '../model/action';

export function setRoutes(router) {
	function processError(res: any, promise: Q.Promise<any>) {
		promise.catch(function(e) {
			console.log(e);
			res.status(500).json({
				error: e
			});
		});
	}

	router.get('/', function(req, res) {
		processError(
			res,
			res.json(
				_.map(actionsService.value, function(action: Action) {
					return action;
				})
			)
		);
	});
	return router;
}
