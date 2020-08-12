// requirements
const Nanoid = require("nanoid");
const sleep = require("system-sleep");
const Dropbox = require("dropbox").Dropbox;
const modulesList = require("/modulesList.json")
require("isomorphic-fetch");
require("dotenv").config();

// require addModule files
const honeyJar = require("./addModules/honeyJar")

// setup Dropbox
const dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN });
module.exports.dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN });;

// function to create folder
function createFolder (folderPath) {
    dbx.filesCreateFolderV2({path: folderPath})
    .then(function(response) {
    console.log(response);
    })
    .catch(function(error) {
    console.error(error);
	});
	// sleep to avoid namespace lock contentions
	sleep(100);
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
	const skeletonFoldersToCreate = [
		"textures/item",
		"textures/block"
	]
	for (i in skeletonFoldersToCreate) {createFolder(packPath+"/assets/minecraft/"+ skeletonFoldersToCreate[i])}

	// temp
	console.log(modulesList.mainModules)
	honeyJar.addModule(packPath)
	
}