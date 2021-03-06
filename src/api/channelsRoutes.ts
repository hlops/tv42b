'use strict';

import * as _ from 'lodash';
import channelsService from '../dao/channelsService';

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
		processError(res, res.json(_.map(channelsService.value, channel => channel)));
	});
	return router;
}
