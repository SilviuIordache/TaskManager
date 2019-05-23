class Task {
    constructor(id, title) {
        this.id = id;
        this.title = title;
    } 
}

active = [];
completed = [];

function populate() {
    //dummy tasks input - to be replaced with the data from the input fields
    let titlesActive = ["Clean room", "Fix car", "Gardening", "Groceries"];
    let titlesCompleted = ["Sleep", "Play"];

    // populate "active" tasks list
    titlesActive.forEach(e => createTask(e, active));
    deleteTask(1, active);
    createTask("Go running", active);

    // also populate "completed" tasks list
    titlesCompleted.forEach(e => createTask(e, completed));
}

// finds the array index of a task by id
function getIndexOfId(id, arr) {
    return arr.findIndex(el => el.id === id);
}

// create a new task and add it to the target array
function createTask(title, arr) {
    // generate unique ids for each task obj
    let id;
    if (arr.length === 0) {
        //id = Math.round(Math.random() * 10);
        id = 0;
    } else {
        id = arr[arr.length - 1].id + 1;
    }
    const task = new Task(id, title);

    // add task to the array
    arr.push(task);

    // add task to the DOM
    addTask_UI(id, title);
}

// edit a task
function editTask(id, title, arr) {
    const index = getIndexOfId(id, arr);
    arr[index].title = title;
}

// deletes a task by id
function deleteTask(id, arr) {
    const index = getIndexOfId(id, arr);
    if (index != -1) {
        arr.splice(index, 1);
    }
}

// complete a task by id
function completeTask(id) {
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

        // delete the task from the active list
        deleteTask(id, active);
    }
}

const DOM = {
    form: document.getElementById("form"),
    input:document.getElementById("input"),
    btn: document.getElementById("btn"),
    list: document.getElementById("list")
}

// button event listener
DOM.btn.addEventListener('click', createTask);

function addTask_UI(id, text) {
    //var id = 3;
    //var text = "alabala";
    const item = `<li id="li-${id}">${text}<input id="box-${id}" class="checkboxes" type="checkbox"></li>`

    DOM.list.insertAdjacentHTML('beforeend', item);
}

function initializeList_UI() {

}



//populate();














