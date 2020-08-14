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