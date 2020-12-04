const chai = require("chai")
const chaiHttp = require("chai-http")
const fs = require("fs")
const path = require("path")
const index = require("../app")

const { expect } = chai

chai.use(chaiHttp)

let modules = JSON.parse(fs.readFileSync(path.join(__dirname, "../../storage/data/modules.json")))
for (i of modules) if (i.hidden) modules.splice (modules.indexOf(i), 1)
let moduleIDs = []
for (i of modules) moduleIDs.push(i.id)
moduleIDs = moduleIDs.sort(() => 0.5 - Math.random()) // shuffle array
moduleIDs = moduleIDs.slice(0, 5) // get first 5 elements

describe ("check webpage POST requests", ()=>{
	it("POST /download", (done) => {
		chai.request(index.app)
			.post ("/download")
			.send ({ "modules": moduleIDs })
			.end ((err, res) => {
				expect(res.text.substring(8, 30)).to.equal("content.dropboxapi.com")
				done()
				index.close()
			})
	})
})
