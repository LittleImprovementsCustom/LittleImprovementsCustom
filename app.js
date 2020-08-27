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
const availableModules = JSON.parse(fs.readFileSync('storage/data/modules.json'))

async function uploadMultipleFiles (storageFilePaths,packFilePaths,packRoot) {
	try {
		for (i in storageFilePaths) {
			console.log(await dbx.filesUpload({ path: packRoot+packFilePaths[i], contents: fs.readFileSync(storageFilePaths[i]) }))
		}
	} catch (err) {
		throw err
	}
}

async function getShareLink (packRoot) {
	try {
		const response = await dbx.sharingCreateSharedLink({path: packRoot})
		return response.url.slice(0, -1)+"1"
	} catch (err) {
		throw err
	}
}

async function addFilesGetDownload (selectedModules) {
	try {
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

		// add pack.mcmeta, pack.png and credits.txt
		await uploadMultipleFiles(["storage/pack.mcmeta","storage/pack.png","storage/credits.txt"],["/pack.mcmeta","/pack.png","/credits.txt"],packPath)

		// add selectedModules.json file
		console.log(await dbx.filesUpload({
			path:packPath+"/selectedModules.json",
			contents: JSON.stringify(selectedModules)
		}))

		// get share link and return it
		const shareLink = await getShareLink(packPath)
		return shareLink
	} catch (err) {
		console.log(err)
		// return "error", so the client knows and can show fail toast
		return "error"
	}
}

// setup express
const app = express();
app.use(express.json()); // to support JSON-encoded bodies

app.use(express.static("public"));
app.use('/favicon.ico', express.static('public/logo/favicon.ico'));

app.get('/modulesData', (req, res) => res.sendFile(__dirname+"/storage/data/modules.json") );
app.get('/creditsData', (req, res) => res.sendFile(__dirname+"/storage/data/credits.json") );

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