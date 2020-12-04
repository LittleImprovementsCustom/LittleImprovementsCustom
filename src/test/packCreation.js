const chai = require("chai")
const chaiHttp = require("chai-http")
const index = require("../app")

const { expect } = chai

chai.use(chaiHttp)


describe ("check webpage POST requests", ()=>{
	it("POST /download", (done) => {
		chai.request(index.app)
			.post ("/download")
			.send ({ "modules": ["honeyJar"] })
			.end ((err, res) => {
				expect(res.text.substring(8, 30)).to.equal("content.dropboxapi.com")
				done()
				index.close()
			})
	})
})
