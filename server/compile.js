// requirements
const Nanoid = require("nanoid");
const sleep = require("system-sleep");
const Dropbox = require("dropbox").Dropbox;
const modulesList = require("./modulesList.json")
require("isomorphic-fetch");
require("dotenv").config();

// require addModule files
const honeyJar = require("./addModules/honeyJar")

// setup Dropbox
const dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN });
module.exports.dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN });;

// delcare values for lists of modules
const mainModules = modulesList.mainModules

// compilePack function that gets exported to app.js
module.exports.compilePack  = function(requestBody) {

	// generate id
    id = Nanoid.nanoid(4)
    console.log("id="+id)
	
	// create value for invidual pack path
	const packPath = `/packs/${id}`
	console.log("pack path = "+packPath)

	// go through every available module, and if it is included in the request body, run the function to add it
	if ( requestBody.modules.includes ("honeyJar") ) {
		console.log("yes honey jar")
		honeyJar.addModule(packPath)
	} else {
		console.log("no honey jar")
	}

	// test sharing link gen
	dbx.sharingCreateSharedLink({path: "/modules"})
	.then(function(response) {
		console.log(response);
	  })
	  .catch(function(error) {
		console.log(error);
	  });

	// temp
	//honeyJar.addModule(packPath)
	
}