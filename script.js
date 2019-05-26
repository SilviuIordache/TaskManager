// -------MODEL--------------------
class Task {
  constructor(id, title, desc, completed = false) {
    this.id = id;
    this.title = title;
    this.desc = desc;
    this.completed = completed;
  }
}

function getIndexOfId(id, arr) {
  return arr.findIndex(el => el.id === id);
}

function addTaskToArr(task, arr) {
  arr.push(task);
}

function genIdForArr(arr) {
  let id;
  if (arr.length === 0) {
    //id = Math.round(Math.random() * 10);
    id = 0;
  } else {
    id = arr[arr.length - 1].id + 1;
  }
  return id;
}

function delTaskFromArr(id, arr) {
  const index = getIndexOfId(id, arr);
  if (index === -1) {
    console.log(`Trying to delete inexistent task of id ${id}`);
  } else {
    arr.splice(index, 1);
  }

}

function editTask(id, title, arr) {
  const index = getIndexOfId(id, arr);
  arr[index].title = title;
}


// -------VIEW--------------------
function addTaskToUI(task, DOMList) {
  const id = task.id;
  const title = task.title;
  const desc = task.desc;

  //const item = `<li id="li-${id}" class="text-wrap li_${DOMList}">${title}
  //<input id="box-${id}" class="checkboxes" type="checkbox"></li>`

  const item = `<li id="li-${id}" class="text wrap li_${DOMList}"><div class="container"><div class="row"><div class="col"><div class="container"><div class="task-title-and-desc col"><h5 class="task-title row">${title}</br></h5><h7 class="task-desc row">${desc}</div></div></div><div class="task-buttons align-items-start col-3"><button type="button" class="close icon-white row"aria-label="Close"><span aria-hidden="true" id="closebtn-${DOMList}-${id}">&times;</span></button><div class="checkbox-container float-right row"><input class="checkboxes" id="checkbox-${DOMList}-${id}" type="checkbox"></div></div></div></div></li>`

  // if (DOMList === "active") {
  //   DOM.list_active.insertAdjacentHTML('beforeend', item);
  // } else if (DOMList === "completed") {
  //   DOM.list_completed.insertAdjacentHTML('beforeend', item);
  // }

  DOM[DOMList].insertAdjacentHTML('beforeend', item);

  // Clear Form input fields
  DOM.title_input.value = "";
  DOM.desc_input.value = "";

  // Set focus back on the first input field (title)
  DOM.title_input.focus();
}

function delTaskFromUI(id, DOMList) {
  const li = document.getElementById(`li-${id}`);
  const ul = document.getElementById(`list_${DOMList}`);
  ul.removeChild(li);
}


//--------CONTROLLER--------------
window.onload = init;

// Tasks arrays active/completed
let taskArr = {
  active: [],
  completed: []
}

function init() {
  getTasksData();
}

// get tasks from json
function getTasksData() {
  var request = new XMLHttpRequest();
  request.open("GET", "tasks.json");
  request.onreadystatechange = function () {
    if (this.readyState == this.DONE && this.status == 200) {
      if (this.responseText) {
        parseTasks(this.responseText);
        addStoredTasksToUI();
      } else {
        console.log("Error: Data is empty");
      }
    }
  };
  request.send();
}

// push data from json to the task arrays
function parseTasks(tasksJSON) {
  //console.log(tasksJSON);
  data = JSON.parse(tasksJSON);
  //console.log(data);

  data.forEach((e) => {
    let nTask = new Task(e.id, e.title, e.desc, e.completed)

    if (nTask.completed === true) {
      taskArr.completed.push(nTask);
    } else {
      taskArr.active.push(nTask);
    }
  })
}

function addStoredTasksToUI() {
  if (taskArr.active.length > 0) {
    for (item of taskArr.active) {
      addTaskToUI(item, "active");
    }
  }
  if (taskArr.completed.length > 0) {
    for (item of taskArr.completed) {
      addTaskToUI(item, "completed");
    }
  }
}

