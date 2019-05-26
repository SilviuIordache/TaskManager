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
  let checked;

  // if it's a completed task, the checked state will be inserted into the li DOM text;
  checked = (DOMList === "completed") ? 'checked="checked"' : ''

  const item = `<li id="li-${id}-${DOMList}" class="text wrap li_${DOMList}"><div class="container"><div class="row"><div class="col"><div class="container"><div class="task-title-and-desc col"><h5 class="task-title row">${title}</br></h5><h7 class="task-desc row">${desc}</div></div></div><div class="task-buttons align-items-start col-3"><button type="button" class="close icon-white row"aria-label="Close"><span aria-hidden="true" id="closebtn-${DOMList}-${id}">&times;</span></button><div class="checkbox-container float-right row"><input class="checkboxes" ${checked} id="checkbox-${DOMList}-${id}" type="checkbox"></div><div  class="edit-btn row">
  <button type="button" id="editbtn-${DOMList}-${id}" class="btn-outline-info">Edit</button>
</div></div></div></div></li>`;


  DOM[DOMList].insertAdjacentHTML('beforeend', item);

  // Clear Form input fields
  clearInputFields();

  // Set focus back on the first input field (title)
  DOM.title_input.focus();
}

function delTaskFromUI(id, DOMList) {
  const li = document.getElementById(`li-${id}-${DOMList}`);
  const ul = document.getElementById(`list_${DOMList}`);
  ul.removeChild(li);
}

function updateTasksNumber() {
  DOM.active_title.textContent = `Active (${taskArr.active.length})`;
  DOM.completed_title.textContent = `Completed (${taskArr.completed.length})`;
}


//--------CONTROLLER--------------
window.onload = init;

// Tasks arrays active/completed
let taskArr = {
  active: [],
  completed: []
}

function init() {
  getLocalStorageData();
  addStoredTasksToUI();
  updateTasksNumber();
}

// retrieves localStorage data and puts it in tasksArr
function getLocalStorageData() {
  let data = JSON.parse(localStorage.getItem("info"));

  if (data === null) {
    console.log('empty local storage');
  } else {

    // check if active has something stored in it
    if (data.active.length === 0) {
      console.log('no active tasks in localStorage');
    } else {
      data.active.forEach((e) => {
        let nTask = new Task(e.id, e.title, e.desc, e.completed)
        taskArr.active.push(nTask);
      })
    }

    // check if completed has something stored in it
    if (data.completed.length === 0) {
      console.log('no completed tasks in localStorage')
    } else {
      data.completed.forEach((e) => {
        let nTask = new Task(e.id, e.title, e.desc, e.completed)
        taskArr.completed.push(nTask);
      })
    }
  }
}

// populate DOM with stored data
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

function clearInputFields() {
  DOM.title_input.value = "";
  DOM.desc_input.value = "";
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
    const task = new Task(id, title, desc, false);

    // 4 Add task to lists
    addTask(task, "active");
  }

}

function addTask(task, list) {
  // 1. add task to the array
  addTaskToArr(task, taskArr[list]);

  // 2. add task to the DOM
  addTaskToUI(task, list);

  // 3. update localStorage
  updateLocalStorage();

  // 4. update lists numbers
  updateTasksNumber();
}

function deleteTask(id, list) {

  // 1. delete task from array
  delTaskFromArr(id, taskArr[list]);

  // 2. delete task from UI
  delTaskFromUI(id, list)

  // 3. update local storage
  updateLocalStorage();

  // 4. update lists numbers
  updateTasksNumber();
}

function editTask(id, list) {

  // save task title & desc
  let index = getIndexOfId(id, taskArr[list]);

  //retrieve task
  let task = taskArr[list][index];

  // delete task (from arr and DOM)
  deleteTask(id, list);

  // put it into the input fields
  DOM.title_input.value = task.title;
  DOM.desc_input.value = task.desc;

  // update local storage
  updateLocalStorage();

}

// push taskArr data into the localStorage
function updateLocalStorage() {
  localStorage.clear();
  let tasks = JSON.stringify(taskArr);
  localStorage.setItem("info", tasks);
}

function moveTaskFromTo(event, srcList, destList) {
  // id example in the dom <li id="li-active-3"></li>

  // 1. retrieve the id of the li from the HTML
  let id = parseInt(event.target.id.split('-')[2], 10);
  //console.log(id);

  // 2. retrieve the array index of id in srcList
  let index = getIndexOfId(id, taskArr[srcList]);

  // 3. validate if index found exists in the array
  if (index === -1) {
    console.log(`Trying to complete inexistent task of id ${id}`);
  } else {

    // 4. create a copy of the task obj to be deleted
    let tempObj = JSON.parse(JSON.stringify(taskArr[srcList][index]));

    // 5. extract it's data
    let tempTitle = tempObj.title;
    let tempDesc = tempObj.desc;

    // 6. delete task from source list
    deleteTask(id, srcList);

    // 7. Generate a new unique id for the array where the task will be inserted
    let newId = genIdForArr(taskArr[destList]);

    // 8. create a new Task with the same data
    let task = new Task(newId, tempTitle, tempDesc);

    // 9. Add task
    addTask(task, destList);
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
    deleteTask(id, listType);
  } else if (buttonType === "checkbox") {
    toggleTaskCompletion(event);
  } else if (buttonType === "editbtn") {
    editTask(id, listType);
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
  close_btn: document.getElementById("close-btn"),
  active_title: document.querySelector('.active-title'),
  completed_title: document.querySelector('.completed-title')
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
DOM.completed.addEventListener('click', taskItemButtonPresssed);





