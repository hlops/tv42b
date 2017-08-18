'use strict';

import * as _ from 'lodash';
import * as fs from 'fs';
import { parse, parseGzip, Programme } from '../../src/service/xmltvParser';

describe('xmltvParser', () => {
	it('parse() can parse xmltv', done => {
		// noinspection NonAsciiCharacters
    let counters = { 'Первый канал': 152, 'Россия 1': 148 };
		parse(fs.createReadStream('src/assets/test/xmltv'))
			.progress(programme => {
				counters[programme.channel]--;
			})
			.then(() => {
				expect(_.values(counters)).toEqual([0, 0]);
			})
			.catch(error => {
				fail(error);
			})
			.finally(done)
			.done();
	});

	it('parse() can parse xmltv.gz', done => {
		// noinspection NonAsciiCharacters
    let counters = { 'Первый канал': 152, 'Россия 1': 148 };
		parseGzip(fs.createReadStream('src/assets/test/xmltv.gz'))
			.progress((programme: Programme) => {
				counters[programme.channel]--;
			})
			.then(() => {
				expect(_.values(counters)).toEqual([0, 0]);
			})
			.catch(error => {
				fail(error);
			})
			.finally(done)
			.done();
	});
});
