// requirements
const Nanoid = require("nanoid");
const Dropbox = require("dropbox").Dropbox;
require("isomorphic-fetch");
require("dotenv").config();
const fs = require("fs");

// setup Dropbox
const dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN });
module.exports.dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN });;

// get availableModules object
fs.readFile('availableModules.json',
    // callback function that is called when reading file is done
    function(err, data) { 
	// parse json
	var availableModules = JSON.parse(data);
});
// access elements
console.log(availableModules)


function uploadFiles ( storageFilePaths, packFilePaths, packRoot ) {
	for (i in storageFilePaths) {
		fs.readFile(storageFilePaths[i], function (err, contents){
			dbx.filesUpload({ path: packRoot+packFilePaths[i], contents: contents })
			.then(function (response) {
			  console.log(response);
			})
			.catch(function (err) {
			  console.log(err);
			});
		});
	}
}

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
		uploadFiles(["storage/modules/honeyJar/textures/item/honey_bottle.png"],["/assets/minecraft/textures/item/honey_jar.png"],packPath)
	}

	/*
	// test sharing link gen
	dbx.sharingCreateSharedLink({path: "/modules"})
	.then(function(response) {
		console.log(response);
	  })
	  .catch(function(error) {
		console.log(error);
	  });
	*/
}

