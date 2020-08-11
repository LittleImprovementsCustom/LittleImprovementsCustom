const shortid = require("shortid");
shortid.length(4)

module.exports.compilePack  = function(requestBody) {
    id = shortid.generate()
    console.log("id="+id)
}