const Dropbox = require("dropbox").Dropbox;
require("isomorphic-fetch");
require("dotenv").config();
const dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN });

module.exports.addModule = function(packPath) {
    dropbox({
        resource: "../storage/modules/honeyJar/textures/item/honey_bottle",
        parameters: {
            path: (packPath+"/assets/minecraft/textures/item/honey_bottle.png")
        },
        readStream: fs.createReadStream("/assets/minecraft/textures/item/honey_bottle.png")
    }, (err, result, response) => {
        //upload completed
    });
}