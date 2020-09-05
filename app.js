// require modules
const express = require("express");
const Nanoid = require("nanoid");
const fs = require("fs");
const Dropbox = require("dropbox").Dropbox;
require("isomorphic-fetch");
require("dotenv").config();

// setup Dropbox
const dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN });

const availableModules = JSON.parse(fs.readFileSync('storage/data/modules.json'))

// setup express
const app = express()
app.use(express.json()) // to support JSON-encoded bodies

app.use(express.static("public"))
app.use('/favicon.ico', express.static('public/logo/favicon.ico'))

app.get('/api/modules', (req, res) => res.sendFile(__dirname+"/storage/data/modules.json") )
app.get('/api/credits', (req, res) => res.sendFile(__dirname+"/storage/data/credits.json") )

app.get('/', (req, res) => res.sendFile(__dirname+"/public/index.html") )
app.get('/credits', (req, res) => res.sendFile(__dirname+"/public/credits.html") )

// how to handle a post request, sent by the client-side js
app.post('/', function (req, res) {
	console.log(req.body)
	if (req.body.new=="true") {

        // generate id and create pack path
		const packPath = `/packs/LittleImprovementsCustom_${Nanoid.nanoid(5)}`
		console.log("pack path = "+packPath)

        let storageFilePathsToUpload = ["storage/pack.mcmeta","storage/pack.png","storage/credits.txt"]
        let packFilePathsToUpload = ["/pack.mcmeta","/pack.png","/credits.txt"]

        for (i in availableModules){
            if (req.body.modules.includes(availableModules[i].id)) {
                storageFilePathsToUpload=storageFilePathsToUpload.concat(availableModules[i].storageFiles)
                packFilePathsToUpload=packFilePathsToUpload.concat(availableModules[i].packFiles)
            }
        }	
		
		(async function () {
			entries = []
			const selectedModulesData = JSON.stringify(req.body.modules)
			await dbx.filesUploadSessionStart({
				contents: selectedModulesData,
				close: true,
			})
			.then(function (response) {
				entries.push({cursor:{session_id:response.session_id,offset:selectedModulesData.length},commit:{path:packPath+"/selectedModules.json"}})
			})
			.catch(function (err) {
				console.error(err)
			})
			for (let [index,val] of storageFilePathsToUpload.entries()) {
				let fileData = fs.readFileSync(val)
				await dbx.filesUploadSessionStart({
					contents: fileData,
					close: true,
				})
				.then(function (response) {
					entries.push({cursor:{session_id:response.session_id,offset:fileData.length},commit:{path:packPath+packFilePathsToUpload[index]}})
				})
				.catch(function (err) {
					console.error(err)
				})
			}
		})().then(()=>{
			console.log(entries)
			dbx.filesUploadSessionFinishBatch({entries:entries})
			.then(function(response){
				var checkIntervalID = setInterval(checkBatch,2000)
				function checkBatch () {
					dbx.filesUploadSessionFinishBatchCheck({async_job_id: response.async_job_id})
					.then(function(output){
						console.log(output)
						if (output[".tag"] == "complete" ) {
							(async function (packPath) {
								try {
									const response = await dbx.sharingCreateSharedLink({path: packPath})
									return response.url.slice(0, -1)+"1"
								} catch (err) { throw err }
							})(packPath)
							.then((response)=>res.send(response))
							.catch((error)=>{
								res.send("error")
								console.error(error)
							})
							clearInterval(checkIntervalID)
						}
					})
					.catch(function(err){
						console.error(err)
					})
				}
			}).catch(err => {
				console.error(err)
			})
			
		}).catch((err)=>{console.error(err)})



    } else {
      res.send('sorry ur bad')
    }
  
})

// listen server with express
app.listen(process.env.PORT || 3000, 
	() => console.log("Server running"))