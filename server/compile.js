// require npm modules
const Nanoid = require("nanoid");
const sleep = require("system-sleep");
const Dropbox = require("dropbox").Dropbox;
require("isomorphic-fetch");
require("dotenv").config();

// require addModule files
const honeyJar = require("./addModules/honeyJar")

// setup Dropbox
const dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN });
dbx.filesListFolder({path: ''})
.then(function(response) {
	console.log(response.entries);
})
.catch(function(error) {
	console.error(error);
});

// function to create folder
function createFolder (folderPath) {
    dbx.filesCreateFolderV2({path: folderPath})
    .then(function(response) {
    console.log(response);
    })
    .catch(function(error) {
    console.error(error);
	});
	sleep(50);
}

// compilePack function that gets exported to app.js
module.exports.compilePack  = function(requestBody) {

	// generate id
    id = Nanoid.nanoid(4)
    console.log("id="+id)
	
	// create value for invidual pack path
	const packPath = `/packs/${id}`
	console.log("pack path = "+packPath)

	// create pack folder
	createFolder(packPath);
	
	// skeleton folder structure
	//const skeletonFoldersToCreate = [ "textures", "textures/item"]
	//for (i in skeletonFoldersToCreate ) { createFolder((packPath+"/"+ skeletonFoldersToCreate[i] )) }
	//for (i in skeletonFoldersToCreate ) { console.log((packPath+"/"+ skeletonFoldersToCreate[i] )) }
	
	console.log("hi im alive")
	const texturesPath = packPath+"/assets/minecraft/textures/item"
	createFolder(texturesPath);
	
}