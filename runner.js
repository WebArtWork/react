const path = require('path');
const fs = require('fs');
const defaults = {
	module: {
		default: __dirname + '/module/default'
	}
}
/*
*	Module
*/
const new_module = function (waw) {
	if (!waw.path) {
		if (waw.ensure(
			process.cwd() + '/src/',
			'components',
			'Module already exists',
			true,
			(base) => {
				const json = waw.readJson(base + '/module.json');
				waw.install.npmi(process.cwd(), json.dependencies, () => {
					process.exit(1);
				}, { save: true });
			}
		)) return;
	}
	if (!fs.existsSync(process.cwd() + '/src/components')) {
		fs.mkdirSync(process.cwd() + '/src/components', '');
	}
	if (!waw.template) {
		return waw.read_customization(defaults, 'module', () => { new_module(waw) });
	}
	require(waw.template + '/cli.js')(waw);
}
module.exports.add = new_module;
module.exports.a = new_module;
const _fetch_module = (waw, location, callback) => {
	if (!fs.existsSync(location + '/module.json')) {
		return callback(false);
	}
	let json = waw.readJson(location + '/module.json');
	if (!json.repo) {
		return callback(false);
	}
	waw.fetch(path.normalize(location), json.repo, err => {
		json = waw.readJson(location + '/module.json');
		if (json.dependencies) {
			waw.each(json.dependencies, (name, version, next) => {
				waw.npmi({
					path: process.cwd(),
					name,
					version,
					save: true
				}, next);
			}, () => {
				callback(!err);
			});
		} else {
			callback(!err);
		}
	});
}
const fetch_module = function (waw) {
	if (waw.argv.length > 1) {
		_fetch_module(waw, process.cwd() + '/src/app/modules/' + waw.argv[1].toLowerCase(), done => {
			if (done) console.log(waw.argv[1] + ' were fetched from the repo');
			else console.log(waw.argv[1] + " don't have repo");
		});
	} else {
		let folders = waw.getDirectories(process.cwd() + '/src/app/modules');
		let counter = folders.length;
		for (let i = 0; i < folders.length; i++) {
			_fetch_module(waw, folders[i], () => {
				if (--counter === 0) {
					console.log('All possible modules were fetched from their repositories');
					process.exit(1);
				}
			});
		}
	}
}
module.exports.fetch = fetch_module;
module.exports.f = fetch_module;
/*
*	End Of
*/
