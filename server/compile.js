// requirements
const Nanoid = require("nanoid");
const fs = require("fs");
const Dropbox = require("dropbox").Dropbox;
require("isomorphic-fetch");
require("dotenv").config();

// setup Dropbox
const dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN });

// get availableModules object
const availableModules = JSON.parse(fs.readFileSync('availableModules.json'))

function uploadFiles ( storageFilePaths, packFilePaths, packRoot ) {
	for (i in storageFilePaths) {
		fs.readFile(storageFilePaths[i], function (err, contents){
			dbx.filesUpload({ path: packRoot+packFilePaths[i], contents: contents })
			.then(function (response) {
				console.log(response);
				if (createSharingLink) {
					dbx.sharingCreateSharedLink({path: packRoot})
					.then(function(response) {
						return response.url
					  })
					.catch(function(error) {
						console.log(error);
					});
				}
			})
			.catch(function (err) {
				console.log(err);
			});
		});
	}
}

// compilePack function that gets exported to app.js
module.exports.compilePack  = function(requestBody) {

	// generate id and create pack path
	const id = Nanoid.nanoid(5)	
	const packPath = `/packs/${id}`
	console.log("pack path = "+packPath)

	// ADD PACK FILES
	// go through every available module, and if it is included in the request body, run the function to add it
	for (i in availableModules) {
		if (requestBody.modules.includes (availableModules[i].id)) {
			uploadFiles(availableModules[i].storageFiles,availableModules[i].packFiles,packPath)
		}
	}

	// add pack.mcmeta file, and create sharing link
	// let downloadLink = uploadFiles(["storage/pack.mcmeta"],["/pack.mcmeta"],packPath,true)
	let downloadLink = ""
	fs.readFile("storage/pack.mcmeta", function (err, contents){
		dbx.filesUpload({ path: packPath+"/pack.mcmeta", contents: contents })
		.then(function (response) {
			console.log(response);
			dbx.sharingCreateSharedLink({path: packRoot})
			.then(function(response) {
				downloadLink = response.url
			})
			.catch(function(error) {
				console.log(error);
			});
		})
		.catch(function (err) {
			console.log(err);
		});
	});
	// replace the ?dl=0 with ?dl=1 for direct download link
	downloadLink = downloadLink.slice(0, -1)+"1"
	console.log(downloadLink)

}