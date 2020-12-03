const chai = require("chai")
const chaiHttp = require("chai-http")
const index = require("../app")

const { expect } = chai

chai.use(chaiHttp)


describe ("check webpage GET requests", ()=>{
	for (slug of ["/credits"]) it(`GET ${slug}`, (done) => {
		chai.request(index.app)
			.get (slug)
			.end ((err, res) => {
				expect(res.status).to.equal(200)
				done()
				index.close()
			})
	})
})
