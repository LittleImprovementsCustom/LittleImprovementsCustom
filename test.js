// require modules
const fs = require("fs")
const Dropbox = require("dropbox").Dropbox
require("isomorphic-fetch")
require("dotenv").config()

// check Dropbox
const dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN })
dbx.checkUser({query: "testing dropbox app"}).then(res=>console.log(res))

// check storage/data
JSON.parse(fs.readFileSync("storage/data/categories.json"))
JSON.parse(fs.readFileSync("storage/data/credits.json"))
JSON.parse(fs.readFileSync("storage/data/modules.json"))
JSON.parse(fs.readFileSync("storage/data/requests.json"))
