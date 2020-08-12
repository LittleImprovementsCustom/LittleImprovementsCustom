const Dropbox = require("dropbox").Dropbox;
require("isomorphic-fetch");
require("dotenv").config();
const dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN });

module.exports.addModule = function() {
    dbx.filesListFolder({path: ''})
    .then(function(response) {
    console.log(response.entries);
    })
    .catch(function(error) {
    console.error(error);
    });
}