// Application state is managed via this class
class TaskBoard {
  constructor() {
    this.tasks = [
      {
        id: 1,
        title: "Grocery shopping for the week.",
        description: "Complete the project report by summarizing key findings.",
        dueDate: "2025-07-01",
        completed: false,
      },
      {
        id: 2,
        title: "Read two chapters of the new novel.",
        description: "Schedule a brainstorming session to generate new ideas.",
        dueDate: "2025-07-02",
        completed: false,
      },
      {
        id: 3,
        title: "Finish the report for the marketing team.",
        description: "Prepare a presentation for the marketing team meeting.",
        dueDate: "2025-08-01",
        completed: false,
      },
      {
        id: 4,
        title: "Call Mom to catch up.",
        description:
          "Review the budget proposal and suggest any necessary adjustments.",
        dueDate: "2025-08-01",
        completed: false,
      },
    ];

    this.showCompleted = false;
    this.currentTaskId = null;

    this.init();
  }

  init() {
    this.bindEvents();
    this.renderTasks();
  }

  bindEvents() {
    // DOM element references
    const createModal = document.getElementById("createTaskModal");
    const viewModal = document.getElementById("viewTaskModal");
    const editModal = document.getElementById("editTaskModal");
    const confirmModal = document.getElementById("confirmModal");
    const confirmCompleteModal = document.getElementById(
      "confirmCompleteModal"
    );

    const createBtn = document.querySelector(".create-task-btn");
    const closeBtns = document.querySelectorAll(".close");
    const cancelBtns = document.querySelectorAll(".btn-cancel");
    const editTaskBtn = document.getElementById("editTaskBtn");
    const deleteTaskBtn = document.getElementById("deleteTaskBtn");
    const markCompletedBtn = document.getElementById("markCompletedBtn");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    const confirmCancelBtn = document.getElementById("confirmCancelBtn");
    const confirmCompleteBtn = document.getElementById("confirmCompleteBtn");
    const confirmCompleteCancelBtn = document.getElementById(
      "confirmCompleteCancelBtn"
    );

    const createTaskForm = document.getElementById("createTaskForm");
    const editTaskForm = document.getElementById("editTaskForm");

    createBtn.addEventListener("click", () => {
      this.openModal(createModal);
    });

    // Close modal function
    const closeModal = (modalReference) => {
      modalReference.style.display = "none";
      document.body.style.overflow = "auto";
      // Reset forms
      if (modalReference === createModal) createTaskForm.reset();
      if (modalReference === editModal) editTaskForm.reset();
    };

    // Close button events
    closeBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal");
        closeModal(modal);
      });
    });

    // Cancel button events
    cancelBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal");
        closeModal(modal);
      });
    });

    // Confirmation modal cancel buttons
    confirmCancelBtn.addEventListener("click", () => {
      closeModal(confirmModal);
    });

    confirmCompleteCancelBtn.addEventListener("click", () => {
      closeModal(confirmCompleteModal);
    });

    // Close modal on outside click
    window.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal")) {
        closeModal(e.target);
      }
    });

    // Form submissions
    createTaskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.createTask();
      closeModal(createModal);
    });

    editTaskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.updateTask();
      closeModal(editModal);
    });

    // Task actions
    editTaskBtn.addEventListener("click", () => {
      closeModal(viewModal);
      this.openEditModal();
    });

    deleteTaskBtn.addEventListener("click", () => {
      closeModal(editModal);
      this.openConfirmModal();
    });

    confirmDeleteBtn.addEventListener("click", () => {
      this.deleteTask(this.currentTaskId);
      closeModal(confirmModal);
    });

    markCompletedBtn.addEventListener("click", () => {
      closeModal(viewModal);
      const task = this.tasks.find((t) => t.id === this.currentTaskId);
      if (task && !task.completed) {
        this.openConfirmCompleteModal();
      } else {
        this.toggleTask(this.currentTaskId);
      }
    });

    confirmCompleteBtn.addEventListener("click", () => {
      this.toggleTask(this.currentTaskId);
      closeModal(confirmCompleteModal);
    });

    const searchInput = document.querySelector(".search-box input");
    searchInput.addEventListener("input", (e) => {
      this.searchTasks(e.target.value);
    });

    // show only completed tasks toggle
    const viewBtn = document.querySelector(".view-btn");
    viewBtn.addEventListener("click", () => {
      this.toggleShowCompleted();
      if (this.showCompleted) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Sidebar navigation (not implemented)
    const navItems = document.querySelectorAll(".nav-section li");
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        // Remove active class from all items
        navItems.forEach((nav) => nav.classList.remove("active"));
        // Add active class to clicked item (except add project)
        if (!item.classList.contains("add-project")) {
          item.classList.add("active");
        }
      });
    });
  }

  createTask() {
    const title = document.getElementById("createTaskTitle").value;
    const description = document.getElementById("createTaskDescription").value;
    const dueDate = document.getElementById("createTaskDate").value;

    const newTask = {
      id: Date.now(),
      title: title,
      description: description,
      dueDate: dueDate,
      completed: false,
    };

    this.tasks.push(newTask);
    this.renderTasks();
    this.showNotification("Task created successfully!");
  }

  updateTask() {
    const title = document.getElementById("editTaskTitle").value;
    const description = document.getElementById("editTaskDescription").value;
    const dueDate = document.getElementById("editTaskDate").value;

    const task = this.tasks.find((t) => t.id === this.currentTaskId);
    if (task) {
      task.title = title;
      task.description = description;
      task.dueDate = dueDate;
      this.renderTasks();
      this.showNotification("Task updated successfully!");
    }
  }

  openModal(modal) {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  openViewModal(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) return;

    this.currentTaskId = taskId;

    // Populate view modal
    document.getElementById("viewTaskTitle").textContent = task.title;
    document.getElementById("viewTaskDescription").textContent =
      task.description || "No description";
    // document.getElementById("viewTaskDate").textContent =
    //   this.formatDateForDisplay(task.dueDate);

    // Update mark completed button text
    const markBtn = document.getElementById("markCompletedBtn");
    markBtn.textContent = task.completed ? "Mark Incomplete" : "Mark Completed";
    markBtn.className = task.completed ? "btn-cancel" : "btn-success";

    this.openModal(document.getElementById("viewTaskModal"));
  }

  openEditModal() {
    const task = this.tasks.find((t) => t.id === this.currentTaskId);
    if (!task) return;

    // Populate edit modal
    document.getElementById("editTaskTitle").value = task.title;
    document.getElementById("editTaskDescription").value =
      task.description || "";
    document.getElementById("editTaskDate").value = task.dueDate;

    this.openModal(document.getElementById("editTaskModal"));
  }

  openConfirmModal() {
    this.openModal(document.getElementById("confirmModal"));
  }

  openConfirmCompleteModal() {
    this.openModal(document.getElementById("confirmCompleteModal"));
  }

  formatDateForDisplay(dateString) {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  }

  deleteTask(taskId) {
    // this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.renderTasks();
    this.showNotification("Task deleted successfully!");
  }

  toggleTask(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.renderTasks();
    }
  }

  toggleShowCompleted() {
    this.showCompleted = !this.showCompleted;
    this.renderTasks();
  }

  searchTasks(query) {
    const taskCards = document.querySelectorAll(".task-card");

    taskCards.forEach((card) => {
      const title = card.querySelector("h3").textContent.toLowerCase();
      const description = card.querySelector("p").textContent.toLowerCase();
      const searchTerm = query.toLowerCase();

      if (title.includes(searchTerm) || description.includes(searchTerm)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);

    const options = { day: "2-digit", month: "short", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options);

    // Determine if date is overdue or upcoming
    const isOverdue = taskDate < today;
    const className = isOverdue ? "overdue" : "upcoming";

    return { formatted: formattedDate, className };
  }

  renderTasks() {
    const taskBoard = document.getElementById("task-board");

    // Filter tasks based on showCompleted setting
    // const tasksToShow = this.showCompleted
    //   ? this.tasks
    //   : this.tasks.filter((task) => !task.completed);

    taskBoard.innerHTML = this.tasks.map((task) => {
      const dateInfo = this.formatDate(task.dueDate);
      return `
              <div class="task-card ${task.completed ? "completed" : ""}" data-task-id="${task.id}" onclick="taskBoard.openViewModal(${task.id})">
                  <div class="task-header">
                      <h3>${task.title}</h3>
                      <div class="task-date ${dateInfo.className}">${dateInfo.formatted}</div>
                  </div>
                  <p>${task.description || "No description"}</p>
              </div>
          `;
    }).join("");
  }

  showNotification(message) {
    // Create notification element
    const notification = document.createElement("div");
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            z-index: 1001;
            font-size: 14px;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// Initialize the application
const taskBoard = new TaskBoard();

document.addEventListener("DOMContentLoaded", function () {
  // Animate task cards on load
  const taskCards = document.querySelectorAll(".task-card");
  taskCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";

    setTimeout(() => {
      card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 100);
  });

  // Add keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    // Ctrl/Cmd + N to create new task
    if ((e.ctrlKey || e.metaKey) && e.key === "n") {
      e.preventDefault();
      document.querySelector(".create-task-btn").click();
    }

    // Escape to close modal
    if (e.key === "Escape") {
      const modal = document.getElementById("taskModal");
      if (modal.style.display === "block") {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    }
  });

  // Add drag and drop functionality for task reordering
  let draggedElement = null;

  document.addEventListener("dragstart", function (e) {
    if (e.target.classList.contains("task-card")) {
      draggedElement = e.target;
      e.target.style.opacity = "0.5";
    }
  });

  document.addEventListener("dragend", function (e) {
    if (e.target.classList.contains("task-card")) {
      e.target.style.opacity = "1";
      draggedElement = null;
    }
  });

  document.addEventListener("dragover", function (e) {
    e.preventDefault();
  });

  document.addEventListener("drop", function (e) {
    e.preventDefault();
    if (draggedElement && e.target.classList.contains("task-card")) {
      const taskBoard = e.target.closest(".task-board");
      const afterElement = getDragAfterElement(taskBoard, e.clientY);

      if (afterElement == null) {
        taskBoard.appendChild(draggedElement);
      } else {
        taskBoard.insertBefore(draggedElement, afterElement);
      }
    }
  });

  function getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll(".task-card:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  // Make task cards draggable
  const makeCardsDraggable = () => {
    const cards = document.querySelectorAll(".task-card");
    cards.forEach((card) => {
      card.draggable = true;
    });
  };

  // Initial call and after each render
  makeCardsDraggable();

  // Override the renderTasks method to include draggable
  const originalRenderTasks = taskBoard.renderTasks;
  taskBoard.renderTasks = function () {
    originalRenderTasks.call(this);
    makeCardsDraggable();
  };
});
