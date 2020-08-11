const shortid = require("shortid");
//shortid.length = 4
console.log("length="+shortid.length)

module.exports.compilePack  = function(requestBody) {
    id = shortid.generate()
    console.log("id="+id)
}