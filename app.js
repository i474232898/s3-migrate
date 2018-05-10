const config = require('./config');
const DataRiver = require('./lib/data-river');

const worker = new DataRiver(config); 
worker.migrateByChunks().then(console.log);
