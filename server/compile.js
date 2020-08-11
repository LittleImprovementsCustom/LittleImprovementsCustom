const shortid = require("shortid");
const Nanoid = require ("nanoid");
//shortid.length = 4

module.exports.compilePack  = function(requestBody) {
    id = Nanoid.nanoid(4)
    console.log("id="+id)
}