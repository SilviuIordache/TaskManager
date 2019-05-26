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
    console.log(`Trying to complete inexistent task of id ${id}`);
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

  const item = `<li id="li-${id}" class="text wrap li_${DOMList}"><div class="container"><div class="row"><div class="col"><div class="container"><div class="task-title-and-desc col"><h5 class="task-title row">${title}</br></h5><h7 class="task-desc row">${desc}</div></div></div><div class="task-buttons align-items-start col-3"><button type="button" class="close icon-white row"aria-label="Close"><span aria-hidden="true">&times;</span></button><div class="checkbox-container float-right row"><input class="checkboxes" id="box-${DOMList}-${id}" type="checkbox"></div></div></div></div></li>`

  if (DOMList === "active") {
    DOM.list_active.insertAdjacentHTML('beforeend', item);
  } else if (DOMList === "completed") {
    DOM.list_completed.insertAdjacentHTML('beforeend', item);
  }

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
let active = [];
let completed = [];

function init() {
  getTasksData();
}

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

function parseTasks(tasksJSON) {
  //console.log(tasksJSON);
  data = JSON.parse(tasksJSON);
  //console.log(data);

  data.forEach((e) => {
    let nTask = new Task(e.id, e.title, e.desc, e.completed)

    if (nTask.completed === true) {
      completed.push(nTask);
    } else {
      active.push(nTask);
    }
  })
}

function addStoredTasksToUI() {
  if (active.length > 0) {
    for (item of active) {
      addTaskToUI(item, "active");
    }
  }
  if (completed.length > 0) {
    for (item of completed) {
      addTaskToUI(item, "completed");
    }
  }
}

function createTask(event) {

  if (DOM.title_input.value === "") {
    alert("Please add a task title");
  } else if (DOM.desc_input.value === "") {
    alert("Please add a task description")
  } else {

    // 1. Get data from the input fields
    let title = DOM.title_input.value;
    let desc = DOM.desc_input.value;

    // 2. Generate an unique id for array where the task will be inserted
    const id = genIdForArr(active);

    // 3. Create the task obj
    const task = new Task(id, title, desc);
    //constructor(id, title, desc, prio, completed)

    // 4. add task to the array
    addTaskToArr(task, active);

    // 5. add task to the DOM
    addTaskToUI(task, "active");
  }

}

function deleteTask(id) {

  // 1. delete task from array
  delTaskFromArr(id, active);

  // 2. delete task from UI
  delTaskFromUI(id, active)
}


function moveTaskFromArrToArr(event, arrSrc, arrTar, DOMSrc, DOMTar) {
  // id example in the dom <li id="li-active-3"></li>

  // 1. retrieve the id of the li from the HTML
  let id = parseInt(event.target.id.split('-')[2], 10);
  //console.log(id);

  // 2. retrieve the array index of id
  let index = getIndexOfId(id, arrSrc);

  // 3. validate if index found exists in the array
  if (index === -1) {
    console.log(`Trying to complete inexistent task of id ${id}`);
  } else {

    // 5. create a copy of the task obj to be deleted
    let tempObj = JSON.parse(JSON.stringify(arrSrc[index]));

    // 6. extract it's data
    let tempTitle = tempObj.title;
    let tempDesc = tempObj.desc;

    // 7. delete the task from the active list
    delTaskFromArr(id, arrSrc);

    // 8. delete task from UI
    delTaskFromUI(id, DOMSrc)

    // 9. Generate a new unique id for the array where the task will be inserted
    let newId = genIdForArr(arrTar);

    // 10. create a new Task with the same data
    let task = new Task(newId, tempTitle, tempDesc);

    // 11. Add task to completed array logic
    addTaskToArr(task, arrTar);

    // 12. Add task to the DOM
    addTaskToUI(task, DOMTar);
  }
}

function toggleTaskCompletion(event) {
  // id example in the dom <li id="li-active-3"></li>

  // retrieve list type from DOM elem
  let listType = event.target.id.split('-')[1];

  if (listType === "active") {
    // completing a task
    moveTaskFromArrToArr(event, active, completed, "active", "completed");
  } else {
    // uncompleting a task
    moveTaskFromArrToArr(event, completed, active, "completed", "active");
  }

}

const DOM = {
  form: document.getElementById("form"),
  title_input: document.getElementById("title"),
  desc_input: document.getElementById("desc"),
  create_task: document.getElementById("create_task"),
  list_active: document.getElementById("list_active"),
  list_completed: document.getElementById("list_completed")
  //check_box: document.getElementById("id-box")
}

// --- Event Listeners -------
document.addEventListener('keypress', (event) => {
  if (event.keyCode === 13 || event.which === 13) {
    event.preventDefault();
    createTask();
  }
})

DOM.create_task.addEventListener('click', createTask);
DOM.list_active.addEventListener('click', toggleTaskCompletion);
DOM.list_completed.addEventListener('click', toggleTaskCompletion)
















// To be deleted
function completeTask(event) {

  
  // 1. retrieve the id of the li from the HTML
  
  let id = parseInt(event.target.id.split('-')[1], 10);

  // 2. retrieve the array index of id
  let index = getIndexOfId(id, active);

  // 3. validate if index found exists in the array
  if (index === -1) {
    console.log(`Trying to complete inexistent task of id ${id}`);
  } else {

    // 4. create a copy of the task obj to be deleted
    let tempObj = JSON.parse(JSON.stringify(active[index]));

    // 5. extract it's data
    let tempTitle = tempObj.title;
    let tempDesc = tempObj.desc;

    // 6. delete the task from the active list
    delTaskFromArr(id, active);

    // 7. delete task from UI
    delTaskFromUI(id, active)

    // 8. Generate a new unique id for the array where the task will be inserted
    let newId = genIdForArr(completed);

    // 9. create a new Task with the same data
    let task = new Task(newId, tempTitle, tempDesc);

    // 10. Add task to completed array logic
    addTaskToArr(task, completed);

    // 11. Add task to the DOM
    addTaskToUI(task, "completed");
  }
}