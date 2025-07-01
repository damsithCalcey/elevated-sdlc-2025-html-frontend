// App State
let tasks = [];
let currentFilter = "all";
let editingTaskId = null;
let nextId = 1;

// DOM Element references
const createTaskBtn = document.getElementById("createTaskBtn");
const taskModal = document.getElementById("taskModal");
const viewModal = document.getElementById("viewModal");
const confirmModal = document.getElementById("confirmModal");
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter-btn");
const emptyState = document.getElementById("emptyState");

// Form element references
const modalTitle = document.getElementById("modalTitle");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskDueDate = document.getElementById("taskDueDate");
const titleCount = document.getElementById("titleCount");
const descCount = document.getElementById("descCount");
const saveBtn = document.getElementById("saveBtn");

// Stats elements references
const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");
const overdueTasks = document.getElementById("overdueTasks");

function init() {
  loadTasksFromStorage();
  setupEventListeners();
  renderTasks();
  updateStats();
  updateEmptyState();
  setMinDate();
}

function setMinDate() {
  const today = new Date().toISOString().split("T")[0];
  taskDueDate.min = today;
}

function setupEventListeners() {
  // Main buttons
  createTaskBtn.addEventListener("click", () => openTaskModal());

  // Modal close buttons
  document
    .getElementById("closeModal")
    .addEventListener("click", closeTaskModal);
  document
    .getElementById("closeViewModal")
    .addEventListener("click", closeViewModal);
  document
    .getElementById("cancelBtn")
    .addEventListener("click", closeTaskModal);

  taskForm.addEventListener("submit", handleFormSubmit);

  taskTitle.addEventListener("input", updateCharCount);
  taskDescription.addEventListener("input", updateCharCount);

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", handleFilterChange);
  });

  // View modal actions
  document
    .getElementById("editTaskBtn")
    .addEventListener("click", handleEditFromView);
  document
    .getElementById("deleteTaskBtn")
    .addEventListener("click", handleDeleteFromView);
  document
    .getElementById("completeTaskBtn")
    .addEventListener("click", handleCompleteFromView);

  // Confirmation modal
  document
    .getElementById("confirmCancel")
    .addEventListener("click", closeConfirmModal);
  document
    .getElementById("confirmAction")
    .addEventListener("click", handleConfirmAction);

  // Close modals when clicking outside
  window.addEventListener("click", handleOutsideClick);

  // Keyboard shortcuts
  document.addEventListener("keydown", handleKeyboardShortcuts);
}

function handleKeyboardShortcuts(e) {
  if (e.key === "Escape") {
    closeAllModals();
  }
  if (e.ctrlKey && e.key === "n") {
    e.preventDefault();
    openTaskModal();
  }
}

function closeAllModals() {
  closeTaskModal();
  closeViewModal();
  closeConfirmModal();
}

function handleOutsideClick(e) {
  if (e.target === taskModal) closeTaskModal();
  if (e.target === viewModal) closeViewModal();
  if (e.target === confirmModal) closeConfirmModal();
}

function openTaskModal(taskId = null) {
  editingTaskId = taskId;

  if (taskId) {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      modalTitle.textContent = "Edit Task";
      taskTitle.value = task.title;
      taskDescription.value = task.description || "";
      taskDueDate.value = task.dueDate || "";
      saveBtn.textContent = "Update Task";
    }
  } else {
    modalTitle.textContent = "Create New Task";
    taskForm.reset();
    saveBtn.textContent = "Save Task";
  }

  updateCharCount();
  taskModal.classList.add("show");
  taskTitle.focus();
}

function closeTaskModal() {
  taskModal.classList.remove("show");
  taskForm.reset();
  editingTaskId = null;
}

function openViewModal(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  document.getElementById("viewTitle").textContent = task.title;
  document.getElementById("viewDescription").textContent =
    task.description || "No description provided";
  document.getElementById("viewDueDate").textContent = task.dueDate
    ? formatDate(task.dueDate)
    : "No due date set";

  const statusText = task.completed
    ? "Completed"
    : isOverdue(task)
    ? "Overdue"
    : "Pending";
  document.getElementById("viewStatus").textContent = statusText;

  const editBtn = document.getElementById("editTaskBtn");
  const completeBtn = document.getElementById("completeTaskBtn");

  editBtn.style.display = task.completed ? "none" : "inline-block";
  completeBtn.style.display = task.completed ? "none" : "inline-block";

  editBtn.dataset.taskId = taskId;
  document.getElementById("deleteTaskBtn").dataset.taskId = taskId;
  completeBtn.dataset.taskId = taskId;

  viewModal.classList.add("show");
}

function closeViewModal() {
  viewModal.classList.remove("show");
}

