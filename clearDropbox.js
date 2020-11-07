// require modules
const Dropbox = require("dropbox").Dropbox
require("isomorphic-fetch")
require("dotenv").config()

// setup Dropbox
const dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN })

// delete folder containing packs
const packsPath = "/packs"
dbx.filesDeleteV2({path:packsPath})
	.then( () => console.log(`successfully deleted ${packsPath} on Dropbox`) )
	.catch( ()=> console.log("Error clearing Dropbox packs. Perhaps they were already cleared?"))