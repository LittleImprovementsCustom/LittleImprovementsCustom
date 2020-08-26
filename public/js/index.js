// DATA FOR MODULE SELECTORS. ADD TO THIS WHEN CREATING A NEW MODULE
const modulesToCreate = [
    {
        "id": "honeyJar",
        "label": "Honey Jar",
        "icontype": "png",
        "description": "Changes honey bottle to a jar of honey, and renames the item."

    },
    {
        "id": "animatedCampfireItems",
        "label": "Animated Campfire Items",
        "icontype": "gif",
        "description": "Animates campfire and soul campfire items in the inventory and in a player's hand."
    }
]

// SELECT OR UNSELECT A MODULE WHEN THE USER CLICKS THE SELECTOR
let selectedModules = []
function toggleSelected(id) {
    const theDiv = document.getElementById(id)
    if (theDiv.classList.contains("unselected")) {
        // the box is currently unselected; select it
        theDiv.classList.remove("unselected")
        theDiv.classList.add("selected")
        selectedModules.push(id)
    } else {
        // the box is currently selected; unselect it
        theDiv.classList.remove("selected")
        theDiv.classList.add("unselected")
        selectedModules.pop(id)
    }
}

// HIDE THE IMAGE AND SHOW THE DESCRIPTION WHEN THE USER HOVERS OVER A SELECTOR
function mouseOver() {
    document.getElementById(this.id+"Img").classList.add("invisible")
    document.getElementById(this.id+"Desc").classList.remove("invisible")
}
function mouseOut() {
    document.getElementById(this.id+"Img").classList.remove("invisible")
    document.getElementById(this.id+"Desc").classList.add("invisible")
}

// HANDLE THE USER PRESSING THE DOWNLOAD BUTTON
function downloadPack() {
    // stop the user downloading a pack with nothing selected
    if (selectedModules.length==0) {
        // let the user know they can't download a pack with no modules
        alert("You can't download a pack with nothing selected.")
        // return, so the post request is not sent
        return
    }

    // show the download toast
    document.getElementById("download-toast").classList.remove("invisible")

    // send post request to the server
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://www.littleimprovements-custom.tk/", false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify( {"new":"true","modules":selectedModules} ));

    // show fail toast if the response was "error"
    if (xhr.response == "error") {
        // hide the download toast
        document.getElementById("download-toast").classList.add("invisible")
        // show fail toast
        document.getElementById("fail-toast").classList.remove("invisible")
        // return, so the user doesnt get redirected
        return
    }
    
    // download
    window.location.href = xhr.response
}


// DYNAMICALLY ADD MODULE SELECTORS
function createModuleSelector(moduleid, modulelabel, icontype, moduledesc) {

    const div = document.createElement("div");
    div.setAttribute("class","grid-item selection-box unselected tooltip");
    div.setAttribute("onclick", `javascript: toggleSelected('${moduleid}')`)
    div.setAttribute("id", moduleid)
    document.getElementById("pack-selector-container").appendChild(div)

    const label = document.createElement("p")
    label.setAttribute("class", "pack-label")
    label.appendChild(document.createTextNode(modulelabel))
    div.appendChild(label)

    const icon = document.createElement("img")
    icon.setAttribute("class","pack-icon")
    icon.setAttribute("src",`icons/${moduleid}.${icontype}`)
    icon.setAttribute("id",moduleid+"Img")
    div.appendChild(icon)

    const desc = document.createElement("p")
    desc.setAttribute("class","pack-desc invisible")
    desc.setAttribute("id", moduleid+"Desc")
    desc.appendChild(document.createTextNode(moduledesc))
    div.appendChild(desc);

    div.addEventListener("mouseover", mouseOver)
    div.addEventListener("mouseout", mouseOut)

}

for (i in modulesToCreate) {
    const data = modulesToCreate[i]
    createModuleSelector(data.id,data.label,data.icontype,data.description)
}