function handleFormSubmit(e) {
  e.preventDefault();

  const title = taskTitle.value.trim();
  const description = taskDescription.value.trim();
  const dueDate = taskDueDate.value;

  if (!title) {
    alert("Title is required");
    taskTitle.focus();
    return;
  }

  // Validate due date is not in the past
  if (dueDate && new Date(dueDate) < new Date().setHours(0, 0, 0, 0)) {
    alert("Due date cannot be in the past");
    taskDueDate.focus();
    return;
  }

  if (editingTaskId) {
    updateTask(editingTaskId, { title, description, dueDate });
  } else {
    createTask({ title, description, dueDate });
  }

  closeTaskModal();
}

function createTask(taskData) {
  const newTask = {
    id: nextId++,
    title: taskData.title,
    description: taskData.description,
    dueDate: taskData.dueDate,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  saveTasksToStorage();
  renderTasks();
  updateStats();
  updateEmptyState();
}

function updateTask(taskId, updates) {
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    saveTasksToStorage();
    renderTasks();
    updateStats();
    updateEmptyState();
  }
}

function deleteTask(taskId) {
  tasks = tasks.filter((t) => t.id !== taskId);
  saveTasksToStorage();
  renderTasks();
  updateStats();
  updateEmptyState();
}

function completeTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task && !task.completed) {
    showConfirmModal(
      "Mark the task as completed?",
      "Are you sure you want to mark this task as completed? You cannot undo this action.",
      () => {
        task.completed = true;
        task.completedAt = new Date().toISOString();
        saveTasksToStorage();
        renderTasks();
        updateStats();
        updateEmptyState();
        closeViewModal();
      }
    );
  }
}

function showConfirmModal(title, message, onConfirm) {
  document.getElementById("confirmTitle").textContent = title;
  document.getElementById("confirmMessage").textContent = message;

  const confirmBtn = document.getElementById("confirmAction");
  confirmBtn.onclick = () => {
    onConfirm();
    closeConfirmModal();
  };

  confirmModal.classList.add("show");
}

function closeConfirmModal() {
  confirmModal.classList.remove("show");
}

function handleEditFromView(e) {
  const taskId = parseInt(e.target.dataset.taskId);
  closeViewModal();
  openTaskModal(taskId);
}

function handleDeleteFromView(e) {
  const taskId = parseInt(e.target.dataset.taskId);
  const task = tasks.find((t) => t.id === taskId);

  showConfirmModal(
    "Delete Task",
    `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
    () => {
      deleteTask(taskId);
      closeViewModal();
    }
  );
}

function handleCompleteFromView(e) {
  const taskId = parseInt(e.target.dataset.taskId);
  completeTask(taskId);
}

function handleConfirmAction() {
  // This will be set by showConfirmModal
}

function handleFilterChange(e) {
  filterBtns.forEach((btn) => btn.classList.remove("active"));
  e.target.classList.add("active");
  currentFilter = e.target.dataset.filter;
  renderTasks();
  updateEmptyState();
}

function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  return new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);
}

function getFilteredTasks() {
  let filtered = [...tasks];
  switch (currentFilter) {
    case "pending":
      filtered = filtered.filter((task) => !task.completed);
      break;
    case "completed":
      filtered = filtered.filter((task) => task.completed);
      break;
    case "overdue":
      filtered = filtered.filter((task) => isOverdue(task));
      break;
  }

  // Sort by due date (overdue first, then by date)
  filtered.sort((a, b) => {
    const aOverdue = isOverdue(a);
    const bOverdue = isOverdue(b);

    // Overdue tasks first
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    // Then by due date
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;

    // Finally by creation date
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return filtered;
}

function renderTasks() {
  const filteredTasks = getFilteredTasks();
  taskList.innerHTML = "";

  filteredTasks.forEach((task) => {
    const taskElement = createTaskCard(task);
    taskList.appendChild(taskElement);
  });
}

function createTaskCard(task) {
  const card = document.createElement("div");
  card.className = `task-card ${task.completed ? "completed" : ""} ${
    isOverdue(task) ? "overdue" : ""
  }`;
  card.onclick = () => openViewModal(task.id);

  const status = task.completed
    ? "completed"
    : isOverdue(task)
    ? "overdue"
    : "pending";
  const statusText = status.charAt(0).toUpperCase() + status.slice(1);

  const dueDateText = task.dueDate ? formatDate(task.dueDate) : "No due date";
  const dueDateClass = isOverdue(task) ? "overdue" : "";

  card.innerHTML = `
        <div class="task-status ${status}">${statusText}</div>
        <h3 class="task-title"><div>${task.title}</div></h3>
        ${
          task.description
            ? `<p class="task-description"><div>${task.description}</div></p>`
            : ""
        }
        <div class="task-meta">
            <div class="task-due-date ${dueDateClass}">
                📅 ${dueDateText}
            </div>
            <div class="task-actions" onclick="event.stopPropagation()">
                ${
                  !task.completed
                    ? `
                    <button class="action-btn edit" onclick="openTaskModal(${task.id})" title="Edit task">
                        ✏️
                    </button>
                    <button class="action-btn complete" onclick="completeTask(${task.id})" title="Mark as completed">
                        ✅
                    </button>
                `
                    : ""
                }
                <button class="action-btn delete" onclick="confirmDelete(${
                  task.id
                })" title="Delete task">
                    🗑️
                </button>
            </div>
        </div>
    `;
  return card;
}

function confirmDelete(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  showConfirmModal(
    "Delete Task",
    `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
    () => deleteTask(taskId)
  );
}

