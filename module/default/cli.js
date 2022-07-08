const fs = require('fs');
const path = require('path');
module.exports = function (waw) {
	fs.mkdirSync(path.dirname(waw.base+'.txt'), { recursive: true });
	let tsx = fs.readFileSync(waw.template + '/component.tsx', 'utf8');
	tsx = tsx.split('CNAME').join(waw.Name);
	tsx = tsx.split('NAME').join(waw.name);
	fs.writeFileSync(waw.base + '.tsx', tsx, 'utf8');
	let scss = fs.readFileSync(waw.template + '/component.module.scss', 'utf8');
	scss = scss.split('CNAME').join(waw.Name);
	scss = scss.split('NAME').join(waw.name);
	fs.writeFileSync(waw.base + '.module.scss', scss, 'utf8');
	console.log('Module has been created');
	process.exit();
}
