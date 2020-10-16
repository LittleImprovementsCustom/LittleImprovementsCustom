// require modules
const express = require("express")
const Nanoid = require("nanoid")
const fs = require("fs")
const archiver = require("archiver")
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

// how to handle a post request, sent by the client-side js, to compile the pack
app.post("/download", function (req, res) {

	// generate id and create pack path
	const packID = Nanoid.nanoid(5)
	const packPath = "packs/"+packID
	console.log("pack path = "+packPath)

	// create variable with selected modules; gets updated later
	let selectedModules = req.body.modules
	console.log(selectedModules)

	// system to deal with merged packs
	for (i of availableModules) {
		const merges = i.merges
		if (
			( merges!=undefined && merges.length!=0 ) // this module has merges
				&& ( selectedModules.includes(i.id) ) // this module has been selected
		) {
			for (n of merges) {
				if (selectedModules.includes(n.id)) { // the mergeable module has been selected

					// remove the two mergeable packs
					selectedModules.splice(selectedModules.indexOf(i),1)
					selectedModules.splice(selectedModules.indexOf(n.id),1)

					// add the mergeWith pack
					selectedModules.push(n.mergeWith)

				}
			}
		}
	}

	// create pack
	const zipPath = "packs/LittleImprovementsCustom_"+packID+".zip"
	const output = fs.createWriteStream(zipPath)
	const archive = archiver("zip",{zlib:{level:9}})

	output.on("close", ()=>{
		console.log("pack generated at "+zipPath)
		dbx.filesUpload({path:"/"+zipPath,contents:fs.readFileSync(zipPath)})
			.then(()=>{
				dbx.filesGetTemporaryLink({path:"/"+zipPath})
					.then(shareLink=>{
						res.send(shareLink.link) // send download link
						fs.unlinkSync(zipPath) // delete zip from local storage
					})
					.catch(error=>console.error(error))
			})
			.catch(error=>console.error(error))
	})

	output.on("end", ()=>console.log("data has been drained"))
	archive.on("error", (error)=>{throw error})

	archive.on("warning", (error)=> {
		if (error.code=="ENOENT") console.warn(error)
		else throw error
	})		

	archive.pipe(output)

	// add base files
	for (i of ["credits.txt","pack.mcmeta","pack.png"]) {
		archive.file("storage/baseFiles/"+i, {name:i})
	}

	// add selectedModules.txt file
	const infoText = `Little Improvements: Custom\nDownloaded: ${new Date().toUTCString()}\nID: ${packID}\n\nSelected modules:\n${selectedModules.join("\n")}`
	archive.append(infoText,{name:"selectedModules.txt"})

	let createdLangFiles = []

	// add selected modules
	for (i of availableModules) {
		if (selectedModules.includes(i.id)) {
			
			// add resource pack files
			archive.directory("storage/modules/"+i.id, "assets/minecraft")

			// add lang files
			if (i.lang) {
				const moduleLangData = JSON.parse(fs.readFileSync(`storage/lang/${i.id}.json`))
				const createdLangNames = createdLangFiles.map(n=>n.name)
				for (const [fileName, langData] of Object.entries(moduleLangData)) {

					// check if the lang file has been added to createdLangFiles. if not, add it.
					if (!createdLangNames.includes(fileName)) {
						createdLangNames.push(fileName)
						createdLangFiles.push ({
							"name": fileName,
							"source" : {},
							"data" : { name : `assets/minecraft/lang/${fileName}` } 
						})
					}

					// add the lang data
					for (const [langKey, langValue] of Object.entries(langData)) {
						createdLangFiles[createdLangNames.indexOf(fileName)].source[langKey] = langValue
					}
					
				}
			}
		}
	}

	for (i of createdLangFiles) {
		archive.append(JSON.stringify(i.source), i.data)
	}

	archive.finalize()
  
})

// html webpage requests
app.get("/", (req, res) => res.sendFile(__dirname+"/public/index.html") )
app.get("/credits", (req, res) => res.sendFile(__dirname+"/public/credits.html") )
app.get("/mobile", (req, res) => res.sendFile(__dirname+"/public/mobile.html") )
app.get("*", (req, res) => res.sendFile(__dirname+"/public/404.html", 404) ) // 404 page

// listen server with express
app.listen(process.env.PORT || 3000, 
	() => console.log("Server running"))