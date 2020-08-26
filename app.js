// require modules
const express = require("express");
const Nanoid = require("nanoid");
const fs = require("fs");
const Dropbox = require("dropbox").Dropbox;
require("isomorphic-fetch");
require("dotenv").config();

// setup Dropbox
const dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN });

// get availableModules object
const availableModules = JSON.parse(fs.readFileSync('availableModules.json'))

function uploadFile (storageFilePath,packFilePath,packRoot) {
	dbx.filesUpload({ path: packRoot+packFilePath, contents: fs.readFileSync(storageFilePath) })
	.then(function (response) {
		console.log(response)
		return "file uploaded"
	})
	.catch(function (err) {
		console.log(err);
		throw "fail"
	})
}

async function uploadMultipleFiles (storageFilePaths,packFilePaths,packRoot) {
	try {
		for (i in storageFilePaths) {
			await uploadFile(storageFilePaths[i],packFilePaths[i],packRoot)
		}
		return "files uploaded"
	} catch {
		console.log(err)
		throw "fail"
	}
}

function getShareLink (packRoot) {
	try {
		dbx.sharingCreateSharedLink({path: packRoot})
		return response.url.slice(0, -1)+"1")
	} catch {
		console.log(err)
		throw "fail"
	}
}

async function addFilesGetDownload (selectedModules) {

	// generate id and create pack path
	const id = Nanoid.nanoid(5)	
	const packPath = `/packs/LittleImprovementsCustom_${id}`
	console.log("pack path = "+packPath)

	// add modules files to pack
	for (i in availableModules) {
		if (selectedModules.includes (availableModules[i].id)) {
		  await uploadMultipleFiles(availableModules[i].storageFiles,availableModules[i].packFiles,packPath)
		}
	}

	// add pack.mcmeta file
	await uploadFile("storage/pack.mcmeta","/pack.mcmeta",packPath)

	// get share link and return it
  	const shareLink = await getShareLink(packPath)
  	return shareLink

}

// setup express
const app = express();
app.use(express.json()); // to support JSON-encoded bodies

app.use(express.static("public"));

app.get('/', (req, res) => res.sendFile(__dirname+"/public/index.html") );
app.get('/credits', (req, res) => res.sendFile(__dirname+"/public/credits.html") );

// how to handle a post request, sent by the client-side js
app.post('/', function (req, res) {
  console.log(req.body)
  if (req.body.new=="true") {
  	(async function() {
    	res.send(await addFilesGetDownload(req.body.modules))
  	})();
    
    } else {
      res.send('sorry ur bad');
    }
  
})

// listen server with express
app.listen(process.env.PORT || 3000, 
	() => console.log("Server running"));