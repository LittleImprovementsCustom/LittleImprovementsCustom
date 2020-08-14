const fs = require("fs");
const Dropbox = require("dropbox").Dropbox;
require("isomorphic-fetch");
require("dotenv").config();
const dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN });

module.exports.addModule = function(packPath) {
    fs.readFile("storage/modules/honeyJar/textures/item", function (err, contents){
        dbx.filesUpload({ path: `${packPath}/assets/minecraft/textures/item`, contents: contents })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (err) {
          console.log(err);
        });
    });
}