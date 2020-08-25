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
  return new Promise((resolve,reject) => {
    	dbx.filesUpload({ path: packRoot+packFilePath, contents: fs.readFileSync(storageFilePath) })
		.then(function (response) {
			console.log(response)
			resolve("file uploaded")
		})
		.catch(function (err) {
			console.log(err);
			reject("failed")
		})
  })
}

async function uploadMultipleFiles (storageFilePaths,packFilePaths,packRoot) {
	return new Promise(async (resolve,reject) => {
		try {
			for (i in storageFilePaths) {
				await uploadFile(storageFilePaths[i],packFilePaths[i],packRoot)
			}
			resolve("files uploaded")
		} catch {
			console.log(err)
			reject("fail")
		}
	})
}

function getShareLink (packRoot) {
	return new Promise((resolve,reject) => {
		dbx.sharingCreateSharedLink({path: packRoot})
        .then(function(response) {
			console.log(response.url.slice(0, -1)+"1")
        	resolve(response.url.slice(0, -1)+"1")
        })
        .catch(function(error) {
			console.log(error)
			reject("fail")
        });
	})
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
	console.log(shareLink)
  return shareLink

}

// setup express
const app = express();
app.use(express.json()); // to support JSON-encoded bodies

// webpage the user sees, on a get request
app.use(express.static("public"));

// how to handle a post request, sent by the client-side js
app.post('/', function (req, res) {
  console.log(req.body)
  if (req.body.new=="true") {
    // // generate id and create pack path
    // const id = Nanoid.nanoid(5)	
    // const packPath = `/packs/LittleImprovementsCustom_${id}`
    // console.log("pack path = "+packPath)

    // // ADD PACK FILES
    // // go through every available module, and if it is included in the request body, run the function to add it
    // for (i in availableModules) {
    //   if (req.body.modules.includes (availableModules[i].id)) {
    //     uploadMultipleFiles(availableModules[i].storageFiles,availableModules[i].packFiles,packPath)
    //   }
    // }

    // // add pack.mcmeta file, and create sharing link
    // fs.readFile("storage/pack.mcmeta", function (err, contents){
    //   dbx.filesUpload({ path: packPath+"/pack.mcmeta", contents: contents })
    //   .then(function (response) {
    //     console.log(response);
    //     dbx.sharingCreateSharedLink({path: packPath})
    //     .then(function(response) {
    //       res.send(response.url.slice(0, -1)+"1")
    //     })
    //     .catch(function(error) {
    //       console.log(error);
    //     });
    //   })
    //   .catch(function (err) {
    //     console.log(err);
    //   });
	// })
  (async function() {
    const downloadLink = await addFilesGetDownload(req.body.modules)
	  console.log("dl="+downloadLink)
    res.send(downloadLink)
  })();
    
    } else {
      res.send('sorry ur bad');
    }
  
})

// listen server with express
app.listen(process.env.PORT || 3000, 
	() => console.log("Server running"));