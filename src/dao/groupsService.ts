'use strict';

import { Group } from '../model/group';
import DaoService from './inner/daoService';

class GroupService extends DaoService<Group[]> {
	constructor() {
		super('groups', []);
	}
}

export default new GroupService();
