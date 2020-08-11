const shortid = require("shortid");
//shortid.length = 4

module.exports.compilePack  = function(requestBody) {
    console.log("length="+shortid.length)
    id = shortid.generate()
    console.log("id="+id)
}