function createTask() {
  if (DOM.title_input.value === "") {
    alert("Please add a task title");
  } else if (DOM.desc_input.value === "") {
    alert("Please add a task description")
  } else {

    // 1. Get data from the input fields
    let title = DOM.title_input.value;
    let desc = DOM.desc_input.value;

    // 2. Generate an unique id for array where the task will be inserted
    const id = genIdForArr(taskArr.active);

    // 3. Create the task obj
    const task = new Task(id, title, desc);

    // 4 Add task to lists
    addTask(task, "active")

  }

}

function addTask(task, type) {
  // 1. add task to the array
  addTaskToArr(task, taskArr[type]);

  // 2. add task to the DOM
  addTaskToUI(task, type);
}

function deleteTask(id, listType) {

  // 1. delete task from array
  delTaskFromArr(id, taskArr[listType]);

  // 2. delete task from UI
  delTaskFromUI(id, listType)
}


function moveTaskFromTo(event, srcListType, destListType) {
  // id example in the dom <li id="li-active-3"></li>

  // 1. retrieve the id of the li from the HTML
  let id = parseInt(event.target.id.split('-')[2], 10);
  //console.log(id);

  // 2. retrieve the array index of id in srcList
  let index = getIndexOfId(id, taskArr[srcListType]);

  // 3. validate if index found exists in the array
  if (index === -1) {
    console.log(`Trying to complete inexistent task of id ${id}`);
  } else {

    // 4. create a copy of the task obj to be deleted
    let tempObj = JSON.parse(JSON.stringify(taskArr[srcListType][index]));

    // 5. extract it's data
    let tempTitle = tempObj.title;
    let tempDesc = tempObj.desc;

    // 6. delete task from source list
    deleteTask(id, srcListType);

    // 7. Generate a new unique id for the array where the task will be inserted
    let newId = genIdForArr(taskArr[destListType]);

    // 8. create a new Task with the same data
    let task = new Task(newId, tempTitle, tempDesc);

    // 9. Add task to destination array
    addTaskToArr(task, taskArr[destListType]);

    // 10. Add task to the destination DOM list
    addTaskToUI(task, destListType);
  }
}

function toggleTaskCompletion(event) {
  // id examples from DOM
    // delete button: id="closebtn-active-3"
    // checkbox button: id="checkbox-completed-2"

  // retrieve src list type from DOM elem
  let srcList = event.target.id.split('-')[1];

  // the dest list type will be the opposite
  let destList = (srcList === "active") ? "completed" : "active"

  moveTaskFromTo(event, srcList, destList)
}

function taskItemButtonPresssed(event) {

  // destructure the id of the button pressed to extract data
  let eventCallComponents = event.target.id.split('-');

  let buttonType = eventCallComponents[0];
  let listType = eventCallComponents[1];
  let id = parseInt(eventCallComponents[2], 10);

  if (buttonType === "closebtn") {
    //if it's a close button, we delete the task
    deleteTask(id, listType);

  } else if (buttonType === "checkbox") {
    //if it's a checkbox, we perform the task completion logic
    toggleTaskCompletion(event);
  }
}

const DOM = {
  active: document.getElementById("list_active"),
  completed: document.getElementById("list_completed"),
  form: document.getElementById("form"),
  title_input: document.getElementById("title"),
  desc_input: document.getElementById("desc"),
  create_task: document.getElementById("create_task"),
  checkbox_btn: document.getElementById("checkbox-btn"),
  close_btn: document.getElementById("close-btn")
}

// --- Event Listeners -------
document.addEventListener('keypress', (event) => {
  if (event.keyCode === 13 || event.which === 13) {
    event.preventDefault();
    createTask();
  }
})
DOM.create_task.addEventListener('click', createTask);
DOM.active.addEventListener('click', taskItemButtonPresssed);
DOM.completed.addEventListener('click', taskItemButtonPresssed)