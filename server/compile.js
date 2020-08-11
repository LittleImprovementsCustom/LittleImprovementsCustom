// require modules
const Nanoid = require ("nanoid");
const Dropbox = require("dropbox").Dropbox;
require("isomorphic-fetch");
require("dotenv").config();

const dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN });
dbx.filesListFolder({path: ''})
    .then(function(response) {
      console.log(response.entries);
    })
    .catch(function(error) {
      console.error(error);
    });

module.exports.compilePack  = function(requestBody) {
    id = Nanoid.nanoid(4)
    console.log("id="+id)
    
    dbx.filesCreateFolderV2({path: `/packs/${id}`})
    .then(function(response) {
    console.log(response);
    })
    .catch(function(error) {
    console.error(error);
    });
}