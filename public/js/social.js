const socialsContainer = document.createElement("div")
document.getElementById("social-navbar-item").appendChild(socialsContainer)


const xobj = new XMLHttpRequest()
xobj.overrideMimeType("application/json")
xobj.open("GET", "/api/socials", true)
xobj.onreadystatechange = () => {
	if (xobj.readyState == 4 && xobj.status == "200") {
		let socialsHTML = ""
		let socialIcons = []
		for (i of JSON.parse(xobj.responseText)) socialIcons.push(`<a href=${i.url} target="_blank"><i class="social-icon ${i.style} fa-${i.iconName}"></i></a>`)
		for (const [index, value] of socialIcons.entries()) {
			socialsHTML += value
			if (index!=socialIcons.length-1) socialsHTML += "&nbsp;&nbsp;"
		}
		socialsContainer.innerHTML = socialsHTML
	}
}
xobj.send(null)