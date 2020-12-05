const chai = require("chai")
const chaiHttp = require("chai-http")
const fs = require("fs")
const index = require("../app")
const path = require("path")

const { expect } = chai

chai.use(chaiHttp)

describe("check API GET requests", () => {
	for (fileName of ["modules", "categories", "credits", "socials"]) it(`GET /api/${fileName}`, function(done){
		chai.request(index.app)
			.get(`/api/${fileName}`)
			.end(function(err, res) {
				expect(JSON.stringify(res.body)).to.equal(JSON.stringify(JSON.parse(fs.readFileSync(path.join(__dirname, `../../storage/data/${fileName}.json`)))))
				done()
				index.close()
			})
	})
})

