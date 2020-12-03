const { expect } = require("chai")

// require modules
const Dropbox = require("dropbox").Dropbox
require("isomorphic-fetch")
require("dotenv").config()

describe ("check Dropbox user", () => {
	it("dbx.checkUser", function(done){
		// check Dropbox
		const dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN })
		const query = "testing dropbox user"
		dbx.checkUser({query: query}).then(res=>{
			expect(res.result.result).to.equal(query)
			done()
		})
	})
})
