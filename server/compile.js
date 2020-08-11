const shortid = require("shortid");

module.exports.compilePack  = function(requestBody) {
    id = shortid.generate()
    console.log("id="+id)
}