const dbx = require("../compile").dbx
module.exports.addModule = function() {
    dbx.filesListFolder({path: ''})
    .then(function(response) {
    console.log(response.entries);
    })
    .catch(function(error) {
    console.error(error);
    });
}