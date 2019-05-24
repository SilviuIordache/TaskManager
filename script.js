// -------MODEL--------------------
class Task {
  constructor(id, title) {
    this.id = id;
    this.title = title;
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
  if (index != -1) {
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
  
  const item = `<li id="li-${id}" class="text-wrap li_${DOMList}">${title}
  <input id="box-${id}" class="checkboxes" type="checkbox"></li>`

  if (DOMList === "active") {
    DOM.list_active.insertAdjacentHTML('beforeend', item);
  } else if (DOMList === "completed") {
    DOM.list_completed.insertAdjacentHTML('beforeend', item);
  }
 
  // Clear Form input fields
  input.value = "";

  // Set focus back on the first input field (title)
  input.focus();
}

function delTaskFromUI(id) {
  const li = document.getElementById(`li-${id}`);
  const ul = document.getElementById("list_active");
  ul.removeChild(li);
}



//--------CONTROLLER--------------
let active = [];
let completed = [];

function createTask(event) {

  //event.preventDefault();
  if (DOM.input.value === "") {
    alert("Cannot add empty task");
  } else {

    // 1. Get data from the input field
    let title = input.value;

    // 2. Generate an unique id for array where the task will be inserted
    const id = genIdForArr(active);

    // 3. Create the task obj
    const task = new Task(id, title);

    // 4. add task to the array
    addTaskToArr(task, active);

    // 5. add task to the DOM
    addTaskToUI(task, "active");
  }

}


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

    // 6. delete the task from the active list
    delTaskFromArr(id, active);

    // 7. delete task from UI
    delTaskFromUI(id, active)

    // 8. Generate a new unique id for the array where the task will be inserted
    let newId = genIdForArr(completed);

    // 9. create a new Task with the same data
    let task = new Task(newId, tempTitle);

    // 10. Add task to completed array logic
    addTaskToArr(task, completed);

    // 11. Add task to the DOM
    addTaskToUI(task, "completed");
  }
}


const DOM = {
  form: document.getElementById("form"),
  input: document.getElementById("input"),
  btn: document.getElementById("btn"),
  list_active: document.getElementById("list_active"),
  list_completed: document.getElementById("list_completed")
}

// --- Event Listeners -------
document.addEventListener('keypress', (event) => {
  if (event.keyCode === 13 || event.which === 13) {
    event.preventDefault();
    createTask();
  }
})
DOM.btn.addEventListener('click', createTask);


DOM.list_active.addEventListener('click', completeTask);





//-------TESTING--------------------
function populateArrays() {
  //dummy tasks input - to be replaced with the data from the input fields
  let titlesActive = ["Clean room", "Fix car", "Gardening", "Groceries"];
  let titlesCompleted = ["Sleep", "Play"];

  // populate "active" tasks list
  titlesActive.forEach(title => {
    addTaskToArr(e, active)
  });
  //delTaskFromArr(1, active);
  //addTaskToArr("Go running", active);
 

  // also populate "completed" tasks list
  titlesCompleted.forEach(e => addTaskToArr(e, completed));


}

//populateArrays();