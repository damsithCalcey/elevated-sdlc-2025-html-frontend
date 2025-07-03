// Task Board Application
class TaskBoard {
  constructor() {
    this.tasks = [];
    this.currentFilter = "all";
    this.draggedTask = null;

    this.init();
    this.loadDemoData();
    this.attachEventListeners();
    this.renderTasks();
  }

  init() {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem("taskBoardTasks");
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }

    // Update task counts
    this.updateTaskCounts();
  }

  // Demo data for showcasing the app
  loadDemoData() {
    if (this.tasks.length === 0) {
      this.tasks = [
        {
          id: 1,
          title: "Wash the car",
          description: "Take the car to the car wash place in the town",
          status: "in_progress",
          created_date: "2025-07-03T14:10:37.282383",
          due_date: "19/06/2025",
        },
        {
          id: 2,
          title: "Buy groceries",
          description: "Fruits, veggies, meat",
          status: "backlog",
          created_date: "2025-07-03T14:14:09.095076",
          due_date: "25/07/2025",
        },
        {
          id: 3,
          title: "Complete project proposal",
          description:
            "Finalize the quarterly project proposal for management review",
          status: "todo",
          created_date: "2025-07-03T09:30:15.123456",
          due_date: "15/07/2025",
        },
        {
          id: 4,
          title: "Team meeting preparation",
          description: "Prepare agenda and materials for weekly team meeting",
          status: "todo",
          created_date: "2025-07-03T11:45:22.789012",
          due_date: "10/07/2025",
        },
        {
          id: 5,
          title: "Update website content",
          description:
            "Review and update product descriptions on company website",
          status: "backlog",
          created_date: "2025-07-03T16:20:44.345678",
          due_date: "30/07/2025",
        },
        {
          id: 6,
          title: "Code review",
          description: "Review pull requests from development team",
          status: "in_progress",
          created_date: "2025-07-03T13:15:33.567890",
          due_date: "08/07/2025",
        },
        {
          id: 7,
          title: "Client presentation",
          description:
            "Prepare and deliver quarterly results presentation to client",
          status: "done",
          created_date: "2025-07-02T10:00:00.000000",
          due_date: "05/07/2025",
        },
        {
          id: 8,
          title: "Database backup",
          description: "Perform monthly database backup and verify integrity",
          status: "done",
          created_date: "2025-07-01T08:30:12.234567",
          due_date: "02/07/2025",
        },
      ];
      this.saveTasks();
    }
  }

  attachEventListeners() {
    // Modal controls
    const modalOverlay = document.getElementById("modalOverlay");
    const closeModal = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const taskForm = document.getElementById("taskForm");

    closeModal.addEventListener("click", () => this.closeModal());
    cancelBtn.addEventListener("click", () => this.closeModal());
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) this.closeModal();
    });
    taskForm.addEventListener("submit", (e) => this.handleFormSubmit(e));

    // Add task buttons in each column
    const addTaskBtns = document.querySelectorAll(".add-task-btn");
    addTaskBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const status = e.target.closest(".add-task-btn").dataset.status;
        this.openModal(status);
      });
    });

    // Search functionality
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", (e) =>
      this.handleSearch(e.target.value)
    );

    // View controls
    const viewBtns = document.querySelectorAll(".view-btn");
    viewBtns.forEach((btn) => {
      btn.addEventListener("click", () => this.handleViewChange(btn));
    });

    // Navigation items
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      item.addEventListener("click", () => this.handleNavigation(item));
    });

    // Tab buttons
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => this.handleTabChange(btn));
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeModal();
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        document.getElementById("searchInput").focus();
      }
    });
  }

  openModal(status = "backlog") {
    const modalOverlay = document.getElementById("modalOverlay");
    modalOverlay.classList.add("active");
    document.getElementById("taskTitle").focus();

    // Set the default status based on which column's add button was clicked
    document.getElementById("taskStatus").value = status;
  }

  closeModal() {
    const modalOverlay = document.getElementById("modalOverlay");
    modalOverlay.classList.remove("active");
    document.getElementById("taskForm").reset();
  }

  handleFormSubmit(e) {
    e.preventDefault();

    const title = document.getElementById("taskTitle").value.trim();
    const description = document.getElementById("taskDescription").value.trim();
    const status = document.getElementById("taskStatus").value;

    if (!title) return;

    const newTask = {
      id: Date.now(),
      title,
      description,
      status,
      created_date: new Date().toISOString(),
      due_date: "",
    };

    this.tasks.push(newTask);
    this.saveTasks();
    this.renderTasks();
    this.updateTaskCounts();
    this.closeModal();

    // Show success message
    this.showNotification("Task added successfully!", "success");
  }

  handleSearch(query) {
    const filteredTasks = this.tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.description.toLowerCase().includes(query.toLowerCase())
    );
    this.renderTasks(filteredTasks);
  }

  handleViewChange(btn) {
    document
      .querySelectorAll(".view-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Here you could implement different view modes
    // For now, we'll just show a notification
    const viewType = btn.textContent.trim();
    this.showNotification(`Switched to ${viewType}`, "info");
  }

  handleNavigation(item) {
    document
      .querySelectorAll(".nav-item")
      .forEach((i) => i.classList.remove("active"));
    item.classList.add("active");

    const navText = item.querySelector("span").textContent;
    this.showNotification(`Navigated to ${navText}`, "info");
  }

  handleTabChange(btn) {
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const tabText = btn.textContent.trim();
    this.showNotification(`Switched to ${tabText} view`, "info");
  }

  renderTasks(tasksToRender = this.tasks) {
    const columns = {
      backlog: document.getElementById("backlog-tasks"),
      todo: document.getElementById("todo-tasks"),
      in_progress: document.getElementById("progress-tasks"),
      done: document.getElementById("done-tasks"),
    };

    // Clear all columns
    Object.values(columns).forEach((column) => {
      column.innerHTML = "";
    });

    // Group tasks by status
    const tasksByStatus = {
      backlog: [],
      todo: [],
      in_progress: [],
      done: [],
    };

    tasksToRender.forEach((task) => {
      if (tasksByStatus[task.status]) {
        tasksByStatus[task.status].push(task);
      }
    });

    // Render tasks in each column
    Object.entries(tasksByStatus).forEach(([status, tasks]) => {
      const column = columns[status];
      if (tasks.length === 0) {
        column.innerHTML = this.getEmptyStateHTML(status);
      } else {
        tasks.forEach((task) => {
          const taskElement = this.createTaskElement(task);
          column.appendChild(taskElement);
        });
      }
    });

    this.attachDragAndDropListeners();
  }

  createTaskElement(task) {
    const taskCard = document.createElement("div");
    taskCard.className = "task-card";
    taskCard.draggable = true;
    taskCard.dataset.taskId = task.id;

    const statusDisplay = this.getStatusDisplay(task.status);
    const dueDateDisplay = task.due_date ? `Due: ${task.due_date}` : "";

    console.log("dueDateDisplay", dueDateDisplay);

    taskCard.innerHTML = `
            <div class="task-header">
                <h4 class="task-title">${task.title}</h4>
                <button class="task-menu" onclick="taskBoard.showTaskMenu(${
                  task.id
                })">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
            </div>
            <div class="task-content">
                <p class="task-description">${task.description}</p>
            </div>
            <div class="task-labels">
                <span class="task-label ${task.status}">${statusDisplay}</span>
                ${
                  dueDateDisplay
                    ? `<span class="task-due-date">${dueDateDisplay}</span>`
                    : ""
                }
            </div>
        `;

    // Add click listener for task details
    taskCard.addEventListener("click", (e) => {
      if (!e.target.closest(".task-menu")) {
        this.showTaskDetails(task);
      }
    });

    return taskCard;
  }

  getStatusDisplay(status) {
    const statusMap = {
      backlog: "Backlog",
      todo: "To Do",
      in_progress: "In Progress",
      done: "Done",
    };
    return statusMap[status] || status;
  }

  getEmptyStateHTML(status) {
    const messages = {
      backlog: {
        icon: "fas fa-inbox",
        text: "No backlog tasks",
        subtext: "Tasks will appear here when added to backlog",
      },
      todo: {
        icon: "fas fa-clipboard-list",
        text: "No todo tasks",
        subtext: "Ready to start tasks will appear here",
      },
      in_progress: {
        icon: "fas fa-cog",
        text: "No tasks in progress",
        subtext: "Active tasks will appear here",
      },
      done: {
        icon: "fas fa-check-circle",
        text: "No completed tasks",
        subtext: "Finished tasks will appear here",
      },
    };

    const message = messages[status];
    return `
            <div class="empty-state">
                <i class="${message.icon}"></i>
                <h3>${message.text}</h3>
                <p>${message.subtext}</p>
            </div>
        `;
  }

  attachDragAndDropListeners() {
    const taskCards = document.querySelectorAll(".task-card");
    const columns = document.querySelectorAll(".column-content");

    taskCards.forEach((card) => {
      card.addEventListener("dragstart", (e) => {
        this.draggedTask = e.target;
        e.target.classList.add("dragging");
      });

      card.addEventListener("dragend", (e) => {
        e.target.classList.remove("dragging");
        this.draggedTask = null;
      });
    });

    columns.forEach((column) => {
      column.addEventListener("dragover", (e) => {
        e.preventDefault();
        column.parentElement.classList.add("drag-over");
      });

      column.addEventListener("dragleave", (e) => {
        if (!column.contains(e.relatedTarget)) {
          column.parentElement.classList.remove("drag-over");
        }
      });

      column.addEventListener("drop", (e) => {
        e.preventDefault();
        column.parentElement.classList.remove("drag-over");

        if (this.draggedTask) {
          const taskId = parseInt(this.draggedTask.dataset.taskId);
          const newStatus = column.parentElement.dataset.status;
          this.updateTaskStatus(taskId, newStatus);
        }
      });
    });
  }

  updateTaskStatus(taskId, newStatus) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task && task.status !== newStatus) {
      task.status = newStatus;
      this.saveTasks();
      this.renderTasks();
      this.updateTaskCounts();
      this.showNotification(`Task moved to ${newStatus}`, "success");
    }
  }

  showTaskMenu(taskId) {
    // Simple context menu implementation
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      const action = confirm(
        `Task: ${task.title}\n\nChoose action:\nOK = Delete task\nCancel = Close menu`
      );
      if (action) {
        this.deleteTask(taskId);
      }
    }
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter((t) => t.id !== taskId);
    this.saveTasks();
    this.renderTasks();
    this.updateTaskCounts();
    this.showNotification("Task deleted successfully!", "success");
  }

  showTaskDetails(task) {
    const createdDate = new Date(task.created_date).toLocaleDateString();
    const details = `
            Title: ${task.title}
            Description: ${task.description}
            Status: ${this.getStatusDisplay(task.status)}
            Created: ${createdDate}
            ${task.due_date ? `Due Date: ${task.due_date}` : "No due date set"}
        `;
    alert(details);
  }

  updateTaskCounts() {
    const counts = {
      backlog: this.tasks.filter((t) => t.status === "backlog").length,
      todo: this.tasks.filter((t) => t.status === "todo").length,
      in_progress: this.tasks.filter((t) => t.status === "in_progress").length,
      done: this.tasks.filter((t) => t.status === "done").length,
    };

    document.querySelectorAll(".task-count").forEach((element, index) => {
      const statuses = ["backlog", "todo", "in_progress", "done"];
      element.textContent = counts[statuses[index]];
    });
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${
              type === "success"
                ? "#10b981"
                : type === "error"
                ? "#ef4444"
                : "#3b82f6"
            };
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 3000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
            font-size: 14px;
        `;
    notification.textContent = message;

    // Add styles for animation
    const style = document.createElement("style");
    style.textContent = `
            @keyframes slideInRight {
                from { opacity: 0; transform: translateX(100%); }
                to { opacity: 1; transform: translateX(0); }
            }
        `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.animation = "slideInRight 0.3s ease-out reverse";
      setTimeout(() => {
        document.body.removeChild(notification);
        document.head.removeChild(style);
      }, 300);
    }, 3000);
  }

  saveTasks() {
    localStorage.setItem("taskBoardTasks", JSON.stringify(this.tasks));
  }

  // Utility methods for demo and development
  addDemoData() {
    this.loadDemoData();
    this.renderTasks();
    this.updateTaskCounts();
    this.showNotification("Demo data loaded!", "success");
  }

  clearAllTasks() {
    if (
      confirm(
        "Are you sure you want to clear all tasks? This cannot be undone."
      )
    ) {
      this.tasks = [];
      this.saveTasks();
      this.renderTasks();
      this.updateTaskCounts();
      this.showNotification("All tasks cleared!", "success");
    }
  }

  exportTasks() {
    const dataStr = JSON.stringify(this.tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tasks-export.json";
    link.click();
    URL.revokeObjectURL(url);
    this.showNotification("Tasks exported!", "success");
  }

  getTaskStats() {
    const stats = {
      total: this.tasks.length,
      byStatus: {},
      completed: this.tasks.filter((t) => t.status === "done").length,
    };

    ["backlog", "todo", "in_progress", "done"].forEach((status) => {
      stats.byStatus[status] = this.tasks.filter(
        (t) => t.status === status
      ).length;
    });

    console.table(stats);
    return stats;
  }
}

// Initialize the application
let taskBoard;

document.addEventListener("DOMContentLoaded", () => {
  taskBoard = new TaskBoard();

  // Make utility functions available globally for console access
  window.addDemoData = () => taskBoard.addDemoData();
  window.clearAllTasks = () => taskBoard.clearAllTasks();
  window.exportTasks = () => taskBoard.exportTasks();
  window.getTaskStats = () => taskBoard.getTaskStats();

  console.log("Task Board Application Loaded!");
  console.log("Available console commands:");
  console.log("- addDemoData() - Load demo tasks");
  console.log("- clearAllTasks() - Clear all tasks");
  console.log("- exportTasks() - Export tasks to JSON");
  console.log("- getTaskStats() - View task statistics");
});

// Service Worker for offline functionality (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
