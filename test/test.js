const chai = require("chai")
const chaiHttp = require("chai-http")
const index = require("../app")

const { expect } = chai

chai.use(chaiHttp)

it("get /credits", function(done){
	chai.request(index.app)
		.get("/credits")
		.end(function(err, res) {
			// console.log(res)
			expect(res.status).to.equal(200)
			done()
			index.close()
		})
})

// it("get /api/modules")