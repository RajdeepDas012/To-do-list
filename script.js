// Load tasks when page opens
window.onload = function () {
    loadTasks();
};

function addTask() {
    let input = document.getElementById("taskInput");
    let task = input.value;

    if (task === "") {
        alert("Please enter a task!");
        return;
    }

    createTaskElement(task, false);
    saveTasks();

    input.value = "";
}

// Create task UI
function createTaskElement(taskText, isCompleted) {
    let li = document.createElement("li");

    let span = document.createElement("span");
    span.textContent = taskText;

    if (isCompleted) {
        li.classList.add("completed");
    }

    // Toggle complete
    span.onclick = function () {
        li.classList.toggle("completed");
        saveTasks();
    };

    // EDIT button
    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = function () {
        let newTask = prompt("Edit your task:", span.textContent);
        if (newTask !== null && newTask !== "") {
            span.textContent = newTask;
            saveTasks();
        }
    };

    // DELETE button
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = function () {
        li.remove();
        saveTasks();
    };

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    document.getElementById("taskList").appendChild(li);
}


// Save tasks to localStorage
function saveTasks() {
    let tasks = [];
    let listItems = document.querySelectorAll("#taskList li");

    listItems.forEach(function (li) {
        let text = li.querySelector("span").textContent;
        let completed = li.classList.contains("completed");

        tasks.push({ text: text, completed: completed });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(function (task) {
        createTaskElement(task.text, task.completed);
    });
}
document.getElementById("taskInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});
