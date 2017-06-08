const Jasmine = require('jasmine');

let j = new Jasmine();

j.loadConfigFile('./jasmine.json');
j.configureDefaultReporter({
	showColors: true
});
j.execute();