function updateCharCount() {
  titleCount.textContent = taskTitle.value.length;
  descCount.textContent = taskDescription.value.length;
}

function updateStats() {
  const total = tasks.length;
  const pending = tasks.filter((task) => !task.completed).length;
  const completed = tasks.filter((task) => task.completed).length;
  const overdue = tasks.filter((task) => isOverdue(task)).length;

  totalTasks.textContent = total;
  pendingTasks.textContent = pending;
  completedTasks.textContent = completed;
  overdueTasks.textContent = overdue;
}

function updateEmptyState() {
  const filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0) {
    emptyState.classList.remove("hidden");
    const title = emptyState.querySelector("h3");
    const text = emptyState.querySelector("p");

    switch (currentFilter) {
      case "pending":
        title.textContent = "No pending tasks!";
        text.textContent = "All your tasks are completed 🎉";
        break;
      case "completed":
        title.textContent = "No completed tasks!";
        text.textContent = "Complete some tasks to see them here";
        break;
      case "overdue":
        title.textContent = "No overdue tasks!";
        text.textContent = "Great job staying on track! 👏";
        break;
      default:
        title.textContent = "No tasks found!";
        text.textContent = "Create your first task to get started";
        break;
    }
  } else {
    emptyState.classList.add("hidden");
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const tomorrowOnly = new Date(
    tomorrow.getFullYear(),
    tomorrow.getMonth(),
    tomorrow.getDate()
  );

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return "Today";
  } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
    return "Tomorrow";
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  }
}

function saveTasksToStorage() {
  try {
    localStorage.setItem("advancedTasks", JSON.stringify(tasks));
    localStorage.setItem("nextTaskId", nextId.toString());
  } catch (error) {
    console.error("Failed to save tasks to localStorage:", error);
  }
}

function loadTasksFromStorage() {
  try {
    const savedTasks = localStorage.getItem("advancedTasks");
    const savedNextId = localStorage.getItem("nextTaskId");

    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
    }

    if (savedNextId) {
      nextId = parseInt(savedNextId, 10);
    }

    // Ensure nextId is always higher than any existing task id
    if (tasks.length > 0) {
      const maxId = Math.max(...tasks.map((task) => task.id));
      nextId = Math.max(nextId, maxId + 1);
    }
  } catch (error) {
    console.error("Failed to load tasks from localStorage:", error);
    tasks = [];
    nextId = 1;
  }
}

// Demo data function
function addDemoData() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const demoTasks = [
    {
      id: nextId++,
      title: "Complete project proposal",
      description:
        "Finish the detailed project proposal for the new client including timeline, budget, and deliverables.",
      dueDate: yesterday.toISOString().split("T")[0],
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: nextId++,
      title: "Team meeting preparation",
      description:
        "Prepare agenda and presentation slides for the weekly team meeting.",
      dueDate: today.toISOString().split("T")[0],
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: nextId++,
      title: "Code review for React components",
      description:
        "Review pull requests for the new React components and provide feedback.",
      dueDate: tomorrow.toISOString().split("T")[0],
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: nextId++,
      title: "Update documentation",
      description:
        "Update the API documentation with the latest endpoints and examples.",
      dueDate: nextWeek.toISOString().split("T")[0],
      completed: true,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    },
    {
      id: nextId++,
      title: "Learn advanced CSS techniques",
      description:
        "Study CSS Grid, Flexbox, and modern layout techniques for better responsive design.",
      dueDate: "",
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ];

  tasks = [...demoTasks, ...tasks];
  saveTasksToStorage();
  renderTasks();
  updateStats();
  updateEmptyState();
}

function clearAllTasks() {
  if (
    confirm("Are you sure you want to delete ALL tasks? This cannot be undone.")
  ) {
    tasks = [];
    nextId = 1;
    saveTasksToStorage();
    renderTasks();
    updateStats();
    updateEmptyState();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// A few convenience functions that are exposed globally
window.addDemoData = addDemoData;
window.clearAllTasks = clearAllTasks;
