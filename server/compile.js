const Nanoid = require ("nanoid");

const Dropbox = require("dropbox").Dropbox;
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
}