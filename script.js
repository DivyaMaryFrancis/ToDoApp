const taskInput = document.getElementById("taskInput");
const listContainer = document.getElementById("listContainer");
const emptyMessage = document.querySelector(".empty");
const addTaskButton = document.getElementById("addTaskButton");
const heading = document.getElementById("quoteHeading");

let tasks = [];
let editingTaskId = null; 


function toggleEmptyMessage() {
  emptyMessage.style.display = tasks.length === 0 ? "block" : "none";
}


function renderTasks() {
  listContainer.innerHTML = "";

  const sortedTasks = [...tasks].sort((a, b) => a.checked - b.checked);

  sortedTasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${task.checked ? "checked" : ""} data-id="${task.id}">
      <span class="task-text ${task.checked ? "completed" : ""}">${task.text}</span>
      <div class="task-buttons">
        ${!task.checked ? `<button class="edit"><i class="fa-regular fa-pen-to-square" style="color: #ffffff;"></i></button>` : ""}
        <button class="delete"><i class="fa-regular fa-trash-can" style="color: #ffffff;"></i></button>
      </div>
    `;
    listContainer.appendChild(li);
    li.dataset.id = task.id; 
  });

  toggleEmptyMessage();
    updateProgress();
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
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function updateProgress() {
  const completed = tasks.filter(t => t.checked).length;
  const total = tasks.length;
 
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const bar = document.getElementById("progressBar");
  const text = document.getElementById("progressText");

  bar.style.width = percent + "%";
    text.textContent = total === 0 ? "" : `${percent}% complete`;
}



function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    showToast("Please enter a task.");
    return;
  }

  if (editingTaskId) {
    
    const task = tasks.find((t) => t.id === editingTaskId);
    if (task) task.text = taskText;
    editingTaskId = null;
    addTaskButton.innerHTML =
      '<i class="fa-solid fa-plus fa-lg" style="color: #ffffff;"></i>';
  } else {
  
    tasks.push({ id: Date.now(), text: taskText, checked: false });
  }

  taskInput.value = "";
  saveList();
  renderTasks();
}


addTaskButton.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

listContainer.addEventListener("click", function (e) {
  const li = e.target.closest("li");
  if (!li) return;
  const taskId = parseInt(li.dataset.id, 10);


  if (e.target.closest(".checkbox")) {
    if (editingTaskId === taskId) {
      showToast("This task is being edited and cannot be completed right now.");
      return;
    }
    const task = tasks.find((t) => t.id === taskId);
    if (task) task.checked = e.target.checked;
    saveList();
    renderTasks();
    return;
  }


  if (e.target.closest(".delete")) {
    if (editingTaskId === taskId) {
      showToast("This task is being edited and cannot be deleted right now.");
      return;
    }
    tasks = tasks.filter((t) => t.id !== taskId);
    saveList();
    renderTasks();
    return;
  }

  
  if (e.target.closest(".edit")) {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      taskInput.value = task.text;
      editingTaskId = task.id;
      addTaskButton.innerHTML =
        '<i class="fa-regular fa-pen-to-square" style="color: #ffffff;"></i>';
      taskInput.focus();
    }
    return;
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


setRandomQuote();
loadList();
