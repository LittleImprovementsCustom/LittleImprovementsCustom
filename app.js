// require modules
const express = require("express")
const Nanoid = require("nanoid")
const fs = require("fs")
const archiver = require("archiver")
require("isomorphic-fetch")
require("dotenv").config()

const availableModules = JSON.parse(fs.readFileSync("storage/data/modules.json"))

// setup express
const app = express()
app.use(express.json()) // to support JSON-encoded bodies
app.use(express.urlencoded({extended:true})) // to support URL-encoded bodies

app.use(express.static("public"))
app.use("/favicon.ico", express.static("public/logo/favicon.ico"))

// api reqyests
app.get("/api/modules", (req, res) => res.sendFile(__dirname+"/storage/data/modules.json") )
app.get("/api/credits", (req, res) => res.sendFile(__dirname+"/storage/data/credits.json") )

// how to handle a post request, sent by the client-side js, to compile the pack
app.post("/compile", function (req, res) {
	console.log(req.body)
	if (req.body.new=="true") {
		
		// generate id and create pack path
		const packID = Nanoid.nanoid(5)
		const packPath = "packs/"+packID
		console.log("pack path = "+packPath)

		// create variable with selected modules; gets updated later
		let selectedModules = req.body.modules

		// system to deal with incompatibilities
		for (i of availableModules) {
			const incompatibilities = i.incompatibleWith
			if (
				( incompatibilities!=undefined && incompatibilities.length!=0 ) // this module has incompatibilities
				&& ( selectedModules.includes(i.id) ) // this module has been selected
			) {
				for (n of incompatibilities) {
					if (selectedModules.includes(n.id)) { // the incompatible module has been selected

						// remove the two incompatible packs
						selectedModules.splice(selectedModules.indexOf(i),1)
						selectedModules.splice(selectedModules.indexOf(n.id),1)

						// add the useInstead pack
						selectedModules.push(n.useInstead)

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
			// send pack file
			res.download(__dirname + "\\" + zipPath)
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

		// add selectedModules.json file
		archive.append(JSON.stringify(selectedModules),{name:"selectedModules.json"})

		// add selected modules
		for (i of availableModules) {
			if (selectedModules.includes(i.id)) archive.directory("storage/modules/"+i.id, "assets/minecraft")
		}

		archive.finalize()

		output.on("close", ()=>res.send(packID))

	} else {
		res.send("sorry ur bad")
	}
  
})

// how to handle a get request, sent by the client side js, to download the already compiled pack
app.get("/download", (req, res) => {
	const zipPath = "packs/LittleImprovementsCustom_"+req.query.id+".zip"
	res.download(zipPath, (error)=>{
		if (error) res.send("error")
		else fs.unlinkSync(zipPath)
	})
	console.log("received get request for "+req.query.id)
})

// html webpage requests
app.get("/", (req, res) => res.sendFile(__dirname+"/public/index.html") )
app.get("/credits", (req, res) => res.sendFile(__dirname+"/public/credits.html") )
app.get("*", (req, res) => res.sendFile(__dirname+"/public/404.html", 404) ) // 404 page

// listen server with express
app.listen(process.env.PORT || 3000, 
	() => console.log("Server running"))