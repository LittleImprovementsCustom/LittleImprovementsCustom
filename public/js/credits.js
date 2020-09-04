// function to add html elements
function createModuleSelector(name, userlink, uuid, userdesc) {

    const div = document.createElement("div");
    div.setAttribute("class","grid-item selection-box unselected");
    div.setAttribute("onclick", `location.href='${userlink}'`)
    document.getElementById("pack-selector-container").appendChild(div)

    const label = document.createElement("p")
    label.setAttribute("class", "pack-label")
    label.appendChild(document.createTextNode(name))
    div.appendChild(label)

    const icon = document.createElement("img")
    icon.setAttribute("class","pack-icon")
    icon.setAttribute("src",`https://crafatar.com/renders/head/${uuid}`)
    div.appendChild(icon)

    const desc = document.createElement("p")
    desc.setAttribute("class","pack-desc")
    desc.appendChild(document.createTextNode(userdesc))
    div.appendChild(desc);

}

// function to read JSON file containing data
function loadJSON(callback) {   
    const xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '/api/credits', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

// function to load JSON then send to be added to HTML
loadJSON(function(response) {
    // Parse JSON string into object
    var actual_JSON = JSON.parse(response);
    for (i in actual_JSON) {
        const data = actual_JSON[i]
        createModuleSelector(data.name,data.link,data.uuid,data.desc)
    }
})
