'use strict';

import * as EventQueue from '../../src/service/events/EventQueue';
import identityService from '../../src/dao/identityService';

describe('Identity service', () => {
	beforeAll(done => {
		EventQueue.initialization.isReady().then(done);
	});

	beforeEach(function() {
		identityService.clear();
	});

	it('', function() {
		let arr: any = [];
		for (let i = 1; i < 100; i++) {
			expect(identityService.next()).toBe(i.toString(36));
		}
	});
});
