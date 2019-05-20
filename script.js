class Task {
    constructor(id, title, desc, prio = 3, state = 'active') {
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.prio = prio;
        this.state = state;
    }

    moveToCompleted() {
        // first implement the unique id
        // find the task with the id you want to delete
        // save it into a new item
        // delete it from the active tasks
        // push it into the compelted tasks
    }
}

// Arrays that hold the active and completed tasks
let activeTasksArr = [];
let completedTasksArr = [];

//dummy tasks input - to be replaced with the data from the input fields
let titles = ["Clean room", "Fix car", "Gardening", "Groceries"];
let descriptions = ["des1", "des2", "des3", "des4"];
let prios = ["high", "med", "low", "med"];

// Quick creation and insertion of tasks data into the array
for (let i = 0; i < 4; i++) {
    addTaskToActiveArr(titles[i], descriptions[i], prios[i]);
}

function addTaskToActiveArr(title, desc, prio) {
    //need to create unique ids for quick getting retrieving items from the list. Check the Budgety app implementation of those
    let id = 33;
    const task = new Task(id, title, desc, prio);
    activeTasksArr.push(task);
}







