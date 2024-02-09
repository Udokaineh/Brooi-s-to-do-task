let createButton = document.getElementById("createToDo");
let form = document.getElementById("inputDiv")
let closeIcon = document.getElementById("closeIcon")
let userDate = document.getElementById("displayDate")
let userInput = document.getElementById("displayTitle");
let paraText = document.getElementById("paraText")
let leftDisplay = document.getElementById("halfDisplay")
let notes = document.getElementById("fullPageDisplay")
let rightScroll = document.getElementById("rightScrollDiv")
let DisplayAndFormDiv = document.getElementById("DisplayAndFormDiv")
let dummyText = document.getElementById("dummyDisplay")
let search = document.getElementById("searchInput")


// an event listener of click, when the mouse clicks on the button.
function createButtonClicked() {
  if (createButton.classList.contains("create-button")) {
    dummyText.classList.remove("dummy-display")
    dummyText.classList.add("dummy-display-hide")
    form.classList.remove("display-form-hide")
    form.classList.add("display-form")
    userDate.focus()
    hideRightScroll()
  }
}
createButton.addEventListener("click", createButtonClicked)

// an event listener of click, when the mouse clicks on the form close icon, hide right scroll is also activated
function close() {
  form.classList.remove("display-form")
  form.classList.add("display-form-hide")
  dummyText.classList.remove("dummy-display-hide")
  dummyText.classList.add("dummy-display")
  hideRightScroll()
}
closeIcon.addEventListener("click", close)


let userArray = []

function fetchUserData() {
  if (localStorage.getItem("userData")) {
    userArray = JSON.parse(localStorage.getItem("userData"))
  }
  printDataOnUI()

}
fetchUserData()

// event listener for the search input
search.addEventListener("input", handleSearch)
function handleSearch(event) {
  const searchItems = event.target.value.toLowerCase()

  const filteredArray = userArray.filter(function (storedData) {
    const dateText = storedData.dateValue.toLowerCase()
    const titleText = storedData.titleValue.toLowerCase()
    const paragraph = storedData.paraValue.toLowerCase()
    return titleText.includes(searchItems) || paragraph.includes(searchItems) || dateText.includes(searchItems)
  })

  if (filteredArray.length === 0) {
    printNotFoundOnUI()
  } else {
    printDataOnUI(filteredArray);
  }
}

function printNotFoundOnUI() {
  leftDisplay.innerHTML = "";

  const notFoundParagraph = document.createElement("p");
  notFoundParagraph.classList.add("not-found")
  notFoundParagraph.textContent = "Item not found";
  
  leftDisplay.appendChild(notFoundParagraph);
}

// userArray is then changed to filterArray just cos of the handleSearch function above
function printDataOnUI(filteredArray = userArray) {
  leftDisplay.innerHTML = ""

  filteredArray.forEach(function (storedData, index) {
    let dateText = storedData.dateValue
    let titleText = storedData.titleValue
    let paragraph = storedData.paraValue

    let titleAndParaDiv = document.createElement("div")
    titleAndParaDiv.classList.add("title-para-div")
    titleAndParaDiv.setAttribute("id", "titleParaDiv")
    titleAndParaDiv.setAttribute("tabindex", "0")
    titleAndParaDiv.addEventListener("click", function () {
      displaySelected(index)
    })

    let dateDiv = document.createElement("div")
    dateDiv.classList.add("date-div")

    let dateheading = document.createElement("h4")
    dateheading.textContent = dateText

    let trashIcon = document.createElement("i")
    trashIcon.classList.add("fa", "fa-trash")
    trashIcon.addEventListener("click", function () {
      deleteItem(index);
    })

    let titleDiv = document.createElement("div")
    titleDiv.classList.add("title-div")

    let titleheading = document.createElement("h4")
    titleheading.textContent = titleText

    let select = document.createElement("select")
    select.setAttribute("name", "task-status")
    select.setAttribute("id", "status")
    select.classList.add("status")

    let optionOne = document.createElement("option")
    optionOne.setAttribute("value", "In progress")
    optionOne.classList.add("inprogress")
    optionOne.textContent = "In progress"

    let optionTwo = document.createElement("option")
    optionTwo.setAttribute("value", "Pending")
    optionTwo.classList.add("pending")
    optionTwo.textContent = "Pending"

    let optionThree = document.createElement("option")
    optionThree.setAttribute("value", "Completed")
    optionThree.classList.add("completed")
    optionThree.textContent = "Completed"

    let paraDiv = document.createElement("div")
    paraDiv.classList.add("para-div")

    let paraText = document.createElement("p")
    paraText.textContent = paragraph

    paraDiv.append(paraText)
    select.append(optionOne, optionTwo, optionThree)
    titleDiv.append(titleheading, select)
    dateDiv.append(dateheading, trashIcon)
    titleAndParaDiv.append(dateDiv, titleDiv, paraDiv)
    leftDisplay.append(titleAndParaDiv)

    let rightDisplayDiv = document.createElement("div")
    rightDisplayDiv.classList.add("right-display-div")
    rightDisplayDiv.setAttribute("id", "rightDisplayDiv")

    let titleEdit = document.createElement("div")
    titleEdit.classList.add("title-edit-div")

    let rightTitle = document.createElement("h3")
    rightTitle.classList.add("right-display-title")
    rightTitle.setAttribute("id", "rightDisplayTitle")
    rightTitle.textContent = titleText

    let editIcon = document.createElement("i")
    editIcon.classList.add("fa", "fa-pen")
    editIcon.addEventListener("click", function () {
      editText(index)
    })

    let rightPara = document.createElement("p")
    rightPara.classList.add("right-display-para")
    rightPara.setAttribute("id", "rightDisplayPara")
    rightPara.textContent = paragraph


    titleEdit.append(rightTitle, editIcon)
    rightScroll.innerHTML = ""
    rightDisplayDiv.append(titleEdit, rightPara)
    rightScroll.append(rightDisplayDiv)
    DisplayAndFormDiv.append(rightScroll)

  })

  notes.appendChild(leftDisplay)
  notes.appendChild(DisplayAndFormDiv)

}

