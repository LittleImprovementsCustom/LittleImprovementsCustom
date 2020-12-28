// function to add html elements
function createModuleSelector(data) {

	const div = document.createElement("div")
	div.setAttribute("class","grid-item selection-box selectable unselected credits-height")
	div.setAttribute("onclick", `location.href='${data.link}'`)
	document.getElementById("pack-selector-container").appendChild(div)

	const label = document.createElement("p")
	label.setAttribute("class", "pack-label")
	label.appendChild(document.createTextNode(data.name))
	div.appendChild(label)

	const icon = document.createElement("img")
	icon.setAttribute("class","pack-icon")
	if (data.type=="dynamic") icon.setAttribute("src",`https://crafatar.com/avatars/${data.uuid}`)
	else icon.setAttribute("src",`/avatars/${data.avatar}`)
	div.appendChild(icon)

	const desc = document.createElement("p")
	desc.setAttribute("class","credits-desc")
	desc.appendChild(document.createTextNode(data.desc))
	div.appendChild(desc)

}

// function to group headers
function createGroupHeader (group) {

	const div = document.createElement("div")
	div.setAttribute("class","grid-item selection-box section-header unselected")
	document.getElementById("pack-selector-container").appendChild(div)

	const label = document.createElement("p")
	label.setAttribute("class","section-name")
	label.appendChild(document.createTextNode(group))
	div.appendChild(label)

}

// function to read JSON file containing data
const xobj = new XMLHttpRequest()
xobj.overrideMimeType("application/json")
xobj.open("GET", "/api/credits", true)
xobj.onreadystatechange = function () {
	if (xobj.readyState == 4 && xobj.status == "200") {

		//get JSON and add to HTML
		creditsJSON = JSON.parse(xobj.responseText) // parse JSON string into object
		let groups = {
			"team": [],
			"contributor": []
		}
		for (i of creditsJSON) {
			if (i.group=="team") groups.team.push(i)
			else if (i.group=="contributor") groups.contributor.push(i)
			else groups.contributor.push(i)
		}
		createGroupHeader("The Team")
		for (data of groups.team) {createModuleSelector(data)}
		createGroupHeader("Other Contributors")
		for (data of groups.contributor) {createModuleSelector(data)}
	}
}
xobj.send(null)
