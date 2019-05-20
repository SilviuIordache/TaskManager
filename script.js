class Task {
    constructor(id, title, desc) {
        this.id = id;
        this.title = title;
        this.desc = desc;
    }
}

// Arrays that hold the active and completed tasks
let activeTasks = [];
let completedTasks = [];

//dummy tasks input - to be replaced with the data from the input fields
let titles = ["Clean room", "Fix car", "Gardening", "Groceries"];
let descriptions = ["des1", "des2", "des3", "des4"];
//let prios = ["high", "med", "low", "med"];

// Quick creation and insertion of tasks data into the array
for (let i = 0; i < 4; i++) {
    addTask(titles[i], descriptions[i], activeTasks);
}

// add new task to one of the Task arrays
function addTask(title, desc, arr) {
    // generate unique id for each task obj (independent of array index)
    let id;
    if (arr.length === 0) {
        //id = Math.round(Math.random() * 10);
        id = 0;
    } else {
        id = arr[arr.length - 1].id + 1;
    }
    const task = new Task(id, title, desc, );
    arr.push(task);
}

// finds the index of a task with id = idTarget
function getIndexOfId(idTarget, arr) {
    return arr.findIndex(el => el.id === idTarget);
}

// deletes the task with id = idToDel
function deleteTask(idToDel, arr) {
    const index = getIndexOfId(idToDel, arr);
    if (index != -1) {
        arr.splice(index, 1);
    }
}

function completeTask(id) {
    const index = getIndexOfId(id, activeTasks);

    // create a copy of the task obj to be deleted
    let o = JSON.parse(JSON.stringify(activeTasks[index]));

    // extract it's data

    // create a new Task obj
    addTask(o.id, )
    completedTasks.push(completedTask);
    deleteTask(index, activeTasks);
}
//deleteTask(2, activeTasksArr);









