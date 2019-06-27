const fs = require('fs');
const config = require('./nlu_data/config.json');
const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'] });

async function init() {

	if(fs.existsSync(`./${config.output_data}`)) {
		manager.load(`./${config.output_data}`);
		console.log(`Successfully loaded NLU Manager.`);
		return;
	}

	const data = JSON.parse(fs.readFileSync(`./${config.raw_data}`));
	Object.keys(data.documents).map(key => {
		data.documents[key].map(doc => {
			manager.addDocument('en', doc, key);
		});
	});

	await manager.train();
	manager.save(`./${config.output_data}`, true)
	console.log(`Successfully trained NLU Manager.`);
}

module.exports = {
	init: init,
	manager: manager
}