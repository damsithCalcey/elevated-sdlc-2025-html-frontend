// App State
let todos = [];
let currentFilter = "all";
let nextId = 1;

// DOM Element references
const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const filterBtns = document.querySelectorAll(".filter-btn");
const taskCount = document.getElementById("taskCount");
const clearCompletedBtn = document.getElementById("clearCompleted");
const emptyState = document.getElementById("emptyState");

function init() {
  loadTodosFromStorage();

  addBtn.addEventListener("click", addTodo);
  todoInput.addEventListener("keypress", handleKeyPress);
  todoInput.addEventListener("input", handleInputChange);

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", handleFilterChange);
  });

  clearCompletedBtn.addEventListener("click", clearCompleted);

  renderTodos();
  updateStats();
  updateEmptyState();
}

function handleInputChange() {
  const hasText = todoInput.value.trim().length > 0;
  addBtn.disabled = !hasText;
}

function handleKeyPress(e) {
  if (e.key === "Enter" && !addBtn.disabled) {
    addTodo();
  }
}

function addTodo() {
  const text = todoInput.value.trim();

  if (text === "") {
    return;
  }

  const newTodo = {
    id: nextId++,
    text: text,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  todos.unshift(newTodo);
  todoInput.value = "";
  addBtn.disabled = true;

  saveTodosToStorage();
  renderTodos();
  updateStats();
  updateEmptyState();

  todoInput.focus();
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodosToStorage();
    renderTodos();
    updateStats();
  }
}

function deleteTodo(id) {
  const todoElement = document.querySelector(`[data-id="${id}"]`);

  if (todoElement) {
    todoElement.classList.add("removing");
    setTimeout(() => {
      todos = todos.filter((t) => t.id !== id);
      saveTodosToStorage();
      renderTodos();
      updateStats();
      updateEmptyState();
    }, 300);
  }
}

function handleFilterChange(e) {
  filterBtns.forEach((btn) => btn.classList.remove("active"));
  e.target.classList.add("active");
  currentFilter = e.target.dataset.filter;
  renderTodos();
}

function getFilteredTodos() {
  switch (currentFilter) {
    case "active":
      return todos.filter((todo) => !todo.completed);
    case "completed":
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
}

function renderTodos() {
  const filteredTodos = getFilteredTodos();
  todoList.innerHTML = "";

  filteredTodos.forEach((todo) => {
    const todoElement = createTodoElement(todo);
    todoList.appendChild(todoElement);
  });
}

function createTodoElement(todo) {
  const li = document.createElement("li");
  li.className = `todo-item ${todo.completed ? "completed" : ""}`;
  li.dataset.id = todo.id;

  li.innerHTML = `
        <div class="todo-checkbox ${todo.completed ? "checked" : ""}" 
             onclick="toggleTodo(${todo.id})">
        </div>
        <span class="todo-text">${createDiv(todo.text)}</span>
        <div class="todo-actions">
            <button class="delete-btn" onclick="deleteTodo(${
              todo.id
            })" title="Delete task">
                🗑️
            </button>
        </div>
    `;

  return li;
}

function createDiv(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function updateStats() {
  const activeTodos = todos.filter((todo) => !todo.completed);
  const count = activeTodos.length;

  if (count === 0) {
    taskCount.textContent = "No tasks remaining";
  } else if (count === 1) {
    taskCount.textContent = "1 task remaining";
  } else {
    taskCount.textContent = `${count} tasks remaining`;
  }

  const completedTodos = todos.filter((todo) => todo.completed);
  clearCompletedBtn.disabled = completedTodos.length === 0;
}

function updateEmptyState() {
  const filteredTodos = getFilteredTodos();

  if (filteredTodos.length === 0) {
    emptyState.classList.remove("hidden");

    const emptyTitle = emptyState.querySelector("h3");
    const emptyText = emptyState.querySelector("p");

    switch (currentFilter) {
      case "active":
        emptyTitle.textContent = "No active tasks!";
        emptyText.textContent = "All your tasks are completed 🎉";
        break;
      case "completed":
        emptyTitle.textContent = "No completed tasks!";
        emptyText.textContent = "Complete some tasks to see them here";
        break;
      default:
        emptyTitle.textContent = "No tasks yet!";
        emptyText.textContent = "Add a task above to get started";
        break;
    }
  } else {
    emptyState.classList.add("hidden");
  }
}

function clearCompleted() {
  const completedTodos = todos.filter((todo) => todo.completed);

  if (completedTodos.length > 0) {
    const confirmMessage =
      completedTodos.length === 1
        ? "Are you sure you want to delete this completed task?"
        : `Are you sure you want to delete ${completedTodos.length} completed tasks?`;

    if (confirm(confirmMessage)) {
      todos = todos.filter((todo) => !todo.completed);
      saveTodosToStorage();
      renderTodos();
      updateStats();
      updateEmptyState();
    }
  }
}

function saveTodosToStorage() {
  try {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("nextId", nextId.toString());
  } catch (error) {
    console.error("Failed to save todos to localStorage:", error);
  }
}

function loadTodosFromStorage() {
  try {
    const savedTodos = localStorage.getItem("todos");
    const savedNextId = localStorage.getItem("nextId");

    if (savedTodos) {
      todos = JSON.parse(savedTodos);
    }

    if (savedNextId) {
      nextId = parseInt(savedNextId, 10);
    }

    // Ensure that the nextId is always higher than any existing todo id
    if (todos.length > 0) {
      const maxId = Math.max(...todos.map((todo) => todo.id));
      nextId = Math.max(nextId, maxId + 1);
    }
  } catch (error) {
    console.error("Failed to load todos from localStorage:", error);
    todos = [];
    nextId = 1;
  }
}

// Demo data function
function addDemoData() {
  const demoTodos = [
    {
      id: nextId++,
      text: "Learn HTML basics",
      completed: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: nextId++,
      text: "Style with CSS",
      completed: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: nextId++,
      text: "Add JavaScript functionality",
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: nextId++,
      text: "Convert to React components",
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: nextId++,
      text: "Add React state management",
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ];

  todos = [...demoTodos, ...todos];
  saveTodosToStorage();
  renderTodos();
  updateStats();
  updateEmptyState();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// A few convenience functions that are exposed globally
window.addDemoData = addDemoData;
window.clearAllTodos = function () {
  if (
    confirm("Are you sure you want to delete ALL todos? This cannot be undone.")
  ) {
    todos = [];
    nextId = 1;
    saveTodosToStorage();
    renderTodos();
    updateStats();
    updateEmptyState();
  }
};
