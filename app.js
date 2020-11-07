// require modules
const express = require("express")
const nanoid = require("nanoid")
const fs = require("fs")
const archiver = require("archiver")
const formidable = require("formidable")
const os = require("os")
const streamZip = require("node-stream-zip")
const path = require("path")
const Dropbox = require("dropbox").Dropbox
require("isomorphic-fetch")
require("dotenv").config()

// setup Dropbox
const dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN })

// get modules.json
const availableModules = JSON.parse(fs.readFileSync("storage/data/modules.json"))

// setup express
const app = express()
app.use(express.json()) // to support JSON-encoded bodies 

app.use(express.static("public"))
app.use("/favicon.ico", express.static("public/logo/favicon.ico"))

// disable caching
app.use((req, res, next) => {
	res.set("Cache-Control", "max-age=1000")
	next()
})

// api reqyests
app.get("/api/modules", (req, res) => res.sendFile(__dirname+"/storage/data/modules.json") )
app.get("/api/categories", (req, res) => res.sendFile(__dirname+"/storage/data/categories.json") )
app.get("/api/credits", (req, res) => res.sendFile(__dirname+"/storage/data/credits.json") )

// how to handle a post request, sent by the client-side js, to compile the pack
app.post("/download", function (req, res) {

	// generate id and create pack paths
	const packID = nanoid.customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 5)()
	console.log("packID = "+packID)
	const localPackPath = path.join (os.tmpdir(), `${packID}.zip`)
	const dropboxPackPath = `/packs/"${packID}".zip`
	const output = fs.createWriteStream(localPackPath)
	const archive = archiver("zip",{zlib:{level:9}})

	// create variable with selected modules; gets updated later
	let selectedModules = req.body.modules
	console.log(selectedModules)


	// system to deal with preferred packs
	for (i of availableModules) {
		if (
			( i.prefers!=undefined && i.prefers.length!=0 ) // this module has prefers
				&& ( selectedModules.includes(i.id) ) // this module has been selected
		) {
			console.log(i.id)
			for (n of i.prefers) {
				if (selectedModules.includes(n.id)) { // the module to prefer with has also been selected
					selectedModules.splice(selectedModules.indexOf(n.delete),1) // remove the unpreferrred module
				}
			}
		}
	}

	// system to deal with merged packs
	for (i of availableModules) {
		if (
			( i.merges!=undefined && i.merges.length!=0 ) // this module has merges
				&& ( selectedModules.includes(i.id) ) // this module has been selected
		) {
			for (n of i.merges) {
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

	output.on("close", ()=>{
		console.log("pack generated at "+localPackPath)
		dbx.filesUpload({path:dropboxPackPath,contents:fs.readFileSync(localPackPath)})
			.then(()=>{
				dbx.filesGetTemporaryLink({path:dropboxPackPath})
					.then(shareLink=>{
						res.send(shareLink.link) // send download link
						fs.unlinkSync(localPackPath) // delete zip from local storage
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
	const infoText = `Little Improvements: Custom\nDownloaded: ${new Date().toUTCString()}\nID: ${packID}\nPlatform: ${req.body.platform}\n\nSelected modules:\n${selectedModules.join("\n")}`
	archive.append(infoText,{name:"selectedModules.txt"})

	// add rawSelectedModules.json file
	archive.append(JSON.stringify(req.body.modules),{name:"assets/rawSelectedModules.json"})

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


// system to deal with file uploads
app.post("/uploadpack", (req, res) => {
	
	const form = new formidable.IncomingForm()

	form.parse(req, (err, fields, files) =>{

		if (err) {
			next(err)
			return
		}

		const zip = new streamZip ({
			file: files.uploadedPack.path,
			storeEntries: true
		})

		zip.on ("ready", () => {

			// check if zip contains rawSelectedModules.json
			if (!Object.values(zip.entries()).map(x=>x.name).includes("assets/rawSelectedModules.json")) {
				// the file was not found, return an error
				res.json({"found":false})
				return
			}
			
			// Read rawSelectedModules.json from memory
			const selectedModulesContents = JSON.parse(zip.entryDataSync("assets/rawSelectedModules.json").toString("utf8"))
			console.log(selectedModulesContents)
			
			// Do not forget to close the file once you're done
			zip.close()

			// send the selected modules in the response
			res.json({"found":true,"modulesToSelect":selectedModulesContents})
		})

		// handle errors such as the file being upload not being a zip
		zip.on("error", err => res.json({"found":false}))

	})
	
})



// html webpage requests
app.get("/", (req, res) => res.sendFile(__dirname+"/public/index.html") )
app.get("/credits", (req, res) => res.sendFile(__dirname+"/public/credits.html") )
app.get("/mobile", (req, res) => res.sendFile(__dirname+"/public/mobile.html") )
app.get("/credits/mobile", (req, res) => res.sendFile(__dirname+"/public/credits_mobile.html") )
app.get("/404/mobile", (req, res) => res.sendFile(__dirname+"/public/404_mobile.html") )
app.get("*", (req, res) => res.sendFile(__dirname+"/public/404.html", 404) ) // 404 page

// listen server with express
app.listen(process.env.PORT || 3000, 
	() => console.log("Server running"))