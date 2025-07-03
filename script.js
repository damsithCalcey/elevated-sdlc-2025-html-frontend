// Task Board Application
class TaskBoard {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.draggedTask = null;
        
        this.init();
        this.loadDemoData();
        this.attachEventListeners();
        this.renderTasks();
    }

    init() {
        // Load tasks from localStorage
        const savedTasks = localStorage.getItem('taskBoardTasks');
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
                    title: "Model Answer",
                    description: "Create model answer for user authentication",
                    status: "backlog",
                    assignees: [
                        { name: "John Doe" },
                        { name: "Jane Smith" }
                    ],
                    createdAt: new Date('2024-01-15')
                },
                {
                    id: 2,
                    title: "Create calendar, chat and email app pages",
                    description: "Design and implement calendar, chat and email pages",
                    status: "backlog",
                    assignees: [
                        { name: "Alice Johnson" }
                    ],
                    createdAt: new Date('2024-01-16')
                },
                {
                    id: 3,
                    title: "Product Design, Figma, Sketch (Software), Prototypes",
                    description: "Create design prototypes using Figma and Sketch",
                    status: "backlog",
                    assignees: [
                        { name: "Bob Wilson" }
                    ],
                    createdAt: new Date('2024-01-17')
                },
                {
                    id: 4,
                    title: "Change email option process",
                    description: "Update the email notification process",
                    status: "backlog",
                    assignees: [
                        { name: "Charlie Brown" }
                    ],
                    createdAt: new Date('2024-01-18')
                },
                {
                    id: 5,
                    title: "Post launch reminder/Post list",
                    description: "Create post-launch reminder system",
                    status: "backlog",
                    assignees: [
                        { name: "Diana Prince" }
                    ],
                    createdAt: new Date('2024-01-19')
                },
                {
                    id: 6,
                    title: "Model Answer",
                    description: "Review and update model answers",
                    status: "todo",
                    assignees: [
                        { name: "Eve Adams" }
                    ],
                    createdAt: new Date('2024-01-20')
                },
                {
                    id: 7,
                    title: "Add authentication pages",
                    description: "Create login and signup pages",
                    status: "todo",
                    assignees: [
                        { name: "Frank Miller" }
                    ],
                    createdAt: new Date('2024-01-21')
                },
                {
                    id: 8,
                    title: "Profile Page Darkscreen",
                    description: "Implement dark mode for profile page",
                    status: "todo",
                    assignees: [
                        { name: "Grace Kelly" }
                    ],
                    createdAt: new Date('2024-01-22')
                },
                {
                    id: 9,
                    title: "Create calendar, chat and email app pages",
                    description: "Complete the remaining UI components",
                    status: "todo",
                    assignees: [
                        { name: "Henry Ford" }
                    ],
                    createdAt: new Date('2024-01-23')
                },
                {
                    id: 10,
                    title: "Model Answer",
                    description: "Final review of model answers",
                    status: "progress",
                    assignees: [
                        { name: "Ivy Chen" }
                    ],
                    createdAt: new Date('2024-01-24')
                },
                {
                    id: 11,
                    title: "Create calendar, chat and email app pages",
                    description: "Testing and bug fixes",
                    status: "progress",
                    assignees: [
                        { name: "Jack Wilson" }
                    ],
                    createdAt: new Date('2024-01-25')
                },
                {
                    id: 12,
                    title: "Product Design, Figma, Sketch (Software), Prototypes",
                    description: "Design system finalization",
                    status: "done",
                    assignees: [
                        { name: "Kate Brown" }
                    ],
                    createdAt: new Date('2024-01-26')
                }
            ];
            this.saveTasks();
        }
    }

    attachEventListeners() {
        // Modal controls
        const modalOverlay = document.getElementById('modalOverlay');
        const closeModal = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');
        const taskForm = document.getElementById('taskForm');

        closeModal.addEventListener('click', () => this.closeModal());
        cancelBtn.addEventListener('click', () => this.closeModal());
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) this.closeModal();
        });
        taskForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Add task buttons in each column
        const addTaskBtns = document.querySelectorAll('.add-task-btn');
        addTaskBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const status = e.target.closest('.add-task-btn').dataset.status;
                this.openModal(status);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

        // View controls
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleViewChange(btn));
        });

        // Navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => this.handleNavigation(item));
        });

        // Tab buttons
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleTabChange(btn));
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                document.getElementById('searchInput').focus();
            }
        });
    }

    openModal(status = 'backlog') {
        const modalOverlay = document.getElementById('modalOverlay');
        modalOverlay.classList.add('active');
        document.getElementById('taskTitle').focus();
        
        // Set the default status based on which column's add button was clicked
        document.getElementById('taskStatus').value = status;
    }

    closeModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        modalOverlay.classList.remove('active');
        document.getElementById('taskForm').reset();
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const status = document.getElementById('taskStatus').value;

        if (!title) return;

        const newTask = {
            id: Date.now(),
            title,
            description,
            status,
            assignees: [
                { 
                    name: "You"
                }
            ],
            createdAt: new Date()
        };

        this.tasks.push(newTask);
        this.saveTasks();
        this.renderTasks();
        this.updateTaskCounts();
        this.closeModal();
        
        // Show success message
        this.showNotification('Task added successfully!', 'success');
    }

    handleSearch(query) {
        const filteredTasks = this.tasks.filter(task => 
            task.title.toLowerCase().includes(query.toLowerCase()) ||
            task.description.toLowerCase().includes(query.toLowerCase())
        );
        this.renderTasks(filteredTasks);
    }

    handleViewChange(btn) {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Here you could implement different view modes
        // For now, we'll just show a notification
        const viewType = btn.textContent.trim();
        this.showNotification(`Switched to ${viewType}`, 'info');
    }

    handleNavigation(item) {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        const navText = item.querySelector('span').textContent;
        this.showNotification(`Navigated to ${navText}`, 'info');
    }

    handleTabChange(btn) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const tabText = btn.textContent.trim();
        this.showNotification(`Switched to ${tabText} view`, 'info');
    }

    renderTasks(tasksToRender = this.tasks) {
        const columns = {
            backlog: document.getElementById('backlog-tasks'),
            todo: document.getElementById('todo-tasks'),
            progress: document.getElementById('progress-tasks'),
            done: document.getElementById('done-tasks')
        };

        // Clear all columns
        Object.values(columns).forEach(column => {
            column.innerHTML = '';
        });

        // Group tasks by status
        const tasksByStatus = {
            backlog: [],
            todo: [],
            progress: [],
            done: []
        };

        tasksToRender.forEach(task => {
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
                tasks.forEach(task => {
                    const taskElement = this.createTaskElement(task);
                    column.appendChild(taskElement);
                });
            }
        });

        this.attachDragAndDropListeners();
    }

    createTaskElement(task) {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.draggable = true;
        taskCard.dataset.taskId = task.id;

        const assigneesHTML = task.assignees.map(assignee => 
            `<div class="assignee-initials" title="${assignee.name}">${this.getInitials(assignee.name)}</div>`
        ).join('');

        const statusDisplay = task.status.charAt(0).toUpperCase() + task.status.slice(1);

        taskCard.innerHTML = `
            <div class="task-header">
                <h4 class="task-title">${task.title}</h4>
                <button class="task-menu" onclick="taskBoard.showTaskMenu(${task.id})">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
            </div>
            <div class="task-labels">
                <span class="task-label ${task.status}">${statusDisplay}</span>
            </div>
            <div class="task-footer">
                <div class="task-assignees">
                    ${assigneesHTML}
                </div>
            </div>
        `;

        // Add click listener for task details
        taskCard.addEventListener('click', (e) => {
            if (!e.target.closest('.task-menu')) {
                this.showTaskDetails(task);
            }
        });

        return taskCard;
    }

    getEmptyStateHTML(status) {
        const messages = {
            backlog: { icon: 'fas fa-inbox', text: 'No backlog tasks', subtext: 'Tasks will appear here when added to backlog' },
            todo: { icon: 'fas fa-clipboard-list', text: 'No todo tasks', subtext: 'Ready to start tasks will appear here' },
            progress: { icon: 'fas fa-cog', text: 'No tasks in progress', subtext: 'Active tasks will appear here' },
            done: { icon: 'fas fa-check-circle', text: 'No completed tasks', subtext: 'Finished tasks will appear here' }
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
        const taskCards = document.querySelectorAll('.task-card');
        const columns = document.querySelectorAll('.column-content');

        taskCards.forEach(card => {
            card.addEventListener('dragstart', (e) => {
                this.draggedTask = e.target;
                e.target.classList.add('dragging');
            });

            card.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
                this.draggedTask = null;
            });
        });

        columns.forEach(column => {
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                column.parentElement.classList.add('drag-over');
            });

            column.addEventListener('dragleave', (e) => {
                if (!column.contains(e.relatedTarget)) {
                    column.parentElement.classList.remove('drag-over');
                }
            });

            column.addEventListener('drop', (e) => {
                e.preventDefault();
                column.parentElement.classList.remove('drag-over');
                
                if (this.draggedTask) {
                    const taskId = parseInt(this.draggedTask.dataset.taskId);
                    const newStatus = column.parentElement.dataset.status;
                    this.updateTaskStatus(taskId, newStatus);
                }
            });
        });
    }

    updateTaskStatus(taskId, newStatus) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && task.status !== newStatus) {
            task.status = newStatus;
            this.saveTasks();
            this.renderTasks();
            this.updateTaskCounts();
            this.showNotification(`Task moved to ${newStatus}`, 'success');
        }
    }

    showTaskMenu(taskId) {
        // Simple context menu implementation
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            const action = confirm(`Task: ${task.title}\n\nChoose action:\nOK = Delete task\nCancel = Close menu`);
            if (action) {
                this.deleteTask(taskId);
            }
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveTasks();
        this.renderTasks();
        this.updateTaskCounts();
        this.showNotification('Task deleted successfully!', 'success');
    }

    showTaskDetails(task) {
        const details = `
            Title: ${task.title}
            Description: ${task.description}
            Status: ${task.status}
            Created: ${task.createdAt.toLocaleDateString()}
            Assignees: ${task.assignees.map(a => a.name).join(', ')}
        `;
        alert(details);
    }

    updateTaskCounts() {
        const counts = {
            backlog: this.tasks.filter(t => t.status === 'backlog').length,
            todo: this.tasks.filter(t => t.status === 'todo').length,
            progress: this.tasks.filter(t => t.status === 'progress').length,
            done: this.tasks.filter(t => t.status === 'done').length
        };

        document.querySelectorAll('.task-count').forEach((element, index) => {
            const statuses = ['backlog', 'todo', 'progress', 'done'];
            element.textContent = counts[statuses[index]];
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
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
        const style = document.createElement('style');
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
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                document.body.removeChild(notification);
                document.head.removeChild(style);
            }, 300);
        }, 3000);
    }

    saveTasks() {
        localStorage.setItem('taskBoardTasks', JSON.stringify(this.tasks));
    }

    // Utility function to extract initials from a name
    getInitials(name) {
        if (!name) return '';
        const nameParts = name.trim().split(' ');
        if (nameParts.length === 1) {
            return nameParts[0].charAt(0).toUpperCase();
        }
        return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    }

    // Utility methods for demo and development
    addDemoData() {
        this.loadDemoData();
        this.renderTasks();
        this.updateTaskCounts();
        this.showNotification('Demo data loaded!', 'success');
    }

    clearAllTasks() {
        if (confirm('Are you sure you want to clear all tasks? This cannot be undone.')) {
            this.tasks = [];
            this.saveTasks();
            this.renderTasks();
            this.updateTaskCounts();
            this.showNotification('All tasks cleared!', 'success');
        }
    }

    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'tasks-export.json';
        link.click();
        URL.revokeObjectURL(url);
        this.showNotification('Tasks exported!', 'success');
    }

    getTaskStats() {
        const stats = {
            total: this.tasks.length,
            byStatus: {},
            completed: this.tasks.filter(t => t.status === 'done').length
        };

        ['backlog', 'todo', 'progress', 'done'].forEach(status => {
            stats.byStatus[status] = this.tasks.filter(t => t.status === status).length;
        });

        console.table(stats);
        return stats;
    }
}

// Initialize the application
let taskBoard;

document.addEventListener('DOMContentLoaded', () => {
    taskBoard = new TaskBoard();
    
    // Make utility functions available globally for console access
    window.addDemoData = () => taskBoard.addDemoData();
    window.clearAllTasks = () => taskBoard.clearAllTasks();
    window.exportTasks = () => taskBoard.exportTasks();
    window.getTaskStats = () => taskBoard.getTaskStats();
    
    console.log('Task Board Application Loaded!');
    console.log('Available console commands:');
    console.log('- addDemoData() - Load demo tasks');
    console.log('- clearAllTasks() - Clear all tasks');
    console.log('- exportTasks() - Export tasks to JSON');
    console.log('- getTaskStats() - View task statistics');
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
