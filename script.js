window.onload = function () {
    checkDailyReset();
    loadTasks();
    updateGoalStatus();

    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark");
    }
};

// Menu toggle
function toggleMenu() {
    document.getElementById("sideMenu").classList.toggle("active");
}

// Close on outside click
document.addEventListener("click", function(e) {
    let menu = document.getElementById("sideMenu");
    let btn = document.querySelector(".menu-btn");

    if (menu.classList.contains("active") &&
        !menu.contains(e.target) &&
        !btn.contains(e.target)) {
        menu.classList.remove("active");
    }
});

// Dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
}

// Add task
function addTask() {
    let input = document.getElementById("taskInput");

    if (input.value === "") return alert("Enter task");

    createTaskElement(input.value, false);
    saveTasks();
    updateGoalStatus();

    input.value = "";
}

// Create task
function createTaskElement(text, completed) {
    let li = document.createElement("li");
    let span = document.createElement("span");

    span.textContent = text;

    if (completed) li.classList.add("completed");

    span.onclick = () => {
        li.classList.toggle("completed");
        saveTasks();
        updateGoalStatus();
    };

    let del = document.createElement("button");
    del.textContent = "❌";
    del.onclick = () => {
        li.remove();
        saveTasks();
        updateGoalStatus();
    };

    li.appendChild(span);
    li.appendChild(del);

    document.getElementById("taskList").appendChild(li);
}

// Save/load
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

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(t => createTaskElement(t.text, t.completed));
}

// Enter key
document.getElementById("taskInput").addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
});

// Goal
function setGoal() {
    let g = document.getElementById("goalInput").value;
    if (g <= 0) return alert("Invalid goal");

    localStorage.setItem("dailyGoal", g);
    updateGoalStatus();
}

function updateGoalStatus() {
    let goal = localStorage.getItem("dailyGoal");

    if (!goal) return;

    let done = document.querySelectorAll(".completed").length;

    document.getElementById("goalStatus").textContent =
        `Progress: ${done}/${goal}`;

    document.getElementById("progressBar").style.width =
        (done / goal) * 100 + "%";
}

// Reset daily
function checkDailyReset() {
    let today = new Date().toLocaleDateString();

    if (localStorage.getItem("lastDate") !== today) {
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
    } else {
        alert("Install not available yet. Interact with app first.");
    }
});

// Service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
}
