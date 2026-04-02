// On page load
window.onload = function () {
    checkDailyReset();
    loadTasks();
    updateGoalStatus();
};

// Add Task
function addTask() {
    let input = document.getElementById("taskInput");
    let task = input.value;

    if (task === "") {
        alert("Please enter a task!");
        return;
    }

    createTaskElement(task, false);
    saveTasks();
    updateGoalStatus();

    input.value = "";
}

// Create Task
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
        updateGoalStatus();
    };

    // Edit
    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = function () {
        let newTask = prompt("Edit your task:", span.textContent);
        if (newTask !== null && newTask !== "") {
            span.textContent = newTask;
            saveTasks();
        }
    };

    // Delete
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = function () {
        li.remove();
        saveTasks();
        updateGoalStatus();
    };

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    document.getElementById("taskList").appendChild(li);
}

// Save tasks
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

// Load tasks
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(function (task) {
        createTaskElement(task.text, task.completed);
    });
}

// Enter key support
document.getElementById("taskInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});

// Set goal
function setGoal() {
    let goal = document.getElementById("goalInput").value;

    if (goal === "" || goal <= 0) {
        alert("Enter a valid goal!");
        return;
    }

    localStorage.setItem("dailyGoal", goal);
    updateGoalStatus();
}

// Update goal + progress bar
function updateGoalStatus() {
    let goal = localStorage.getItem("dailyGoal");

    if (!goal) {
        document.getElementById("goalStatus").textContent = "No goal set";
        document.getElementById("progressBar").style.width = "0%";
        return;
    }

    let completedTasks = document.querySelectorAll(".completed").length;

    document.getElementById("goalStatus").textContent =
        `Progress: ${completedTasks} / ${goal}`;

    let percent = (completedTasks / goal) * 100;
    document.getElementById("progressBar").style.width = percent + "%";
}

// Daily reset
function checkDailyReset() {
    let today = new Date().toLocaleDateString();
    let lastDate = localStorage.getItem("lastDate");

    if (lastDate !== today) {
        localStorage.removeItem("tasks");
        localStorage.removeItem("dailyGoal");
        localStorage.setItem("lastDate", today);
    }
}
