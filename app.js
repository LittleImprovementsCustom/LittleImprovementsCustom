// require modules
const express = require("express")
const Nanoid = require("nanoid")
const fs = require("fs")
const Dropbox = require("dropbox").Dropbox
require("isomorphic-fetch")
require("dotenv").config()

// setup Dropbox
const dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN })

const availableModules = JSON.parse(fs.readFileSync("storage/data/modules.json"))

// setup express
const app = express()
app.use(express.json()) // to support JSON-encoded bodies

app.use(express.static("public"))
app.use("/favicon.ico", express.static("public/logo/favicon.ico"))

// api reqyests
app.get("/api/modules", (req, res) => res.sendFile(__dirname+"/storage/data/modules.json") )
app.get("/api/credits", (req, res) => res.sendFile(__dirname+"/storage/data/credits.json") )

// html webpage requests
app.get("/", (req, res) => res.sendFile(__dirname+"/public/index.html") )
app.get("/credits", (req, res) => res.sendFile(__dirname+"/public/credits.html") )
app.get("*", (req, res) => res.sendFile(__dirname+"/public/404.html", 404) ) // 404 page


// how to handle a post request, sent by the client-side js
app.post("/", function (req, res) {
	console.log(req.body)
	if (req.body.new=="true") {
		
		// generate id and create pack path
		const packPath = `/packs/LittleImprovementsCustom_${Nanoid.nanoid(5)}`
		console.log("pack path = "+packPath)

		// create variable with selected modules; gets updated later
		let selectedModules = req.body.modules

		// create variables with file paths to upload; gets updated later
		let storageFilePathsToUpload = ["storage/pack.mcmeta","storage/pack.png","storage/credits.txt"]
		let packFilePathsToUpload = ["/pack.mcmeta","/pack.png","/credits.txt"]


		// system to deal with incompatibilities
		for (i in availableModules) {
			if ( (!availableModules[i].incompatibilities==undefined) && (selectedModules.includes(availableModules[i].id)) ) { // module has incompatibilities and is selected
				for (x in availableModules[i].incompatibilities) {
					if (selectedModules.includes(availableModules[i].incompatibilities[x].id)) { // an incompatible module is selected

						// remove modules from selectedModules
						selectedModules.splice(selectedModules.indexOf(availableModules[i].id),1)
						selectedModules.splice(selectedModules.indexOf(availableModules[i].incompatibilities[x].id),1)

						// add file paths to relevant arrays
						storageFilePathsToUpload=storageFilePathsToUpload.concat(availableModules[i].incompatibilities[x].storageFiles)
						packFilePathsToUpload=packFilePathsToUpload.concat(availableModules[i].incompatibilities[x].packFiles)

					}
				}
			}
			if (selectedModules.includes(availableModules[i].id)) {
				storageFilePathsToUpload=storageFilePathsToUpload.concat(availableModules[i].storageFiles)
				packFilePathsToUpload=packFilePathsToUpload.concat(availableModules[i].packFiles)
			}
		}
		
		(async function () {
			entries = []
			const selectedModulesData = JSON.stringify(selectedModules)
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
										const response = await dbx.sharingCreateSharedLink({path: packPath})
										return response.url.slice(0, -1)+"1"
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
		res.send("sorry ur bad")
	}
  
})

// listen server with express
app.listen(process.env.PORT || 3000, 
	() => console.log("Server running"))