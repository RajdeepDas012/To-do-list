// On load
window.onload = function () {
    checkDailyReset();
    loadTasks();
    updateGoalStatus();
};

// Toggle menu
function toggleMenu() {
    document.getElementById("sideMenu").classList.toggle("active");
}

// Add task
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

// Create task
function createTaskElement(taskText, isCompleted) {
    let li = document.createElement("li");

    let span = document.createElement("span");
    span.textContent = taskText;

    if (isCompleted) li.classList.add("completed");

    span.onclick = function () {
        li.classList.toggle("completed");
        saveTasks();
        updateGoalStatus();
    };

    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = function () {
        let newTask = prompt("Edit your task:", span.textContent);
        if (newTask) {
            span.textContent = newTask;
            saveTasks();
        }
    };

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

// Save
function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks.push({
            text: li.querySelector("span").textContent,
            completed: li.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => createTaskElement(task.text, task.completed));
}

// Enter key
document.getElementById("taskInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") addTask();
});

// Goal
function setGoal() {
    let goal = document.getElementById("goalInput").value;
    if (goal <= 0) return alert("Enter valid goal");

    localStorage.setItem("dailyGoal", goal);
    updateGoalStatus();
}

// Update goal
function updateGoalStatus() {
    let goal = localStorage.getItem("dailyGoal");

    if (!goal) {
        document.getElementById("goalStatus").textContent = "No goal set";
        document.getElementById("progressBar").style.width = "0%";
        return;
    }

    let completed = document.querySelectorAll(".completed").length;

    document.getElementById("goalStatus").textContent =
        `Progress: ${completed} / ${goal}`;

    document.getElementById("progressBar").style.width =
        (completed / goal) * 100 + "%";
}

// Daily reset
function checkDailyReset() {
    let today = new Date().toLocaleDateString();
    let lastDate = localStorage.getItem("lastDate");

    if (lastDate !== today) {
        localStorage.clear();
        localStorage.setItem("lastDate", today);
    }
}

// PWA install
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById("installBtn").style.display = "block";
});

document.getElementById("installBtn").addEventListener("click", () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
            deferredPrompt = null;
        });
    }
});

// Service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
}