function displaySelected(index) {
  let selectedData = userArray[index]

  let rightDisplayDiv = document.createElement("div")
  rightDisplayDiv.classList.add("right-display-div")
  rightDisplayDiv.setAttribute("id", "rightDisplayDiv")
  // rightDisplayDiv.addEventListener("dblclick", editRightDisplayDiv)

  let titleEdit = document.createElement("div")
  titleEdit.classList.add("title-edit-div")

  let rightTitle = document.createElement("h3")
  rightTitle.classList.add("right-display-title")
  rightTitle.textContent = selectedData.titleValue

  let editIcon = document.createElement("i")
  editIcon.classList.add("fa", "fa-pen")
  editIcon.addEventListener("click", function () {
    editText(index)
  })

  let rightPara = document.createElement("p")
  rightPara.classList.add("right-display-para")
  rightPara.textContent = selectedData.paraValue

  rightScroll.innerHTML = ""
  titleEdit.append(rightTitle, editIcon)
  rightDisplayDiv.append(titleEdit, rightPara)
  rightScroll.appendChild(rightDisplayDiv)
  hideDummyText()
  revealRightScroll()
  resetForm()
}
function hideDummyText() {
  dummyText.classList.remove("dummy-display")
  dummyText.classList.add("dummy-display-hide")
}

function resetDummyText() {
  if (rightScroll.classList.contains("right-scroll")) {
    dummyText.classList.remove("dummy-display-hide")
    dummyText.classList.add("dummy-display")
    rightScroll.classList.remove("right-scroll")
    rightScroll.classList.add("right-scroll-hide")
  }
}
resetDummyText()

function resetForm() {
  if (form.classList.contains("display-form")) {
    form.classList.remove("display-form")
    form.classList.add("display-form-hide")
  }
}

function deleteItem(index) {
  userArray.splice(index, 1)
  localStorage.setItem("userData", JSON.stringify(userArray))
  fetchUserData()
  printDataOnUI()

  const nextItem = leftDisplay.children[index]
  if (nextItem) {
    nextItem.scrollIntoView({ behavior: "smooth" })
  }
}

function editText(index) {
  let selectedText = userArray[index]
  hideRightScroll()
  form.classList.remove("display-form-hide")
  form.classList.add("display-form")
  userArray = JSON.parse(localStorage.getItem("userData"))
  userInput.value = selectedText.titleValue
  paraText.value = selectedText.paraValue
  deleteItem(index)
}


// an event listener of submit on the form, hide form, followed by reveal right scroll is activated. 
// when the form listens for submit, prevent form default, collect value, store in a data, push to array, sent to LS, fetch from LS then display on UI.
form.addEventListener("submit", collectData)
function collectData(event) {
  event.preventDefault()
  let dateInput = userDate.value
  let userTitle = userInput.value
  let userPara = paraText.value

  // Check if the date input is empty, if so, set it to a default date
  if (dateInput === "") {
    dateInput = "Date?"
  }

  const userObject = {
    dateValue: dateInput,
    titleValue: userTitle,
    paraValue: userPara
  }

  userArray.unshift(userObject)
  localStorage.setItem("userData", JSON.stringify(userArray))
  fetchUserData()
  printDataOnUI()

  form.reset()
  hideForm()
  revealRightScroll()

}

// event listener to increase the heights of the form inputs(I used this dot and I used the variable name so i can use any one I like)
userInput.addEventListener("change", function () {
  this.style.height = 'auto';
  this.style.height = `${this.scrollHeight}px`
})
userDate.addEventListener("change", function () {
  userDate.style.height = 'auto';
  userDate.style.height = `${userDate.scrollHeight}px`
})
paraText.addEventListener("change", function () {
  paraText.style.height = 'auto';
  paraText.style.height = `${paraText.scrollHeight}px`
})


function hideForm() {
  form.reset()
  form.classList.remove("display-form")
  form.classList.add("display-form-hide")
}


function revealRightScroll() {
  rightScroll.classList.remove("right-scroll-hide")
  rightScroll.classList.add("right-scroll")
}
function hideRightScroll() {
  rightScroll.classList.remove("right-scroll")
  rightScroll.classList.add("right-scroll-hide")
}

