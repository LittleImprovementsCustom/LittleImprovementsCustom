const socialsContainer = document.createElement("div")
document.getElementById("social-navbar-item").appendChild(socialsContainer)


const socialsXobj = new XMLHttpRequest()
socialsXobj.overrideMimeType("application/json")
socialsXobj.open("GET", "/api/socials", true)
socialsXobj.onreadystatechange = () => {
	if (socialsXobj.readyState == 4 && socialsXobj.status == "200") {
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
socialsXobj.send(null)
