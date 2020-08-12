const fs = require("fs");
const Dropbox = require("dropbox").Dropbox;
require("isomorphic-fetch");
require("dotenv").config();
const dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN });

module.exports.addModule = function(packPath) {
    const image = fs.readFile("/storage/modules/honeyJar/textures/item/honey_bottle.png", function(err,data))
    dbx
    .filesUpload({
      path: `/${image.name}`,
      contents: image.data
    })
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.log(err);
    });
}