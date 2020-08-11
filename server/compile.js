const shortid = require("shortid");
const nanoid = require ("nanoid");
//shortid.length = 4

module.exports.compilePack  = function(requestBody) {
    id = nanoid(4)
    console.log("id="+id)
}