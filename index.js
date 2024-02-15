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
  // document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("userData")) {
    userArray = JSON.parse(localStorage.getItem("userData"));
    if (userArray.length === 0) {
      printNotFoundOnUI();
    } else {
      printDataOnUI();
    }
  } else {
    printNotFoundOnUI();
  }
}
fetchUserData();


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
    trashIcon.addEventListener("click", function (event) {
      event.stopPropagation();
      deleteItem(index);
    })

    let titleDiv = document.createElement("div")
    titleDiv.classList.add("title-div")

    let titleheading = document.createElement("h4")
    titleheading.textContent = titleText

    let statusUl = document.createElement("ul")


    let defaultLi = document.createElement("li")
    defaultLi.classList.add("status")
    defaultLi.textContent = "Task status"
    let taskId = "task-" + index // Dynamically assign a unique identifier to persist status
    defaultLi.setAttribute("id", taskId)

    let caretDown = document.createElement("i")
    caretDown.classList.add("fa", "fa-caret-down")

    let nestedUl = document.createElement("ul")
    nestedUl.classList.add("status-option")

    let optionOne = document.createElement("li")
    optionOne.classList.add("inprogress")
    optionOne.textContent = "In progress"
    optionOne.addEventListener("click", function () {
      updateStatusOne(defaultLi)
    })

    let optionTwo = document.createElement("li")
    optionTwo.classList.add("pending")
    optionTwo.textContent = "Pending"
    optionTwo.addEventListener("click", function () {
      updateStatusTwo(defaultLi)
    })


    let optionThree = document.createElement("li")
    optionThree.classList.add("completed")
    optionThree.textContent = "Completed"
    optionThree.addEventListener("click", function () {
      updateStatusThree(defaultLi)
    })

    let paraDiv = document.createElement("div")
    paraDiv.classList.add("para-div")

    let paraText = document.createElement("p")
    paraText.textContent = paragraph


    paraDiv.append(paraText)
    nestedUl.append(optionOne, optionTwo, optionThree)
    defaultLi.append(caretDown)
    defaultLi.append(nestedUl)
    statusUl.append(defaultLi)
    titleDiv.append(titleheading, statusUl)
    dateDiv.append(dateheading, trashIcon)
    titleAndParaDiv.append(dateDiv, titleDiv, paraDiv)
    leftDisplay.append(titleAndParaDiv)

    // Retrieve stored status from LocalStorage
    let storedStatus = localStorage.getItem(taskId)
    if (storedStatus) {
      defaultLi.textContent = ""
      if (storedStatus === "inprogress") {
        updateStatusOne(defaultLi)
      } else if (storedStatus === "pending") {
        updateStatusTwo(defaultLi)
      } else if (storedStatus === "completed") {
        updateStatusThree(defaultLi)
      }
    }

    let rightDisplayDiv = document.createElement("div")
    rightDisplayDiv.classList.add("right-display-div")
    rightDisplayDiv.setAttribute("id", "rightDisplayDiv")

    let titleEdit = document.createElement("div")
    titleEdit.classList.add("title-edit-div")

    let rightTitle = document.createElement("h3")
    rightTitle.classList.add("right-display-title")
    rightTitle.setAttribute("id", "rightDisplayTitle")
    rightTitle.textContent = userArray[0].titleValue

    let editIcon = document.createElement("i")
    editIcon.classList.add("fa", "fa-pen")
    editIcon.addEventListener("click", function () {
      editText(index)
    })

    let rightPara = document.createElement("p")
    rightPara.classList.add("right-display-para")
    rightPara.setAttribute("id", "rightDisplayPara")
    rightPara.textContent = userArray[0].paraValue


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

// function to update task status, I passed the defaultLi as a parameter to have access to it outside the printonui function

function updateStatusOne(defaultLi) {
  defaultLi.classList.remove("pending", "completed")
  defaultLi.classList.add("status", "inprogress")
  defaultLi.textContent = "In progress"
  defaultLi.style.padding = "2px"

  localStorage.setItem(defaultLi.id, "inprogress")

  let caretDown = document.createElement("i")
  caretDown.classList.add("fa", "fa-caret-down")

  let optionTwo = document.createElement("li")
  optionTwo.classList.add("pending")
  optionTwo.textContent = "Pending"
  optionTwo.addEventListener("click", function () {
    updateStatusTwo(defaultLi);
  });

  let optionThree = document.createElement("li")
  optionThree.classList.add("completed")
  optionThree.textContent = "Completed"
  optionThree.addEventListener("click", function () {
    updateStatusThree(defaultLi);
  });

  let trickOne = document.createElement("ul")
  trickOne.classList.add("trick-one")

  trickOne.append(optionTwo, optionThree)
  defaultLi.append(caretDown)
  defaultLi.append(trickOne)
}

function updateStatusTwo(defaultLi) {
  defaultLi.classList.remove("inprogress", "completed")
  defaultLi.classList.add("status", "pending")
  defaultLi.textContent = "Pending"
  defaultLi.style.paddingRight = "8px"
  defaultLi.style.paddingLeft = "8px"
  defaultLi.style.paddingBottom = "2px"

  localStorage.setItem(defaultLi.id, "pending")

  let caretDown = document.createElement("i")
  caretDown.classList.add("fa", "fa-caret-down")

  let optionOne = document.createElement("li")
  optionOne.classList.add("inprogress")
  optionOne.textContent = "In progress"
  optionOne.addEventListener("click", function () {
    updateStatusOne(defaultLi);
  });

  let optionThree = document.createElement("li")
  optionThree.classList.add("completed")
  optionThree.textContent = "Completed"
  optionThree.addEventListener("click", function () {
    updateStatusThree(defaultLi);
  });

  let trickTwo = document.createElement("ul")
  trickTwo.classList.add("trick-two")

  trickTwo.append(optionOne, optionThree)
  defaultLi.append(caretDown)
  defaultLi.append(trickTwo)
}
function updateStatusThree(defaultLi) {
  defaultLi.classList.remove("inprogress", "pending")
  defaultLi.classList.add("status", "completed")
  defaultLi.textContent = "Completed"
  defaultLi.style.padding = "2px"

  localStorage.setItem(defaultLi.id, "completed")

  let caretDown = document.createElement("i")
  caretDown.classList.add("fa", "fa-caret-down")

  let optionOne = document.createElement("li")
  optionOne.classList.add("inprogress")
  optionOne.textContent = "In progress"
  optionOne.addEventListener("click", function () {
    updateStatusOne(defaultLi);
  });

  let optionTwo = document.createElement("li")
  optionTwo.classList.add("pending")
  optionTwo.textContent = "Pending"
  optionTwo.addEventListener("click", function () {
    updateStatusTwo(defaultLi);
  });

  let trickThree = document.createElement("ul")
  trickThree.classList.add("trick-three")

  trickThree.append(optionOne, optionTwo)
  defaultLi.append(caretDown)
  defaultLi.append(trickThree)
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
  let recentItem = userArray[0]
  localStorage.setItem("userData", JSON.stringify(userArray))
  console.log("inside", userArray)
  console.log("recent", recentItem)
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

