const taskInput = document.getElementById('taskInput');
const listContainer = document.getElementById('listContainer');
const emptyMessage = document.querySelector('.empty');
const addTaskButton = document.getElementById('addTaskButton');
const heading = document.getElementById("quoteHeading");
let tasks = [];
let editingIndex = null; // Track which task is being edited

function toggleEmptyMessage() {
    emptyMessage.style.display = tasks.length === 0 ? 'block' : 'none';
}

function renderTasks() {
    listContainer.innerHTML = "";
    // Sort: unchecked first
    const sortedTasks = [...tasks].sort((a, b) => a.checked - b.checked);
    sortedTasks.forEach((task, idx) => {
        let li = document.createElement("li");
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${task.checked ? "checked" : ""} data-idx="${tasks.indexOf(task)}">
            <span class="task-text">${task.text}</span>
            <div class="task-buttons">
               ${!task.checked 
                    ? `<button class="edit"><i class="fa-regular fa-pen-to-square" style="color: #ffffff;"></i></button>` 
                    : ""}
                <button class="delete"><i class="fa-regular fa-trash-can" style="color: #ffffff;"></i></button>
            </div>
        `;
        listContainer.appendChild(li);
    });
    toggleEmptyMessage();
}

function saveList() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadList() {
    tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    renderTasks();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}


function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        showToast("Please enter a task.");
        return;
    }

    if (editingIndex !== null) {
        // Edit mode
        tasks[editingIndex].text = taskText;
        editingIndex = null;
        addTaskButton.innerHTML = '<i class="fa-solid fa-plus fa-lg" style="color: #ffffff;"></i>';
    } else {
        // Add mode
        tasks.push({ text: taskText, checked: false });
    }

    taskInput.value = "";
    saveList();
    renderTasks();
}

addTaskButton.addEventListener('click', addTask);

taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        //event.preventDefault();
        addTask();
    }
});

listContainer.addEventListener("click", function(e) {
    // Checkbox toggle
    if (e.target.classList.contains("checkbox")) {
        const idx = parseInt(e.target.getAttribute("data-idx"));
        tasks[idx].checked = e.target.checked;
        saveList();
        renderTasks();
    }
    // Delete
    else if (e.target.closest(".delete")) {
        const li = e.target.closest("li");
        const idx = Array.from(li.querySelector('.checkbox').getAttribute("data-idx"));
        tasks.splice(idx, 1);
        saveList();
        renderTasks();
    }
    // Edit
    else if (e.target.closest(".edit")) {
        const li = e.target.closest("li");
        const idx = parseInt(li.querySelector('.checkbox').getAttribute("data-idx"));
        taskInput.value = tasks[idx].text;
        editingIndex = idx;
        addTaskButton.innerHTML = '<i class="fa-regular fa-pen-to-square" style="color: #ffffff;"></i>';
        taskInput.focus();
    }
}, false);

const quotes = [
  "Small steps every day lead to big results.",
  "Your future is created by what you do today, not tomorrow.",
  "Well done is better than well said. – Benjamin Franklin",
  "Do it now. Sometimes 'later' becomes 'never'.",
  "Great things are done by a series of small things brought together. – Vincent Van Gogh",
  "Action is the foundational key to all success. – Pablo Picasso",
  "Don’t count the days, make the days count. – Muhammad Ali",
  "Discipline is the bridge between goals and accomplishment. – Jim Rohn",
  "Dream big. Start small. Act now.",
  "One thing at a time adds up to everything in time."
];

function setRandomQuote() {
  
  const randomIndex = Math.floor(Math.random() * quotes.length);
  heading.textContent = quotes[randomIndex];
}

// Call on load
setRandomQuote();


// Initial load
loadList();