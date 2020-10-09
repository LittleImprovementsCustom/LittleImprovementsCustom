// SELECT OR UNSELECT A MODULE WHEN THE USER CLICKS THE SELECTOR
let selectedModules = []
function toggleSelected(id) {
	const theDiv = document.getElementById(id)
	var action = ""
	if (theDiv.classList.contains("unselected")&&theDiv.classList.contains("selectable")) action="adding"
	else if (theDiv.classList.contains("selected")&&theDiv.classList.contains("selectable")) action="removing"
	if (action=="adding") {
		// the box is currently unselected and selectable; select it
		theDiv.classList.remove("unselected")
		theDiv.classList.add("selected")
		selectedModules.push(id)
	} else if (action=="removing") {
		// the box is currently selected; unselect it
		theDiv.classList.remove("selected")
		theDiv.classList.add("unselected")
		selectedModules.pop(id)
	}
	const incompatibilities = modulesJSON[modulesJSON.map(x=>x.id).indexOf(id)].incompatibilities
	if (incompatibilities!=undefined) {
		if (action=="adding") for (i of incompatibilities) {
			document.getElementById(i).classList.remove("selectable") // remove the selectable class from the element
			document.getElementById(i).classList.add("not-selectable") // add the not-selectable class to the element
		} else if (action=="removing") for (i of incompatibilities) {
			const childIncompatibilities = modulesJSON[modulesJSON.map(x=>x.id).indexOf(i)].incompatibilities
			for (j of childIncompatibilities) {
				if (!selectedModules.includes(j)) {
					document.getElementById(i).classList.add("selectable") // add the selectable class to the element
					document.getElementById(i).classList.remove("not-selectable") // remove the not-selectable class from the element
				}
			}
		}
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

	// send post request for pack link
	const request = new XMLHttpRequest()
	request.open("POST","/download",false)
	request.setRequestHeader("Content-Type","application/json")
	request.send(JSON.stringify({"modules":selectedModules}))

	// show fail toast if the response was "error"
	if (request.response == "error") {
		document.getElementById("download-toast").classList.add("invisible") // hide the download toast
		document.getElementById("fail-toast").classList.remove("invisible") // show fail toast
		return // return, so the user doesnt get redirected
	}

	// download pack
	window.location.replace(request.response)

}


// DYNAMICALLY ADD MODULE SELECTORS

// function to add html pack selectors
function createModuleSelector(data) {

	if (data.hidden) return // stop if the module should be hidden

	const div = document.createElement("div")
	div.setAttribute("class","grid-item selection-box selectable unselected box-height")
	div.setAttribute("onclick", `javascript: toggleSelected('${data.id}')`)
	div.setAttribute("id", data.id)
	document.getElementById("pack-selector-container").appendChild(div)

	const label = document.createElement("p")
	label.setAttribute("class", "pack-label")
	label.appendChild(document.createTextNode(data.label))
	div.appendChild(label)

	let iconType = data.iconType
	if (iconType==undefined) iconType = "png"
	const icon = document.createElement("img")
	icon.setAttribute("class","pack-icon")
	icon.setAttribute("src",`icons/${data.id}.${iconType}`)
	icon.setAttribute("id",data.id+"Img")
	div.appendChild(icon)

	const desc = document.createElement("p")
	desc.setAttribute("class","pack-desc invisible")
	desc.setAttribute("id", data.id+"Desc")
	desc.appendChild(document.createTextNode(data.description))
	div.appendChild(desc)

	div.addEventListener("mouseover", mouseOver)
	div.addEventListener("mouseout", mouseOut)

}

// function to category headers
function createCategoryHeader(category) {

	const div = document.createElement("div")
	div.setAttribute("class","grid-item selection-box section-header unselected")
	document.getElementById("pack-selector-container").appendChild(div)

	const label = document.createElement("p")
	label.appendChild(document.createTextNode(category))
	div.appendChild(label)

}

//  read JSON file containing data
const xobj = new XMLHttpRequest()
xobj.overrideMimeType("application/json")
xobj.open("GET", "/api/modules", true)
xobj.onreadystatechange = function () {
	if (xobj.readyState == 4 && xobj.status == "200") {

		// get JSON and add to HTML
		modulesJSON = JSON.parse(xobj.responseText) // Parse JSON string into object
		let categories = {
			"aesthetic": [],
			"variated": [],
			"utility": [],
			"fixes": []
		}
		for (i of modulesJSON) {
			if (i.category=="aesthetic") categories.aesthetic.push(i)
			else if (i.category=="utility") categories.utility.push(i)
			else if (i.category=="variated") categories.variated.push(i)
			else if (i.category=="fixes") categories.fixes.push(i)
			else categories.aesthetic.push(i)
		}

		createCategoryHeader("Aesthetic")
		for (data of categories.aesthetic) {createModuleSelector(data)}
		createCategoryHeader("Utility")
		for (data of categories.utility) {createModuleSelector(data)}
		createCategoryHeader("Variated")
		for (data of categories.variated) {createModuleSelector(data)}
		createCategoryHeader("Fixes & Inconsistencies")
		for (data of categories.fixes) {createModuleSelector(data)}

	}
}
xobj.send(null)