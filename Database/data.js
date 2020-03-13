const Datastore = require('nedb');

const db = new Datastore('path/Database/shorturl.db');

db.loadDatabase();

module 