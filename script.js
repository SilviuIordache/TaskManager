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


function addTaskToArr(title, arr) {
    // generate unique ids for each task obj
    let id;
    if (arr.length === 0) {
        //id = Math.round(Math.random() * 10);
        id = 0;
    } else {
        id = arr[arr.length - 1].id + 1;
    }
    const task = new Task(id, title);

    arr.push(task);

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
function addTaskToUI(id, text) {
    const item = `<li id="li-${id}">${text}<input id="box-${id}" class="checkboxes" type="checkbox"></li>`

    DOM.list.insertAdjacentHTML('beforeend', item);

    form.reset();

}

function delTaskFromUI(id) {
    
}

//--------CONTROLLER--------------
let active = [];
let completed = [];

function createTask() {

    if (DOM.input.value === "") {
        alert("Cannot add empty task");
    } else {
        // 1. Get data from the input field
        let title = input.value;
        let id = 1;

        // 2. add task to the array
        addTaskToArr(title, active);

        // 3. add task to the UI
        addTaskToUI(id, title);
    }

}

// retrieve the id of the task from the checked box (they share the same id)

function completeTask(id) {

    // 1. completeTask logic

    // 2. update UI - remove task from the list
    const index = getIndexOfId(id, active);
    if (index === -1) {
        console.log(`Trying to complete inexistent task of id ${id}`);
    } else {
        // create a copy of the task obj to be deleted
        let tempObj = JSON.parse(JSON.stringify(active[index]));

        // extract it's data
        let tempTitle = tempObj.title;

        // create a new Task with the same title and add it to the completed tasks
        createTask(tempTitle, completed)

        // TO DO: create a second list for completed tasks, with HTML & CSS 

        // delete the task from the active list
        delTaskFromArr(id, active);

        delTaskFromUI(id, active)
    }
}


const DOM = {
    form: document.getElementById("form"),
    input: document.getElementById("input"),
    btn: document.getElementById("btn"),
    list_active: document.getElementById("list_active")
}

DOM.btn.addEventListener('click', createTask);

//-------TESTING--------------------
function populateArrays() {
    //dummy tasks input - to be replaced with the data from the input fields
    let titlesActive = ["Clean room", "Fix car", "Gardening", "Groceries"];
    let titlesCompleted = ["Sleep", "Play"];

    // populate "active" tasks list
    titlesActive.forEach(e => addTaskToArr(e, active));
    delTaskFromArr(1, active);
    addTaskToArr("Go running", active);

    // also populate "completed" tasks list
    titlesCompleted.forEach(e => addTaskToArr(e, completed));
}

populateArrays();